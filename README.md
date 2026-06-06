# ⚡ OKITA SHOPS — Tech Marketplace

> A modern, fully static tech marketplace built with vanilla HTML, CSS and JavaScript.

![GitHub last commit](https://img.shields.io/github/last-commit/OkitaT16/OkitaShops)
![GitHub repo size](https://img.shields.io/github/repo-size/OkitaT16/OkitaShops)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🛍️ About

**OKITA SHOPS** is a tech marketplace featuring 500+ products — smartphones, laptops, audio, gaming and more — all in one place, with fast shipping, warranty, and 24/7 support.

No frameworks. No dependencies. Pure HTML + CSS + JavaScript.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌙 Dark / Light mode | Toggle persisted in `localStorage` |
| 🔍 Search with autocomplete | Real-time suggestions as you type |
| 💰 Price range filter | Dual-thumb range slider |
| ♡ Wishlist | Add/remove favorites, persisted locally |
| ⇄ Product comparator | Compare up to 3 products side by side |
| 👁️ Recently viewed | Tracks last 5 products you opened |
| 💀 Skeleton loading | Shimmer placeholders while products load |
| 🛒 Cart | Add, remove, quantity control |
| 📄 10 inner pages | Each in its own HTML file under `pages/` |

---

## 📁 Project Structure

```
OKITA SHOPS/
├── index.html          # Main store page
├── css/
│   └── styles.css      # All styles (dark/light, animations, components)
├── js/
│   ├── data.js         # Product catalog (17 products)
│   ├── app.js          # Store logic (cart, wishlist, filters, comparator)
│   └── shared.js       # Theme manager shared across inner pages
└── pages/
    ├── ayuda.html          # Help center (FAQ accordion)
    ├── seguimiento.html    # Order tracking
    ├── devoluciones.html   # Returns policy
    ├── garantia.html       # Warranty tiers
    ├── contacto.html       # Contact form
    ├── nosotros.html       # About us + team
    ├── blog.html           # Tech blog posts
    ├── trabaja.html        # Job listings
    ├── terminos.html       # Terms & conditions
    └── privacidad.html     # Privacy policy
```

---

## 🚀 Getting Started

No build step needed. Just open the file:

```bash
# Clone the repo
git clone https://github.com/OkitaT16/OkitaShops.git

# Open in browser
start index.html        # Windows
open index.html         # macOS
```

Or use the **Live Server** extension in VS Code for hot reload.

---

## 🎨 Tech Stack

- **HTML5** — Semantic markup, `<details>/<summary>` accordion
- **CSS3** — Custom properties, `@keyframes`, `backdrop-filter`, CSS Grid & Flexbox
- **JavaScript (ES6+)** — Modules, `localStorage`, DOM manipulation
- **Unsplash** — Real product images via CDN

---

## 📸 Product Categories

`Smartphones` · `Laptops` · `Audio` · `Gaming` · `Wearables` · `Accesorios`

---

## 👤 Author

Made with ♥ by **[Okita](https://github.com/OkitaT16)**
