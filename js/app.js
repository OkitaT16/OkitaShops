// ── State ──────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("okita_cart")) || [];
let activeCategory = "all";
let searchQuery = "";
let sortBy = "default";
let currentProduct = null;

// ── DOM refs ────────────────────────────────────────────────────────────────
const productGrid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItems = document.getElementById("cart-items");
const categoryList = document.getElementById("category-list");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const resultsCount = document.getElementById("results-count");
const modal = document.getElementById("product-modal");

// ── Init ────────────────────────────────────────────────────────────────────
function init() {
  buildCategories();
  renderProducts();
  updateCart();

  document.getElementById("cart-btn").addEventListener("click", toggleCart);
  document.getElementById("close-cart").addEventListener("click", toggleCart);
  cartOverlay.addEventListener("click", toggleCart);

  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase();
    renderProducts();
  });

  sortSelect.addEventListener("change", e => {
    sortBy = e.target.value;
    renderProducts();
  });

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", closeModal);

  document.getElementById("checkout-btn").addEventListener("click", checkout);
}

// ── Categories ──────────────────────────────────────────────────────────────
function buildCategories() {
  categoryList.innerHTML = categories.map(cat => `
    <button class="category-btn ${cat.id === activeCategory ? "active" : ""}"
            data-id="${cat.id}" onclick="setCategory('${cat.id}')">
      <span class="cat-icon">${cat.icon}</span>
      <span>${cat.label}</span>
    </button>
  `).join("");
}

function setCategory(id) {
  activeCategory = id;
  buildCategories();
  renderProducts();
}

// ── Products ────────────────────────────────────────────────────────────────
function getFilteredProducts() {
  let list = [...products];

  if (activeCategory !== "all") {
    list = list.filter(p => p.category === activeCategory);
  }

  if (searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  switch (sortBy) {
    case "price-asc":  list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "rating":     list.sort((a, b) => b.rating - a.rating); break;
    case "reviews":    list.sort((a, b) => b.reviews - a.reviews); break;
  }

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  resultsCount.textContent = `${list.length} producto${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Sin resultados</h3>
        <p>Intenta con otro término o categoría.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = list.map(p => {
    const discount = Math.round((1 - p.price / p.originalPrice) * 100);
    const inCart = cart.find(c => c.id === p.id);
    const stars = renderStars(p.rating);
    return `
      <article class="product-card" onclick="openModal(${p.id})">
        <div class="product-img-wrap">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ""}
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <p class="product-category">${p.category}</p>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">
            ${stars} <span class="rating-val">${p.rating}</span>
            <span class="rating-reviews">(${p.reviews.toLocaleString()})</span>
          </div>
          <div class="product-pricing">
            <span class="price">$${p.price.toFixed(2)}</span>
            <span class="original-price">$${p.originalPrice.toFixed(2)}</span>
          </div>
          <div class="product-stock ${p.stock <= 5 ? "low" : ""}">
            ${p.stock <= 5 ? `⚠️ Solo ${p.stock} disponibles` : `✅ En stock (${p.stock})`}
          </div>
        </div>
        <div class="product-actions" onclick="event.stopPropagation()">
          <button class="btn-cart ${inCart ? "added" : ""}"
                  onclick="toggleCartItem(${p.id})">
            ${inCart ? "✓ Agregado" : "🛒 Agregar"}
          </button>
          <button class="btn-wish" onclick="wishlist(${p.id})" title="Lista de deseos">♡</button>
        </div>
      </article>`;
  }).join("");
}

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return '<span class="star full">★</span>';
    if (i < rating) return '<span class="star half">★</span>';
    return '<span class="star empty">☆</span>';
  }).join("");
}

// ── Modal ───────────────────────────────────────────────────────────────────
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
  const inCart = cart.find(c => c.id === p.id);

  document.getElementById("modal-content").innerHTML = `
    <div class="modal-grid">
      <div class="modal-img-col">
        <img src="${p.img}" alt="${p.name}" />
        ${p.badge ? `<span class="badge modal-badge">${p.badge}</span>` : ""}
      </div>
      <div class="modal-details">
        <p class="product-category">${p.category}</p>
        <h2>${p.name}</h2>
        <div class="product-rating">
          ${renderStars(p.rating)}
          <span class="rating-val">${p.rating}</span>
          <span class="rating-reviews">(${p.reviews.toLocaleString()} reseñas)</span>
        </div>
        <div class="modal-pricing">
          <span class="price large">$${p.price.toFixed(2)}</span>
          <span class="original-price">$${p.originalPrice.toFixed(2)}</span>
          ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ""}
        </div>
        <p class="modal-desc">${p.description}</p>
        <ul class="specs-list">
          ${p.specs.map(s => `<li>✦ ${s}</li>`).join("")}
        </ul>
        <div class="product-stock ${p.stock <= 5 ? "low" : ""}">
          ${p.stock <= 5 ? `⚠️ Solo ${p.stock} disponibles` : `✅ En stock (${p.stock} unidades)`}
        </div>
        <div class="modal-actions">
          <button class="btn-cart big ${inCart ? "added" : ""}"
                  onclick="toggleCartItem(${p.id}); document.getElementById('modal-add-btn').textContent = cart.find(c=>c.id===${p.id}) ? '✓ Agregado' : '🛒 Agregar al carrito';"
                  id="modal-add-btn">
            ${inCart ? "✓ Agregado" : "🛒 Agregar al carrito"}
          </button>
          <button class="btn-buy" onclick="buyNow(${p.id})">⚡ Comprar ahora</button>
        </div>
      </div>
    </div>`;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// ── Cart ────────────────────────────────────────────────────────────────────
function toggleCartItem(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) {
    cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
    showToast(`${p.name} agregado al carrito 🛒`);
  } else {
    cart.splice(idx, 1);
    showToast(`${p.name} eliminado del carrito`);
  }
  saveCart();
  updateCart();
  renderProducts();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCart();
  renderProducts();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCart();
  renderProducts();
}

function updateCart() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);

  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? "flex" : "none";
  cartTotal.textContent = `$${total.toFixed(2)}`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
        <span>Agrega productos para comenzar</span>
      </div>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="qty-control">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Eliminar">✕</button>
    </div>
  `).join("");
}

function toggleCart() {
  const open = cartPanel.classList.toggle("open");
  cartOverlay.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function saveCart() {
  localStorage.setItem("okita_cart", JSON.stringify(cart));
}

// ── Checkout ────────────────────────────────────────────────────────────────
function checkout() {
  if (cart.length === 0) return;
  showToast("🎉 ¡Pedido realizado con éxito! Gracias por comprar en OKITA SHOPS");
  cart = [];
  saveCart();
  updateCart();
  renderProducts();
  setTimeout(toggleCart, 1500);
}

function buyNow(id) {
  if (!cart.find(c => c.id === id)) toggleCartItem(id);
  closeModal();
  setTimeout(() => {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }, 300);
}

function wishlist(id) {
  const p = products.find(x => x.id === id);
  showToast(`${p.name} añadido a lista de deseos ♡`);
}

// ── Toast ───────────────────────────────────────────────────────────────────
function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 400);
  }, 3000);
}

// ── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);
