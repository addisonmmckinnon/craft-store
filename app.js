/* ──────────────────────────────────────────────
   PRODUCT CATALOG
   Placeholder items/prices — Addy & cousin: update these with your real
   products! "maker" is just for display (who makes it).
   ────────────────────────────────────────────── */
const PRODUCTS = [
  { id: "keychain-3d", name: "Custom 3D Keychain", maker: "3D Printed", price: 5 },
  { id: "phone-stand", name: "Phone Stand", maker: "3D Printed", price: 8 },
  { id: "fidget-spinner", name: "Fidget Spinner", maker: "3D Printed", price: 6 },
  { id: "desk-organizer", name: "Desk Organizer", maker: "3D Printed", price: 12 },
  { id: "name-sign", name: "Custom Name Sign", maker: "3D Printed", price: 15 },
  { id: "paper-squishy-strawberry", name: "Paper Squishy - Strawberry", maker: "Paper Squishy", price: 4 },
  { id: "paper-squishy-donut", name: "Paper Squishy - Donut", maker: "Paper Squishy", price: 4 },
  { id: "balloon-squishy", name: "Balloon Squishy", maker: "Balloon Squishy", price: 3 },
  { id: "balloon-squishy-glitter", name: "Balloon Squishy - Glitter", maker: "Balloon Squishy", price: 4 },
  { id: "squishy-bundle", name: "Squishy Bundle (3-Pack)", maker: "Squishy Bundle", price: 10 },
  { id: "articulated-dragon", name: "Articulated Dragon", maker: "3D Printed", price: 14, limited: true },
  { id: "gyro-fidget", name: "Gyro Fidget", maker: "3D Printed", price: 9, limited: true },
  { id: "infinity-cube", name: "Infinity Cube", maker: "3D Printed", price: 10, limited: true },
  { id: "flexi-animal", name: "Flexi Animal", maker: "3D Printed", price: 11, limited: true },
  { id: "mini-viral-vase", name: "Mini Viral Vase", maker: "3D Printed", price: 8, limited: true },
];

/* ──────────────────────────────────────────────
   CART (localStorage) — shared by every page
   ────────────────────────────────────────────── */
function getCart() {
  const saved = localStorage.getItem("craftCart");
  return saved ? JSON.parse(saved) : {};
}

function setCart(cart) {
  localStorage.setItem("craftCart", JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  setCart(cart);
}

function setQuantity(productId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  setCart(cart);
}

function cartCount() {
  return Object.values(getCart()).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  const cart = getCart();
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
}

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function updateCartBadges() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = cartCount();
  });
}

updateCartBadges();

/* ──────────────────────────────────────────────
   SHOP PAGE (shop.html)
   ────────────────────────────────────────────── */
const productGrid = document.getElementById("product-grid");

if (productGrid) {
  PRODUCTS.filter((product) => !product.limited).forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const photo = document.createElement("div");
    photo.className = "product-photo";
    photo.textContent = "photo coming soon";

    const maker = document.createElement("div");
    maker.className = "product-maker";
    maker.textContent = product.maker;

    const name = document.createElement("div");
    name.className = "product-name";
    name.textContent = product.name;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatMoney(product.price);

    const addButton = document.createElement("button");
    addButton.className = "btn btn-secondary btn-small";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    card.appendChild(photo);
    card.appendChild(maker);
    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(addButton);
    productGrid.appendChild(card);
  });
}

/* ──────────────────────────────────────────────
   LIMITED EDITION PAGE (limited.html)
   Splits the limited 3D-printed items across a few "floating shelves"
   — see .shelf-bar in style.css for the shelf illusion (a thick bar with
   a shadow underneath the row of items).
   ────────────────────────────────────────────── */
const shelvesContainer = document.getElementById("shelves");

