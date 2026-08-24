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
  { id: "mystery-dumpling-paper", name: "Mystery Dumpling - Paper", maker: "Paper Squishy", price: 5 },
  { id: "mystery-dumpling-clay", name: "Mystery Dumpling - Clay", maker: "Clay Craft", price: 6 },
  { id: "squishy-bundle", name: "Squishy Bundle (3-Pack)", maker: "Squishy Bundle", price: 10 },
  { id: "bracelet", name: "Handmade Bracelet", maker: "Bracelet", price: 6 },
  { id: "squishy-stand-clay", name: "Squishy Stand - Clay", maker: "Clay Craft", price: 7 },
  { id: "smores-squishy", name: "S'mores Squishy", maker: "Paper Squishy", price: 4 },
  { id: "articulated-dragon", name: "Articulated Dragon", maker: "3D Printed", price: 14, limited: true },
  { id: "gyro-fidget", name: "Gyro Fidget", maker: "3D Printed", price: 9, limited: true },
  { id: "infinity-cube", name: "Infinity Cube", maker: "3D Printed", price: 10, limited: true },
  { id: "flexi-animal", name: "Flexi Animal", maker: "3D Printed", price: 11, limited: true },
  { id: "mini-viral-vase", name: "Mini Viral Vase", maker: "3D Printed", price: 8, limited: true },
  { id: "butter-squishy", name: "Butter Squishy", maker: "Paper Squishy", price: 5, limited: true },
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

    const rawTotal = cartTotal();
    const finalTotal = isPaidMember() ? rawTotal * (1 - MEMBER_DISCOUNT) : rawTotal;

    if (isPaidMember()) {
      cartTotalEl.innerHTML = `<span style="text-decoration: line-through; color: var(--text-light); font-size: 0.9rem;">${formatMoney(rawTotal)}</span> ${formatMoney(finalTotal)} <span style="font-size: 0.8rem; color: var(--teal-dark);">(member discount applied)</span>`;
    } else {
      cartTotalEl.textContent = formatMoney(finalTotal);
    }

    if (orderSummaryInput) {
      const summary = entries
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? `${qty}x ${product.name}` : "";
        })
        .filter(Boolean)
        .join(", ");
      orderSummaryInput.value = `${summary} — Total: ${formatMoney(finalTotal)}${isPaidMember() ? " (member discount applied)" : ""}`;
    }
  }

  renderCart();
}

/* ──────────────────────────────────────────────
   PAID MEMBERSHIP (member.html)
   $10/month for 10% off every order. Not real payment or a real account
   system: a customer clicks "I Want to Join," pays $10/month at pickup
   (cash or check) like everything else on this site, and Addy/cousin
   manually email them MEMBER_PASSCODE — entering it here turns on their
   discount. Change MEMBER_PASSCODE below whenever you want (e.g. if it
   gets shared around); everyone who already activated stays activated
   since that's tracked separately per-device.
   ────────────────────────────────────────────── */
const MEMBER_FEE = 10;
const MEMBER_DISCOUNT = 0.1; // 10% off
const CANCEL_FEE = 4;
const MEMBER_PASSCODE = "craft10";
const CANCEL_PASSCODE = "123shop";

function isPaidMember() {
  return localStorage.getItem("craftPaidMember") === "yes";
}

function setPaidMember(value) {
  localStorage.setItem("craftPaidMember", value ? "yes" : "no");
  updateMembershipDisplay();
}

function updateMembershipDisplay() {
  const statusEl = document.getElementById("membership-status");
  const cancelBtn = document.getElementById("cancel-member-btn");
  const cancelMessage = document.getElementById("cancel-message");
  const cancelPasscodeForm = document.getElementById("cancel-passcode-form");
  const passcodeForm = document.getElementById("member-passcode-form");
  if (!statusEl) return;

  if (isPaidMember()) {
    statusEl.textContent = `You're a Craft Co. Member! Enjoy ${MEMBER_DISCOUNT * 100}% off every order.`;
    statusEl.style.color = "var(--teal-dark)";
    if (cancelBtn) cancelBtn.classList.remove("hidden");
    if (passcodeForm) passcodeForm.classList.add("hidden");
  } else {
    statusEl.textContent = "";
    if (cancelBtn) cancelBtn.classList.add("hidden");
    if (cancelPasscodeForm) cancelPasscodeForm.classList.add("hidden");
    if (cancelMessage) cancelMessage.textContent = "";
    if (passcodeForm) passcodeForm.classList.remove("hidden");
  }
}

const requestJoinBtn = document.getElementById("request-join-btn");
if (requestJoinBtn) {
  const requestJoinMessage = document.getElementById("request-join-message");
  requestJoinBtn.addEventListener("click", function () {
    requestJoinMessage.textContent = "Thanks! Pay $10/month at pickup and we'll email your activation passcode.";
    requestJoinMessage.style.color = "var(--teal-dark)";
  });
}

