// cart.js: one script for the Menu page, the shop page and the bag page.
//
// Menu.html : quantity +/- buttons and "Add to bag"
// shop.html : "Add to bag" buttons and the Bag (n) count in the header
// bag.html  : shows the saved bag, quantity +/- , Remove, and the totals
//
// The bag is saved in the browser (localStorage), so no PHP or database is needed yet.
// Use this INSTEAD of Js/script.js on Menu.html (it already handles the quantity buttons).
(function () {
  var KEY = 'maicookies-bag';
  var DELIVERY_FEE = 50; // Rs, charged when the bag has items. Change to suit the shop.
  var MAX_QTY = 200;
  // true  -> Checkout shows a "not set up yet" note (works in Live Server)
  // false -> Checkout goes to checkout.php (needs XAMPP or similar)
  var CHECKOUT_TEST_MODE = true;

  // ---------- Saved bag ----------
  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      /* storage blocked: the bag just won't persist */
    }
    updateBagCount();
  }

  // ---------- Helpers ----------
  function clampQty(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1) return 1;
    return Math.min(n, MAX_QTY);
  }

  function parsePrice(text) {
    return parseInt(String(text).replace(/[^0-9]/g, ''), 10) || 0;
  }

  function rs(n) {
    return 'Rs ' + n.toLocaleString('en-US');
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Number in the header's "Bag (n)" link, if the page has one
  function updateBagCount() {
    var counter = document.getElementById('bag-count');
    if (!counter) return;
    var total = load().reduce(function (sum, item) { return sum + item.qty; }, 0);
    counter.textContent = String(total);
  }

  function addItem(name, price, image, qty) {
    var items = load();
    var existing = items.filter(function (item) { return item.name === name; })[0];
    if (existing) {
      existing.qty = Math.min(MAX_QTY, existing.qty + qty);
    } else {
      items.push({ name: name, price: price, image: image || '', qty: qty });
    }
    save(items);
  }

  // Short "Added!" confirmation on a button
  function flash(button) {
    var original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = 'Added!';
    clearTimeout(button._timer);
    button._timer = setTimeout(function () {
      button.textContent = original;
    }, 1200);
  }

  updateBagCount();
  window.addEventListener('pageshow', updateBagCount); // after the Back button

  // ================= MENU + SHOP PAGES =================
  document.addEventListener('click', function (event) {
    // Menu page: quantity - / +
    var stepBtn = event.target.closest('.qty-btn');
    if (stepBtn) {
      var input = stepBtn.parentElement.querySelector('.qty-input');
      input.value = clampQty((parseInt(input.value, 10) || 1) + Number(stepBtn.dataset.step));
      return;
    }

    // Menu page: Add to bag
    var addBtn = event.target.closest('.add-btn');
    if (addBtn) {
      var card = addBtn.closest('.card');
      var qtyInput = card.querySelector('.qty-input');
      var img = card.querySelector('.card-image img');
      addItem(
        card.querySelector('.card-header h2').textContent.trim(),
        parsePrice(card.querySelector('.price').textContent),
        img ? img.getAttribute('src') : '',
        clampQty(qtyInput.value)
      );
      qtyInput.value = 1;
      flash(addBtn);
      return;
    }

    // Shop page: Add to bag (name and price come from the button's data attributes)
    var shopBtn = event.target.closest('.shop-add');
    if (shopBtn) {
      addItem(shopBtn.dataset.name, parsePrice(shopBtn.dataset.price), '', 1);
      flash(shopBtn);
    }
  });

  // Typing a quantity directly: keep it between 1 and MAX_QTY
  document.addEventListener('change', function (event) {
    if (event.target.classList && event.target.classList.contains('qty-input')) {
      event.target.value = clampQty(event.target.value);
    }
  });

  // ================= MOBILE MENU BUTTON =================
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('main-nav') || document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // ================= BAG PAGE =================
  var list = document.getElementById('bag-items');
  if (!list) return;

  var layout = document.getElementById('bag-layout') || document.querySelector('.bag-layout');
  var emptyBox = document.getElementById('empty-bag');
  var summary = document.getElementById('summary') || document.querySelector('.summary');
  var subtotalEl = document.getElementById('subtotal');
  var deliveryEl = document.getElementById('delivery');
  var totalEl = document.getElementById('total');
  var checkoutBtn = document.getElementById('checkout-btn') || document.querySelector('.summary .btn-block');
  var checkoutNote = document.getElementById('checkout-note');

  if (!layout || !emptyBox || !summary || !subtotalEl || !deliveryEl || !totalEl || !checkoutBtn) return;

  // Create the checkout note if the page doesn't have one
  if (!checkoutNote) {
    checkoutNote = el('p', 'checkout-note',
      "Checkout isn't set up yet. This button will place your order once it is.");
    checkoutNote.id = 'checkout-note';
    checkoutNote.setAttribute('role', 'status');
    checkoutNote.hidden = true;
    checkoutBtn.parentNode.insertBefore(checkoutNote, checkoutBtn.nextSibling);
  }

  function buildRow(item, index, items) {
    var row = el('article', 'bag-row');

    var thumb;
    if (item.image) {
      thumb = el('img', 'bag-thumb');
      thumb.src = item.image;
      thumb.alt = item.name + ' cookie';
    } else {
      // Shop items have no photo: show a simple cookie tile instead
      thumb = el('div', 'bag-thumb bag-thumb--blank', '\uD83C\uDF6A');
      thumb.setAttribute('aria-hidden', 'true');
    }
    row.appendChild(thumb);

    var info = el('div', 'bag-info');
    info.appendChild(el('h3', '', item.name));
    info.appendChild(el('p', 'bag-price', rs(item.price)));
    row.appendChild(info);

    var qtyBox = el('div', 'bag-qty');
    qtyBox.setAttribute('role', 'group');
    qtyBox.setAttribute('aria-label', 'Quantity for ' + item.name);

    var minus = el('button', '', '\u2212');
    minus.type = 'button';
    minus.setAttribute('aria-label', 'Decrease quantity');
    minus.disabled = item.qty <= 1;
    minus.addEventListener('click', function () {
      items[index].qty = Math.max(1, items[index].qty - 1);
      save(items);
      render();
    });

    var count = el('span', '', String(item.qty));

    var plus = el('button', '', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', 'Increase quantity');
    plus.disabled = item.qty >= MAX_QTY;
    plus.addEventListener('click', function () {
      items[index].qty = Math.min(MAX_QTY, items[index].qty + 1);
      save(items);
      render();
    });

    qtyBox.appendChild(minus);
    qtyBox.appendChild(count);
    qtyBox.appendChild(plus);
    row.appendChild(qtyBox);

    row.appendChild(el('p', 'row-total', rs(item.price * item.qty)));

    var remove = el('button', 'remove', 'Remove');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Remove ' + item.name + ' from bag');
    remove.addEventListener('click', function () {
      items.splice(index, 1);
      save(items);
      render();
    });
    row.appendChild(remove);

    return row;
  }

  function render() {
    var items = load();
    list.innerHTML = '';
    checkoutNote.hidden = true;

    if (items.length === 0) {
      list.hidden = true;
      summary.hidden = true;
      emptyBox.hidden = false;
      layout.classList.add('is-empty');
      return;
    }

    list.hidden = false;
    summary.hidden = false;
    emptyBox.hidden = true;
    layout.classList.remove('is-empty');

    var subtotal = 0;
    items.forEach(function (item, index) {
      subtotal += item.price * item.qty;
      list.appendChild(buildRow(item, index, items));
    });

    subtotalEl.textContent = rs(subtotal);
    deliveryEl.textContent = rs(DELIVERY_FEE);
    totalEl.textContent = rs(subtotal + DELIVERY_FEE);
  }

  // Testing mode: no checkout page yet, so show a note instead of leaving the page
  checkoutBtn.addEventListener('click', function (event) {
    if (CHECKOUT_TEST_MODE) {
      event.preventDefault();
      checkoutNote.hidden = false;
    }
  });

  render();
})();