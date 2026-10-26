const MIN = 1;
const MAX = 200;

document.querySelectorAll('.qty').forEach(wrapper => {
  const input = wrapper.querySelector('.qty-input');
  const minusBtn = wrapper.querySelector('[data-step="-1"]');
  const plusBtn = wrapper.querySelector('[data-step="1"]');

  // Clamp a value into the allowed range (falls back to MIN if not a number)
  const clamp = value => {
    const n = parseInt(value, 10);
    if (isNaN(n)) return MIN;
    return Math.min(MAX, Math.max(MIN, n));
  };

  // Disable +/- when at the limits
  const refreshButtons = () => {
    const current = parseInt(input.value, 10) || MIN;
    minusBtn.disabled = current <= MIN;
    plusBtn.disabled = current >= MAX;
  };

  const setValue = value => {
    input.value = clamp(value);
    refreshButtons();
  };

  // +/- buttons
 [minusBtn, plusBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            setValue(
                (parseInt(input.value, 10) || MIN) +
                Number(btn.dataset.step)
            );
        });
    }
  });

  // Only allow digits while typing or pasting
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '');
    if (input.value !== '' && Number(input.value) > MAX) {
      input.value = MAX;
    }
    refreshButtons();
  });

  // Block keys that can produce invalid numbers
  input.addEventListener('keydown', e => {
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      setValue(input.value);
      input.blur();
    }
  });

  // Enforce the minimum when the user leaves the field
  input.addEventListener('blur', () => setValue(input.value));

  refreshButtons();
});



//contact js//
// Contact form: validation + testing-mode confirmation.
//
// TEST_MODE = true  -> after the form validates, show a "Message sent" panel.
//                      Nothing is actually sent (works in Live Server).
// TEST_MODE = false -> after the form validates, submit normally to
//                      process_contact.php (needs XAMPP or similar).
(function () {
  var TEST_MODE = false;

  var form = document.querySelector('.form');
  if (!form) return;

  var success = document.getElementById('form-success');
  var sendAnother = document.getElementById('send-another');

  var rules = {
    name: function (value) {
      return value.trim() ? '' : 'Enter your name.';
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ''
        : 'Enter a valid email address, like name@example.com.';
    },
    message: function (value) {
      return value.trim().length >= 10
        ? ''
        : 'Write at least 10 characters so we know how to help.';
    }
  };

  function check(field) {
    var message = rules[field.name](field.value);
    var errorEl = document.getElementById(field.id + '-error');
    errorEl.textContent = message;
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
    return message === '';
  }

  var fields = Object.keys(rules).map(function (name) {
    return form.elements[name];
  });

  // Re-check a field as the person fixes it, once it has been flagged
  fields.forEach(function (field) {
    field.addEventListener('blur', function () {
      if (field.value !== '') check(field);
    });
    field.addEventListener('input', function () {
      if (field.hasAttribute('aria-invalid')) check(field);
    });
  });

  form.addEventListener('submit', function (event) {
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!check(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
      return;
    }

    event.preventDefault();

    function showSuccess() {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }

    if (TEST_MODE) {
      showSuccess();
      return;
    }

    var sendButton = form.querySelector('button[type="submit"]');
    var messageError = document.getElementById('message-error');
    sendButton.disabled = true;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        sendButton.disabled = false;
        if (this.status == 200) {
          showSuccess();
        } else if (this.status == 0) {
          messageError.textContent = 'Could not reach the server. Please try again.';
        } else {
          messageError.textContent = this.responseText;
        }
      }
    };
    xhttp.open('POST', 'php/process_contact.php', true);
    xhttp.send(new FormData(form));
  });

  if (sendAnother && success) {
    sendAnother.addEventListener('click', function () {
      form.reset();
      success.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
})();


//cart js//

const menuButton = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuButton && mainNav) {
    menuButton.addEventListener("click", function () {
        mainNav.classList.toggle("is-open");

        const isOpen = mainNav.classList.contains("is-open");

        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

        menuButton.textContent = isOpen ? "Close" : "Menu";
    });
}


/* MAICOOKIES BAG */

const BAG_KEY = "maiCookiesBag";

function getBag() {
  try {
    return JSON.parse(localStorage.getItem(BAG_KEY)) || [];
  } catch {
    return [];
  }
}

function saveBag(bag) {
  localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  updateBagCount();
}

