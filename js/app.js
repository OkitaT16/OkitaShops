// ── State ────────────────────────────────────────────────────────────────────
let cart        = JSON.parse(localStorage.getItem("okita_cart"))     || [];
let wishlist    = JSON.parse(localStorage.getItem("okita_wishlist")) || [];
let recentlyViewed = JSON.parse(localStorage.getItem("okita_recent")) || [];
let activeCategory = "all";
let searchQuery = "";
let sortBy      = "default";
let priceMin    = 0;
let priceMax    = 4000;
let compareList = [];
let theme       = localStorage.getItem("okita_theme") || "dark";

// ── DOM refs ─────────────────────────────────────────────────────────────────
const productGrid   = document.getElementById("product-grid");
const cartPanel     = document.getElementById("cart-panel");
const cartOverlay   = document.getElementById("cart-overlay");
const cartCount     = document.getElementById("cart-count");
const cartTotal     = document.getElementById("cart-total");
const cartItems     = document.getElementById("cart-items");
const categoryList  = document.getElementById("category-list");
const searchInput   = document.getElementById("search-input");
const sortSelect    = document.getElementById("sort-select");
const resultsCount  = document.getElementById("results-count");
const modal         = document.getElementById("product-modal");

// ── Theme ─────────────────────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("theme-icon").textContent = theme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("okita_theme", theme);
  applyTheme();
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function renderSkeletons(count = 8) {
  productGrid.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line w30"></div>
        <div class="skeleton skeleton-line w80 h20"></div>
        <div class="skeleton skeleton-line w60"></div>
        <div class="skeleton skeleton-line w60"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton skeleton-line h20" style="flex:1;margin:0;border-radius:10px;height:40px"></div>
        <div class="skeleton skeleton-line" style="width:40px;height:40px;margin:0;border-radius:10px;flex-shrink:0"></div>
        <div class="skeleton skeleton-line" style="width:40px;height:40px;margin:0;border-radius:10px;flex-shrink:0"></div>
      </div>
    </div>
  `).join("");
}

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  applyTheme();
  renderSkeletons();
  buildCategories();
  initPriceFilter();
  renderRecentlyViewed();
  updateCart();
  updateWishlistPanel();

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("wishlist-btn").addEventListener("click", toggleWishlistPanel);
  document.getElementById("close-wishlist").addEventListener("click", toggleWishlistPanel);
  document.getElementById("wishlist-overlay").addEventListener("click", toggleWishlistPanel);

  document.getElementById("cart-btn").addEventListener("click", toggleCart);
  document.getElementById("close-cart").addEventListener("click", toggleCart);
  cartOverlay.addEventListener("click", toggleCart);

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", closeModal);

  document.getElementById("compare-btn").addEventListener("click", openCompareModal);
  document.getElementById("clear-compare").addEventListener("click", clearCompare);
  document.getElementById("compare-modal-close").addEventListener("click", closeCompareModal);
  document.getElementById("compare-modal-overlay").addEventListener("click", closeCompareModal);

  document.getElementById("checkout-btn").addEventListener("click", checkout);

  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase();
    updateSuggestions(searchQuery);
    renderProducts();
  });

  sortSelect.addEventListener("change", e => {
    sortBy = e.target.value;
    renderProducts();
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-bar")) closeSuggestions();
  });

  document.getElementById("page-modal-back").addEventListener("click", closePage);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeCompareModal(); closePage(); }
  });

  setTimeout(renderProducts, 650);
}

// ── Categories ────────────────────────────────────────────────────────────────
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

// ── Price Filter ──────────────────────────────────────────────────────────────
function initPriceFilter() {
  const minSlider  = document.getElementById("price-min");
  const maxSlider  = document.getElementById("price-max");
  const fill       = document.getElementById("price-fill");
  const dispMin    = document.getElementById("price-display-min");
  const dispMax    = document.getElementById("price-display-max");
  const MAX        = 4000;

  function update() {
    let min = parseInt(minSlider.value);
    let max = parseInt(maxSlider.value);
    if (min > max) { min = max; minSlider.value = min; }
    priceMin = min;
    priceMax = max;
    dispMin.textContent = `$${min}`;
    dispMax.textContent = `$${max}`;
    fill.style.left  = `${(min / MAX) * 100}%`;
    fill.style.width = `${((max - min) / MAX) * 100}%`;
    renderProducts();
  }

  minSlider.addEventListener("input", update);
  maxSlider.addEventListener("input", update);
  fill.style.left  = "0%";
  fill.style.width = "100%";
}

// ── Search Suggestions ────────────────────────────────────────────────────────
function updateSuggestions(query) {
  const box = document.getElementById("search-suggestions");
  if (!query || query.length < 2) { box.classList.remove("open"); return; }

  const results = products
    .filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    .slice(0, 6);

  if (results.length === 0) {
    box.innerHTML = `<div class="suggestion-no-results">Sin resultados para "${query}"</div>`;
    box.classList.add("open");
    return;
  }

  box.innerHTML = results.map(p => `
    <div class="suggestion-item" onclick="selectSuggestion(${p.id})">
      <img src="${p.img}" alt="${p.name}" />
      <div class="suggestion-item-info">
        <div class="suggestion-item-name">${p.name}</div>
        <div class="suggestion-item-price">$${p.price.toFixed(2)}</div>
      </div>
    </div>
  `).join("");
  box.classList.add("open");
}

function selectSuggestion(id) {
  closeSuggestions();
  searchInput.value = "";
  searchQuery = "";
  renderProducts();
  openModal(id);
}

function closeSuggestions() {
  document.getElementById("search-suggestions").classList.remove("open");
}

// ── Recently Viewed ───────────────────────────────────────────────────────────
function addRecentlyViewed(id) {
  recentlyViewed = recentlyViewed.filter(r => r !== id);
  recentlyViewed.unshift(id);
  if (recentlyViewed.length > 5) recentlyViewed.pop();
  localStorage.setItem("okita_recent", JSON.stringify(recentlyViewed));
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const section    = document.getElementById("recently-section");
  const container  = document.getElementById("recently-list");
  const items      = recentlyViewed.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (items.length === 0) { section.style.display = "none"; return; }
  section.style.display = "";
  container.innerHTML = items.map(p => `
    <div class="recently-item" onclick="openModal(${p.id})">
      <img src="${p.img}" alt="${p.name}" />
      <div class="recently-item-info">
        <div class="recently-item-name">${p.name}</div>
        <div class="recently-item-price">$${p.price.toFixed(2)}</div>
      </div>
    </div>
  `).join("");
}

// ── Products ──────────────────────────────────────────────────────────────────
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

  list = list.filter(p => p.price >= priceMin && p.price <= priceMax);

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
        <p>Intenta con otro término, categoría o rango de precio.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = list.map(p => {
    const discount  = Math.round((1 - p.price / p.originalPrice) * 100);
    const inCart    = cart.find(c => c.id === p.id);
    const inWish    = wishlist.find(w => w.id === p.id);
    const inCompare = compareList.includes(p.id);
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
            ${renderStars(p.rating)}
            <span class="rating-val">${p.rating}</span>
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
          <button class="btn-cart ${inCart ? "added" : ""}" onclick="toggleCartItem(${p.id})">
            ${inCart ? "✓ Agregado" : "🛒 Agregar"}
          </button>
          <button class="btn-wish ${inWish ? "active" : ""}" onclick="toggleWishlistItem(${p.id})" title="Favoritos">
            ${inWish ? "♥" : "♡"}
          </button>
          <button class="btn-compare ${inCompare ? "active" : ""}" onclick="toggleCompare(${p.id})" title="Comparar">
            ⇄
          </button>
        </div>
      </article>`;
  }).join("");
}

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return '<span class="star full">★</span>';
    if (i < rating)             return '<span class="star half">★</span>';
    return '<span class="star empty">☆</span>';
  }).join("");
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  addRecentlyViewed(id);
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
  const inCart   = cart.find(c => c.id === p.id);
  const inWish   = wishlist.find(w => w.id === p.id);

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
          <button class="btn-cart big ${inCart ? "added" : ""}" id="modal-add-btn"
                  onclick="toggleCartItem(${p.id}); document.getElementById('modal-add-btn').className='btn-cart big '+(cart.find(c=>c.id===${p.id})?'added':''); document.getElementById('modal-add-btn').textContent=cart.find(c=>c.id===${p.id})?'✓ Agregado':'🛒 Agregar al carrito';">
            ${inCart ? "✓ Agregado" : "🛒 Agregar al carrito"}
          </button>
          <button class="btn-buy" onclick="buyNow(${p.id})">⚡ Comprar ahora</button>
        </div>
        <button class="btn-wish ${inWish ? "active" : ""}" id="modal-wish-btn" style="width:100%;height:40px;border-radius:10px;font-size:14px;"
                onclick="toggleWishlistItem(${p.id}); const w=wishlist.find(x=>x.id===${p.id}); this.className='btn-wish '+(w?'active':''); this.textContent=w?'♥ En favoritos':'♡ Añadir a favoritos';">
          ${inWish ? "♥ En favoritos" : "♡ Añadir a favoritos"}
        </button>
      </div>
    </div>`;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// ── Wishlist ──────────────────────────────────────────────────────────────────
function toggleWishlistItem(id) {
  const p   = products.find(x => x.id === id);
  if (!p) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx === -1) {
    wishlist.push({ id: p.id, name: p.name, price: p.price, img: p.img });
    showToast(`${p.name} añadido a favoritos ♥`);
  } else {
    wishlist.splice(idx, 1);
    showToast(`${p.name} eliminado de favoritos`);
  }
  localStorage.setItem("okita_wishlist", JSON.stringify(wishlist));
  updateWishlistPanel();
  renderProducts();
}

function updateWishlistPanel() {
  const count   = wishlist.length;
  const countEl = document.getElementById("wishlist-count");
  countEl.textContent  = count;
  countEl.style.display = count > 0 ? "flex" : "none";

  const container = document.getElementById("wishlist-items");
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="wishlist-empty">
        <div class="wishlist-empty-icon">♡</div>
        <p>Sin favoritos aún</p>
        <span>Toca ♡ en cualquier producto para guardarlo aquí</span>
      </div>`;
    return;
  }
  container.innerHTML = wishlist.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    return `
      <div class="wishlist-item">
        <img src="${item.img}" alt="${item.name}" />
        <div class="wishlist-item-info">
          <p class="wishlist-item-name">${item.name}</p>
          <p class="wishlist-item-price">$${item.price.toFixed(2)}</p>
          <div class="wishlist-item-actions">
            <button class="wishlist-item-cart ${inCart ? "added" : ""}"
                    onclick="toggleCartItem(${item.id}); updateWishlistPanel();">
              ${inCart ? "✓ Agregado" : "🛒 Agregar"}
            </button>
            <button class="wishlist-item-remove" onclick="toggleWishlistItem(${item.id})" title="Eliminar">✕</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function toggleWishlistPanel() {
  const panel   = document.getElementById("wishlist-panel");
  const overlay = document.getElementById("wishlist-overlay");
  const open    = panel.classList.toggle("open");
  overlay.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

// ── Compare ───────────────────────────────────────────────────────────────────
function toggleCompare(id) {
  const idx = compareList.indexOf(id);
  if (idx !== -1) {
    compareList.splice(idx, 1);
  } else {
    if (compareList.length >= 3) {
      showToast("Máximo 3 productos para comparar");
      return;
    }
    compareList.push(id);
    showToast("Producto añadido para comparar ⇄");
  }
  updateCompareBar();
  renderProducts();
}

function updateCompareBar() {
  const bar   = document.getElementById("compare-bar");
  const slots = document.getElementById("compare-slots");

  if (compareList.length === 0) {
    bar.classList.remove("open");
    return;
  }
  bar.classList.add("open");

  const filled = compareList.map(id => {
    const p = products.find(x => x.id === id);
    return `
      <div class="compare-slot filled">
        <img src="${p.img}" alt="${p.name}" />
        <span class="compare-slot-name">${p.name}</span>
        <span class="compare-slot-remove" onclick="toggleCompare(${p.id})">✕</span>
      </div>`;
  }).join("");

  const empty = compareList.length < 3
    ? `<div class="compare-slot"><span class="compare-slot-empty">+ Agregar producto</span></div>`
    : "";

  slots.innerHTML = filled + empty;
}

function openCompareModal() {
  if (compareList.length < 2) {
    showToast("Selecciona al menos 2 productos para comparar");
    return;
  }
  const prods = compareList.map(id => products.find(p => p.id === id));

  document.getElementById("compare-table-body").innerHTML = `
    <tr>
      <th></th>
      ${prods.map(p => `
        <td>
          <img class="compare-product-img" src="${p.img}" alt="${p.name}" />
          <div class="compare-product-name">${p.name}</div>
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--accent);font-weight:700">${p.category}</span>
        </td>`).join("")}
    </tr>
    <tr>
      <th>Precio</th>
      ${prods.map(p => `
        <td>
          <span class="compare-price-big">$${p.price.toFixed(2)}</span><br/>
          <span style="text-decoration:line-through;color:var(--text3);font-size:12px">$${p.originalPrice.toFixed(2)}</span>
        </td>`).join("")}
    </tr>
    <tr>
      <th>Calificación</th>
      ${prods.map(p => `<td>${renderStars(p.rating)} <strong>${p.rating}</strong></td>`).join("")}
    </tr>
    <tr>
      <th>Reseñas</th>
      ${prods.map(p => `<td>${p.reviews.toLocaleString()}</td>`).join("")}
    </tr>
    <tr>
      <th>Stock</th>
      ${prods.map(p => `
        <td class="product-stock ${p.stock <= 5 ? "low" : ""}">
          ${p.stock <= 5 ? `⚠️ Solo ${p.stock}` : `✅ ${p.stock} uds`}
        </td>`).join("")}
    </tr>
    <tr>
      <th>Descripción</th>
      ${prods.map(p => `<td style="font-size:13px">${p.description}</td>`).join("")}
    </tr>
    <tr>
      <th>Specs</th>
      ${prods.map(p => `<td><ul class="specs-list">${p.specs.map(s => `<li>✦ ${s}</li>`).join("")}</ul></td>`).join("")}
    </tr>
    <tr>
      <th>Acción</th>
      ${prods.map(p => {
        const inCart = cart.find(c => c.id === p.id);
        return `<td>
          <button class="btn-cart ${inCart ? "added" : ""}" style="width:100%" onclick="toggleCartItem(${p.id}); openCompareModal();">
            ${inCart ? "✓ Agregado" : "🛒 Agregar"}
          </button>
        </td>`;
      }).join("")}
    </tr>
  `;

  document.getElementById("compare-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCompareModal() {
  document.getElementById("compare-modal").classList.remove("open");
  document.body.style.overflow = "";
}

function clearCompare() {
  compareList = [];
  updateCompareBar();
  renderProducts();
}

// ── Cart ──────────────────────────────────────────────────────────────────────
function toggleCartItem(id) {
  const p   = products.find(x => x.id === id);
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

// ── Checkout ──────────────────────────────────────────────────────────────────
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

// ── Toast ─────────────────────────────────────────────────────────────────────
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

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);
