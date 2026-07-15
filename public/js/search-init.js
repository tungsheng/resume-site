// Initializes the Pagefind search island on /blog (#49). Lives in public/ as a
// plain external file — the deployed CSP (public/_headers) allows only
// script-src 'self', no 'unsafe-inline', and Astro would inline a bundled
// script this small back into the page.
window.addEventListener("DOMContentLoaded", () => {
  if (window.PagefindUI) {
    new window.PagefindUI({ element: "#search", showImages: false, showSubResults: false });
  }
});