function updateBagCount() {
  const countElement = document.getElementById("bag-count");

  if (countElement) {
    const count = getBag().reduce(
      (sum, cookie) => sum + cookie.quantity, 0
    );
    countElement.textContent = count;
  }
}

/* ADD TO BAG BUTTONS */

document.querySelectorAll(".btn-small[data-name]").forEach(function(button) {
  button.addEventListener("click", function() {
    const name = button.dataset.name;
    const price = Number(
      String(button.dataset.price).replace(/[^\d.]/g, "")
    );

    if (!name || !Number.isFinite(price) || price <= 0) {
      alert("Please check the cookie name and price.");
      return;
    }

    let bag;

    try {
      bag = JSON.parse(localStorage.getItem("maiCookiesBag")) || [];
    } catch {
      bag = [];
    }

    const existingCookie = bag.find(function(cookie) {
      return cookie.name === name;
    });

    if (existingCookie) {
      existingCookie.quantity = Math.min(
        200,
        existingCookie.quantity + 1
      );
    } else {
      bag.push({
        name: name,
        price: price,
        quantity: 1
      });
    }

    localStorage.setItem("maiCookiesBag", JSON.stringify(bag));

    // Update the bag count in the header
    const countElement = document.getElementById("bag-count");

    if (countElement) {
      countElement.textContent = bag.reduce(function(total, cookie) {
        return total + cookie.quantity;
      }, 0);
    }

    // Show a short confirmation
    const originalText = button.textContent;
    button.textContent = "Added!";
    button.disabled = true;

    setTimeout(function() {
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  });
});

/* DISPLAY BAG AND QUANTITY BUTTONS */

function renderBag() {
  const container = document.getElementById("bag-items");
  if (!container) return;

  const emptyMessage = document.getElementById("empty-bag");
  const bag = getBag();

  container.innerHTML = "";

  if (emptyMessage) {
    emptyMessage.hidden = bag.length > 0;
  }

  bag.forEach(cookie => {
    const row = document.createElement("article");
    row.className = "bag-row";

    const info = document.createElement("div");
    info.className = "bag-item-info";

    const name = document.createElement("h3");
    name.textContent = cookie.name;

    const price = document.createElement("p");
    price.textContent = "Rs " + cookie.price.toFixed(2) + " each";

    info.append(name, price);

    const quantity = document.createElement("div");
    quantity.className = "qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease " + cookie.name);
    minus.disabled = cookie.quantity <= 1;

    const number = document.createElement("span");
    number.className = "qty-value";
    number.textContent = cookie.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase " + cookie.name);
    plus.disabled = cookie.quantity >= 200;

    minus.addEventListener("click", () => changeQuantity(cookie.name, -1));
    plus.addEventListener("click", () => changeQuantity(cookie.name, 1));

    quantity.append(minus, number, plus);

    const rowTotal = document.createElement("strong");
    rowTotal.textContent =
      "Rs " + (cookie.price * cookie.quantity).toFixed(2);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      saveBag(getBag().filter(item => item.name !== cookie.name));
      renderBag();
    });

    row.append(info, quantity, rowTotal, remove);
    container.appendChild(row);
  });

  updateTotals();
  updateBagCount();
}

function changeQuantity(name, amount) {
  const bag = getBag();
  const cookie = bag.find(item => item.name === name);

  if (!cookie) return;

  cookie.quantity = Math.max(
    1,
    Math.min(200, cookie.quantity + amount)
  );

  saveBag(bag);
  renderBag();
}

function updateTotals() {
  const bag = getBag();

  const subtotal = bag.reduce(
    (sum, cookie) => sum + cookie.price * cookie.quantity, 0
  );

  const delivery = subtotal === 0 ? 0 : 50;

  const subtotalElement = document.getElementById("subtotal");
  const deliveryElement = document.getElementById("delivery");
  const totalElement = document.getElementById("total");

  if (subtotalElement) {
    subtotalElement.textContent = "Rs " + subtotal.toFixed(2);
  }

  if (deliveryElement) {
    deliveryElement.textContent = "Rs " + delivery.toFixed(2);
  }

  if (totalElement) {
    totalElement.textContent = "Rs " + (subtotal + delivery).toFixed(2);
  }
}

renderBag();

/* COOKIE FILTERS */

