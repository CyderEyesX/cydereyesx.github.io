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

  loadFragment("#site-header", "/header.html");
  loadFragment("#site-footer", "/footer.html");
});
