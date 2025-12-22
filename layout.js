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

    /* ===============================
       Header blur / glass on scroll
       =============================== */
    const updateNavState = () => {
      if (window.scrollY > 8) {
        nav.classList.add("cyx-nav-scrolled");
      } else {
        nav.classList.remove("cyx-nav-scrolled");
      }
    };

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });

    // Inject style once
    if (!document.getElementById("cyx-nav-style")) {
      const style = document.createElement("style");
      style.id = "cyx-nav-style";
      style.textContent = `
        #cyx-nav {
          transition: background .25s ease,
                      border-color .25s ease,
                      box-shadow .25s ease,
                      backdrop-filter .25s ease;
        }
        #cyx-nav.cyx-nav-scrolled {
          background: rgba(15, 23, 42, 0.78) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 34px rgba(0,0,0,0.25);
        }
      `;
      document.head.appendChild(style);
    }

    /* ===============================
       Desktop Resources dropdown
       =============================== */
    const resourcesBtn = document.getElementById("resourcesBtn");
    const resourcesMenu = document.getElementById("resourcesMenu");

    const closeResources = () => {
      if (!resourcesBtn || !resourcesMenu) return;
      resourcesBtn.setAttribute("aria-expanded", "false");
      resourcesMenu.classList.add("hidden");
    };

    const toggleResources = (e) => {
      e.stopPropagation();
      if (!resourcesBtn || !resourcesMenu) return;

      const expanded = resourcesBtn.getAttribute("aria-expanded") === "true";
      resourcesBtn.setAttribute("aria-expanded", String(!expanded));
      resourcesMenu.classList.toggle("hidden", expanded);
    };

    if (resourcesBtn && resourcesMenu) {
      resourcesBtn.addEventListener("click", toggleResources);

      document.addEventListener("click", (e) => {
        if (!resourcesMenu.contains(e.target) && e.target !== resourcesBtn) {
          closeResources();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeResources();
      });
    }

    /* ===============================
       Mobile menu
       =============================== */
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mobilePanel = document.getElementById("mobileMenu");
    const mobileCloseBtn = document.getElementById("mobileMenuCloseBtn");

    const openMobile = () => {
      mobileBtn.setAttribute("aria-expanded", "true");
      mobilePanel.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      setTimeout(() => mobileCloseBtn?.focus(), 0);
    };

    const closeMobile = () => {
      mobileBtn.setAttribute("aria-expanded", "false");
      mobilePanel.classList.add("hidden");
      document.body.style.overflow = "";
      closeMobileResources();
      setTimeout(() => mobileBtn?.focus(), 0);
    };

    const toggleMobile = (e) => {
      e.stopPropagation();
      const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMobile() : openMobile();
    };

    mobileBtn?.addEventListener("click", toggleMobile);
    mobileCloseBtn?.addEventListener("click", closeMobile);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileBtn?.getAttribute("aria-expanded") === "true") {
        closeMobile();
      }
    });

    /* ===============================
       Mobile Resources submenu
       =============================== */
    const mobileResBtn = document.getElementById("mobileResourcesBtn");
    const mobileResMenu = document.getElementById("mobileResourcesMenu");

    const openMobileResources = () => {
      mobileResBtn.setAttribute("aria-expanded", "true");
      mobileResMenu.style.maxHeight = mobileResMenu.scrollHeight + "px";
      mobileResMenu.style.opacity = "1";
    };

    const closeMobileResources = () => {
      if (!mobileResBtn || !mobileResMenu) return;
      mobileResBtn.setAttribute("aria-expanded", "false");
      mobileResMenu.style.maxHeight = "0px";
      mobileResMenu.style.opacity = "0";
    };

    mobileResBtn?.addEventListener("click", () => {
      const expanded = mobileResBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMobileResources() : openMobileResources();
    });

    // Close mobile menu after clicking any link
    mobilePanel?.querySelectorAll("a[href]").forEach(link => {
      link.addEventListener("click", closeMobile);
    });
  };

  /* ===============================
     Load fragments, then init UX
     =============================== */
  (async () => {
    await loadFragment("#site-header", "/header.html");
    await loadFragment("#site-footer", "/footer.html");
    initHeaderUX();
  })();
});