const memberPasscodeForm = document.getElementById("member-passcode-form");
if (memberPasscodeForm) {
  const memberPasscodeInput = document.getElementById("member-passcode-input");
  const memberPasscodeError = document.getElementById("member-passcode-error");

  memberPasscodeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (memberPasscodeInput.value === MEMBER_PASSCODE) {
      memberPasscodeError.classList.add("hidden");
      setPaidMember(true);
    } else {
      memberPasscodeError.textContent = "Wrong passcode — check your email or ask us to resend it.";
      memberPasscodeError.classList.remove("hidden");
    }
  });
  updateMembershipDisplay();
}

const cancelMemberBtn = document.getElementById("cancel-member-btn");
const cancelPasscodeForm = document.getElementById("cancel-passcode-form");
if (cancelMemberBtn && cancelPasscodeForm) {
  const cancelPasscodeInput = document.getElementById("cancel-passcode-input");
  const cancelPasscodeError = document.getElementById("cancel-passcode-error");
  const cancelMessage = document.getElementById("cancel-message");

  cancelMemberBtn.addEventListener("click", function () {
    cancelMemberBtn.classList.add("hidden");
    cancelPasscodeForm.classList.remove("hidden");
    cancelPasscodeInput.focus();
  });

  cancelPasscodeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (cancelPasscodeInput.value === CANCEL_PASSCODE) {
      cancelPasscodeError.classList.add("hidden");
      cancelPasscodeForm.classList.add("hidden");
      cancelPasscodeInput.value = "";
      setPaidMember(false);
      if (cancelMessage) {
        cancelMessage.textContent = `Membership canceled — a $${CANCEL_FEE} cancellation fee is due at pickup.`;
        cancelMessage.style.color = "var(--coral-dark)";
      }
    } else {
      cancelPasscodeError.textContent = "Wrong passcode — ask us for the cancellation passcode.";
      cancelPasscodeError.classList.remove("hidden");
    }
  });
}

/* ──────────────────────────────────────────────
   MEMBER POINTS (members.html)
   Earn 1 point per $1 spent (rounded down); 25 points = $2 off a future
   order. Stored in localStorage, so it's per-device, not a real account
   — good enough for now, same spirit as the rest of this site.
   ────────────────────────────────────────────── */
const POINTS_PER_DOLLAR = 1;
const REDEEM_POINTS = 25;
const REDEEM_VALUE = 2;

function getPoints() {
  const saved = localStorage.getItem("craftPoints");
  return saved ? Number(saved) : 0;
}

function setPoints(points) {
  localStorage.setItem("craftPoints", String(points));
  updatePointsDisplays();
}

function addPoints(amount) {
  setPoints(getPoints() + Math.floor(amount * POINTS_PER_DOLLAR));
}

function updatePointsDisplays() {
  document.querySelectorAll(".points-count").forEach((el) => {
    el.textContent = getPoints();
  });
}

updatePointsDisplays();

const redeemBtn = document.getElementById("redeem-btn");
if (redeemBtn) {
  const redeemMessage = document.getElementById("redeem-message");

  redeemBtn.addEventListener("click", function () {
    if (getPoints() < REDEEM_POINTS) {
      redeemMessage.textContent = `You need ${REDEEM_POINTS} points to redeem — keep shopping!`;
      redeemMessage.style.color = "var(--coral-dark)";
      return;
    }
    setPoints(getPoints() - REDEEM_POINTS);
    redeemMessage.textContent = `Redeemed! Show this screen at pickup for $${REDEEM_VALUE} off.`;
    redeemMessage.style.color = "var(--teal-dark)";
  });
}

/* ──────────────────────────────────────────────
   PRIVATE PAGE PASSCODE GATE (private.html)
   Not real security — just a passcode to keep casual visitors out of the
   text thread. Chat logic itself lives in chat.js.
   ────────────────────────────────────────────── */
const PASSCODE = "ae";

const passcodeForm = document.getElementById("passcode-form");

if (passcodeForm) {
  const passcodeGate = document.getElementById("passcode-gate");
  const passcodeInput = document.getElementById("passcode-input");
  const passcodeError = document.getElementById("passcode-error");

  passcodeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (passcodeInput.value === PASSCODE) {
      sessionStorage.setItem("craftPrivateUnlocked", "true");
      passcodeError.classList.add("hidden");
      passcodeGate.classList.add("hidden");
      if (typeof afterPasscodeUnlock === "function") afterPasscodeUnlock();
    } else {
      passcodeError.textContent = "Wrong passcode — try again.";
      passcodeError.classList.remove("hidden");
    }
  });
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

    const orderTotal = isPaidMember() ? cartTotal() * (1 - MEMBER_DISCOUNT) : cartTotal();
    const data = Object.fromEntries(new FormData(orderForm).entries());

    try {
      const response = await fetch(ORDER_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Worker responded with an error");

      addPoints(orderTotal);
      setCart({});
      window.location.href = "thankyou.html";
    } catch (error) {
      orderError.textContent = "Something went wrong sending your order — please try again in a moment.";
      orderError.classList.remove("hidden");
    }
  });
}