document.querySelectorAll(".filter").forEach(function(button) {
  button.addEventListener("click", function() {
    const selectedFilter = button.dataset.filter;

    // Show or hide each cookie
    document.querySelectorAll(".product").forEach(function(product) {
      if (
        selectedFilter === "all" ||
        product.dataset.category === selectedFilter
      ) {
        product.style.display = "";
      } else {
        product.style.display = "none";
      }
    });

    // Move the active class to the clicked button
    document.querySelectorAll(".filter").forEach(function(filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
  });
});



/* MAICOOKIES BAG PAGE */

const BAG_STORAGE_KEY = "maiCookiesBag";
const DELIVERY_FEE = 50;

function readSavedBag() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(BAG_STORAGE_KEY)
    );

    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveBagItems(items) {
  localStorage.setItem(
    BAG_STORAGE_KEY,
    JSON.stringify(items)
  );
}

function updateBagPage() {
  const bagContainer = document.getElementById("bag-items");

  // Do nothing on pages that don't have the bag container
  if (!bagContainer) return;

  const emptyMessage = document.getElementById("empty-bag");
  const subtotalElement = document.getElementById("subtotal");
  const deliveryElement = document.getElementById("delivery");
  const totalElement = document.getElementById("total");
  const countElement = document.getElementById("bag-count");

  const bag = readSavedBag().filter(function (item) {
    return item &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) > 0 &&
      Number.isFinite(Number(item.quantity)) &&
      Number(item.quantity) > 0;
  });

  bagContainer.innerHTML = "";

  let subtotal = 0;
  let itemCount = 0;

  bag.forEach(function (item, index) {
    item.price = Number(item.price);
    item.quantity = Math.floor(Number(item.quantity));

    const rowTotal = item.price * item.quantity;
    subtotal += rowTotal;
    itemCount += item.quantity;

    const row = document.createElement("article");
    row.className = "bag-row";

    const info = document.createElement("div");
    info.className = "bag-item-info";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = "Rs " + item.price + " each";

    info.append(name, price);

    const controls = document.createElement("div");
    controls.className = "qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease " + item.name);
    minus.dataset.bagStep = "-1";
    minus.disabled = item.quantity <= 1;

    const quantity = document.createElement("span");
    quantity.className = "qty-value";
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase " + item.name);
    plus.dataset.bagStep = "1";
    plus.disabled = item.quantity >= 200;

    controls.append(minus, quantity, plus);

    const amount = document.createElement("p");
    amount.textContent = "Rs " + rowTotal;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.dataset.removeItem = String(index);

    row.append(info, controls, amount, remove);
    bagContainer.appendChild(row);
  });

  saveBagItems(bag);

  const isEmpty = bag.length === 0;

  if (emptyMessage) emptyMessage.hidden = !isEmpty;
  bagContainer.hidden = isEmpty;

  const delivery = isEmpty ? 0 : DELIVERY_FEE;

  if (subtotalElement) {
    subtotalElement.textContent = "Rs " + subtotal;
  }

  if (deliveryElement) {
    deliveryElement.textContent = "Rs " + delivery;
  }

  if (totalElement) {
    totalElement.textContent = "Rs " + (subtotal + delivery);
  }

  if (countElement) {
    countElement.textContent = itemCount;
  }
}

// Handle quantity and remove buttons
document.addEventListener("click", function (event) {
  const bagContainer = document.getElementById("bag-items");

  if (!bagContainer || !bagContainer.contains(event.target)) {
    return;
  }

  const button = event.target.closest("button");
  if (!button) return;

  let bag = readSavedBag();

  if (button.dataset.bagStep) {
    const row = button.closest(".bag-row");
    const rows = Array.from(bagContainer.children);
    const index = rows.indexOf(row);

    if (index < 0 || !bag[index]) return;

    const change = Number(button.dataset.bagStep);
    const newQuantity = Number(bag[index].quantity) + change;

    if (newQuantity < 1 || newQuantity > 200) return;

    bag[index].quantity = newQuantity;
    saveBagItems(bag);
    updateBagPage();
  }

  if (button.dataset.removeItem !== undefined) {
    const index = Number(button.dataset.removeItem);

    if (!Number.isInteger(index) || !bag[index]) return;

    bag.splice(index, 1);
    saveBagItems(bag);
    updateBagPage();
  }
});

// Update the bag when the page opens
updateBagPage();

// Update if another page or browser tab changes the bag
window.addEventListener("storage", updateBagPage);