if (shelvesContainer) {
  const limitedProducts = PRODUCTS.filter((product) => product.limited);
  const ITEMS_PER_SHELF = 3;

  for (let i = 0; i < limitedProducts.length; i += ITEMS_PER_SHELF) {
    const shelfItems = limitedProducts.slice(i, i + ITEMS_PER_SHELF);

    const shelf = document.createElement("div");
    shelf.className = "shelf";

    const itemsRow = document.createElement("div");
    itemsRow.className = "shelf-items";

    shelfItems.forEach((product) => {
      const item = document.createElement("div");
      item.className = "shelf-item";

      const photo = document.createElement("div");
      photo.className = "product-photo";
      photo.textContent = "photo coming soon";

      const badge = document.createElement("div");
      badge.className = "limited-badge";
      badge.textContent = "Limited Edition";

      const name = document.createElement("div");
      name.className = "product-name";
      name.textContent = product.name;

      const price = document.createElement("div");
      price.className = "product-price";
      price.textContent = formatMoney(product.price);

      const addButton = document.createElement("button");
      addButton.className = "btn btn-secondary btn-small";
      addButton.textContent = "Add to Cart";
      addButton.addEventListener("click", () => addToCart(product.id));

      item.appendChild(badge);
      item.appendChild(photo);
      item.appendChild(name);
      item.appendChild(price);
      item.appendChild(addButton);
      itemsRow.appendChild(item);
    });

    const shelfBar = document.createElement("div");
    shelfBar.className = "shelf-bar";

    shelf.appendChild(itemsRow);
    shelf.appendChild(shelfBar);
    shelvesContainer.appendChild(shelf);
  }
}

/* ──────────────────────────────────────────────
   CART / ORDER PAGE (order.html)
   ────────────────────────────────────────────── */
const cartListEl = document.getElementById("cart-list");

if (cartListEl) {
  const emptyStateEl = document.getElementById("cart-empty-state");
  const cartTotalEl = document.getElementById("cart-total-amount");
  const orderForm = document.getElementById("order-form");
  const orderSummaryInput = document.getElementById("order-summary");

  function renderCart() {
    const cart = getCart();
    const entries = Object.entries(cart);
    cartListEl.innerHTML = "";

    if (entries.length === 0) {
      emptyStateEl.classList.remove("hidden");
      if (orderForm) orderForm.classList.add("hidden");
      cartTotalEl.textContent = formatMoney(0);
      return;
    }
    emptyStateEl.classList.add("hidden");
    if (orderForm) orderForm.classList.remove("hidden");

    entries.forEach(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      const row = document.createElement("div");
      row.className = "cart-item";

      const label = document.createElement("div");
      label.innerHTML = `<span class="cart-item-name">${product.name}</span> — ${formatMoney(product.price)} each`;

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const minusBtn = document.createElement("button");
      minusBtn.className = "qty-btn";
      minusBtn.textContent = "−";
      minusBtn.addEventListener("click", () => {
        setQuantity(id, qty - 1);
        renderCart();
      });

      const qtyLabel = document.createElement("span");
      qtyLabel.textContent = qty;

      const plusBtn = document.createElement("button");
      plusBtn.className = "qty-btn";
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () => {
        setQuantity(id, qty + 1);
        renderCart();
      });

      controls.appendChild(minusBtn);
      controls.appendChild(qtyLabel);
      controls.appendChild(plusBtn);

      row.appendChild(label);
      row.appendChild(controls);
      cartListEl.appendChild(row);
    });

    cartTotalEl.textContent = formatMoney(cartTotal());

    if (orderSummaryInput) {
      const summary = entries
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? `${qty}x ${product.name}` : "";
        })
        .filter(Boolean)
        .join(", ");
      orderSummaryInput.value = `${summary} — Total: ${formatMoney(cartTotal())}`;
    }
  }

  renderCart();
}

/* ──────────────────────────────────────────────
   ORDER FORM SUBMIT
   Addy & cousin: this needs a Cloudflare Worker (same pattern as the
   babysitting site) to actually email/save the order — set
   ORDER_WORKER_URL once you have one. Until then the form shows but
   won't send anywhere.
   ────────────────────────────────────────────── */
const ORDER_WORKER_URL = "REPLACE_WITH_YOUR_ORDER_WORKER_URL";

const orderForm = document.getElementById("order-form");

if (orderForm) {
  const orderError = document.getElementById("order-error");

  orderForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    orderError.classList.add("hidden");

    if (ORDER_WORKER_URL.startsWith("REPLACE_")) {
      orderError.textContent = "Ordering isn't fully set up yet — check CLAUDE.md for the next step!";
      orderError.classList.remove("hidden");
      return;
    }

    const data = Object.fromEntries(new FormData(orderForm).entries());

    try {
      const response = await fetch(ORDER_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Worker responded with an error");

      setCart({});
      window.location.href = "thankyou.html";
    } catch (error) {
      orderError.textContent = "Something went wrong sending your order — please try again in a moment.";
      orderError.classList.remove("hidden");
    }
  });
}
