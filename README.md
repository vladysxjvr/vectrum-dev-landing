# Vectrum Dev — landing prototype

Open `index.html` in a browser. No build step.

- `css/styles.css` — all styles. Colour and font tokens are at the top (`:root`). Main blue: `#4D76F7`.
- `js/i18n.js` — EN / PL / RU / UA texts. Elements use `data-t="key"` (plain text) or `data-h="key"` (HTML).
- `js/main.js` — language switcher (remembered in localStorage), floating header on scroll, mobile menu, FAQ accordion, phone mask and form validation.
- `img/` — logo and portfolio images.

Breakpoints: desktop header ≥ 1024px, burger menu < 1024px, single-column layout < 900px.

Placeholders to replace before launch:
- portfolio covers: Vectrum Logistics and Normobaria use temporary CSS covers, Joy Lab image is cut from a screenshot (~400px), Aquila Hotel image is loaded from aquila-hotel.pl;
- e-mail `Contact@[domain]`;
- answers for FAQ questions 1, 2 and 4 (all languages);
- links for "Browse" and social icons;
- form submission (currently validation only, nothing is sent).
