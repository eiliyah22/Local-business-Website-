(function () {
  var KEY = 'maicookies-bag';
  var MAX_QTY = 200;

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
    } catch (e) {}
    updateBagCount();
    renderModalBag(); 
  }

  function clampQty(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1) return 1;
    return Math.min(n, MAX_QTY);
  }

  function parsePrice(text) {
    return parseInt(String(text).replace(/[^0-9]/g, ''), 10) || 0;
  }

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

  function flash(button) {
    var original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = 'Added!';
    clearTimeout(button._timer);
    button._timer = setTimeout(function () {
      button.textContent = original;
    }, 1200);
  }

  function renderModalBag() {
    var container = document.getElementById('modal-cart-items');
    var subtotalDisplay = document.getElementById('modal-subtotal');
    
    if (!container || !subtotalDisplay) return; 

    var items = load();
    container.innerHTML = ''; 
    var subtotal = 0; 

    if (items.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; padding: 20px 0;">Your bag is empty.</p>';
    } else {
        items.forEach(function(item) {
            subtotal += item.price * item.qty; 

            var itemHTML = `
                <div class="cart-item">
                    <div class="item-image-wrapper">
                        <img src="${item.image || 'images/image1.png'}" alt="${item.name}" class="item-img">
                    </div>
                    <div class="item-details">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p>${item.qty}x Rs ${item.price}</p>
                        </div>
                        <button class="remove-item-btn" data-name="${item.name}" aria-label="Remove ${item.name}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });
    }
    subtotalDisplay.textContent = 'Rs ' + subtotal;
  }

  updateBagCount();
  renderModalBag(); 
  window.addEventListener('pageshow', updateBagCount); 

  document.addEventListener('click', function (event) {
    var stepBtn = event.target.closest('.qty-btn');
    if (stepBtn) {
      var input = stepBtn.parentElement.querySelector('.qty-input');
      input.value = clampQty((parseInt(input.value, 10) || 1) + Number(stepBtn.dataset.step));
      return;
    }

    var removeBtn = event.target.closest('.remove-item-btn');
    if (removeBtn) {
      var nameToRemove = removeBtn.dataset.name;
      var items = load();
      var updatedItems = items.filter(function (item) {
        return item.name !== nameToRemove;
      });
      save(updatedItems);
      return;
    }

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

    var shopBtn = event.target.closest('.shop-add');
    if (shopBtn) {
      addItem(shopBtn.dataset.name, parsePrice(shopBtn.dataset.price), '', 1);
      flash(shopBtn);
    }
  });

  document.addEventListener('change', function (event) {
    if (event.target.classList && event.target.classList.contains('qty-input')) {
      event.target.value = clampQty(event.target.value);
    }
  });

})();