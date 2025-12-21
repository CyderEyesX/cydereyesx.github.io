// js/layout.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(res => res.text())
    .then(html => document.getElementById("site-header").innerHTML = html);

  fetch("footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("site-footer").innerHTML = html);
});
