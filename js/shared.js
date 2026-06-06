// Shared across all pages: theme toggle
let theme = localStorage.getItem("okita_theme") || "dark";

function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("okita_theme", theme);
  applyTheme();
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.addEventListener("click", toggleTheme);
});
