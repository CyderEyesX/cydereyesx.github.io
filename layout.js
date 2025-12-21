document.addEventListener("DOMContentLoaded", () => {
  const loadFragment = async (selector, file) => {
    const host = document.querySelector(selector);
    if (!host) return;

    try {
      const res = await fetch(file, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      host.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  };

  const initHeaderUX = () => {
    const nav = document.getElementById("cyx-nav");
    if (!nav) return;

    // ---------- Blur / dynamic glass on scroll ----------
    const setNavState = () => {
      if (window.scrollY > 8) {
        nav.classList.add("cyx-nav-scrolled");
      } else {
        nav.classList.remove("cyx-nav-scrolled");
      }
    };
    setNavState();
    window.addEventListener("scroll", setNavState, { passive: true });

    // Inject style once (so we don't need extra files)
    if (!document.getElementById("cyx-nav-style")) {
      const style = document.createElement("style");
      style.id = "cyx-nav-style";
      style.textContent = `
        #cyx-nav { transition: background .25s ease, border-color .25s ease, box-shadow .25s ease, backdrop-filter .25s ease; }
        #cyx-nav.cyx-nav-scrolled {
          background: rgba(15, 23, 42, 0.78) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 34px rgba(0,0,0,0.25);
        }
      `;
      document.head.appendChild(style);
    }

    // ---------- Desktop Resources dropdown ----------
    const btn = document.getElementById("resourcesBtn");
    const menu = document.getElementById("resourcesMenu");

    const closeDropdown = () => {
      if (!btn || !menu) return;
      btn.setAttribute("aria-expanded", "false");
      menu.classList.add("hidden");
    };

    const openDropdown = () => {
      if (!btn || !menu) return;
      btn.setAttribute("aria-expanded", "true");
      menu.classList.remove("hidden");
    };

    const toggleDropdown = () => {
      if (!btn || !menu) return;
      const expanded = btn.getAttribute("aria-expanded") === "true";
      expanded ? closeDropdown() : openDropdown();
    };

    if (btn && menu) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown();
      });

      // close on outside click
      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== btn) closeDropdown();
      });

      // close on ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDropdown();
      });
    }

    // ---------- Mobile hamburger menu ----------
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mobilePanel = document.getElementById("mobileMenu");
    const mobileClose = document.getElementById("mobileMenuCloseBtn");

    const mobileResBtn = document.getElementById("mobileResourcesBtn");
    const mobileResMenu = document.getElementById("mobileResourcesMenu");

    const openMobile = () => {
      if (!mobileBtn || !mobilePanel) return;
      mobileBtn.setAttribute("aria-expanded", "true");
      mobilePanel.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // prevent background scroll
      // Focus close button for accessibility
      setTimeout(() => mobileClose?.focus(), 0);
    };

    const closeMobile = () => {
      if (!mobileBtn || !mobilePanel) return;
      mobileBtn.setAttribute("aria-expanded", "false");
      mobilePanel.classList.add("hidden");
      document.body.style.overflow = "";
      // collapse resources submenu
      if (mobileResBtn && mobileResMenu) {
        mobileResBtn.setAttribute("aria-expanded", "false");
        mobileResMenu.classList.add("hidden");
      }
      setTimeout(() => mobileBtn?.focus(), 0);
    };

    const toggleMobile = () => {
      if (!mobileBtn || !mobilePanel) return;
      const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMobile() : openMobile();
    };

    if (mobileBtn && mobilePanel) {
      mobileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMobile();
      });

      mobileClose?.addEventListener("click", closeMobile);

      // close mobile on outside click
      document.addEventListener("click", (e) => {
        if (mobilePanel.classList.contains("hidden")) return;
        const clickedInside = mobilePanel.contains(e.target) || mobileBtn.contains(e.target);
        if (!clickedInside) closeMobile();
      });

      // close on ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileBtn.getAttribute("aria-expanded") === "true") {
          closeMobile();
        }
      });

      // Mobile Resources submenu
      if (mobileResBtn && mobileResMenu) {
        mobileResBtn.addEventListener("click", () => {
          const expanded = mobileResBtn.getAttribute("aria-expanded") === "true";
          mobileResBtn.setAttribute("aria-expanded", expanded ? "false" : "true");
          mobileResMenu.classList.toggle("hidden", expanded);
        });
      }

      // Close menu after clicking any link inside mobile panel
      mobilePanel.querySelectorAll("a[href]").forEach(a => {
        a.addEventListener("click", closeMobile);
      });
    }
  };

// Load both fragments, then init UX
(async () => {
  await loadFragment("#site-header", "header.html");
  await loadFragment("#site-footer", "footer.html");
  initHeaderUX();
  })();
});
