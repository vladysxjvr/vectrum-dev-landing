# Vectrum Dev — landing page

Live: https://vectrum-dev-landing.onrender.com

Open `index.html` in a browser. No build step.

- `css/styles.css` — all styles. Colour and font tokens are at the top (`:root`). Main blue: `#4D76F7`.
- `js/i18n.js` — EN / PL / RU / UA texts. Elements use `data-t="key"` (plain text) or `data-h="key"` (HTML).
- `js/main.js` — language switcher (remembered in localStorage), floating header on scroll, mobile menu, FAQ accordion, phone mask, form validation and a small hash router for project pages.
- `img/` — logo, portfolio covers and project screenshots (`img/projects/`).

Project pages: `#normobaria` and `#vectrum-space` open a project page inside `index.html`; any other hash (`#portfolio`, `#contacts`…) shows the main page.

Breakpoints: desktop header ≥ 1024px, burger menu < 1024px, single-column layout < 900px.

Still to replace before launch:
- e-mail `Contact@[domain]`;
- social icon links;
- form submission (currently validation only, nothing is sent).
