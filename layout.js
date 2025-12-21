document.addEventListener("DOMContentLoaded", () => {

  const loadFragment = async (selector, file) => {
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      const html = await res.text();
      document.querySelector(selector).innerHTML = html;
    } catch (err) {
      console.error(err);
    }
  };

  // Load header and footer
  loadFragment("#site-header", "/header.html").then(() => {
    setActiveNav();
  });

  loadFragment("#site-footer", "/footer.html");

  // ----------------------------
  // ACTIVE NAV LOGIC
  // ----------------------------
  function setActiveNav() {
    const path = window.location.pathname;

    let current = "home";

    if (path.includes("trainings-workshops")) current = "trainings";
    else if (path.includes("crypto-projects")) current = "crypto-projects";
    else if (path.includes("donations")) current = "donations";
    else if (path.includes("new-nft-collection")) current = "nft";
    else if (path.includes("cyx-learning-token")) current = "trainings";

    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.nav === current) {
        link.classList.add("text-teal-400", "opacity-100");
      } else {
        link.classList.remove("text-teal-400", "opacity-100");
      }
    });
  }

});
