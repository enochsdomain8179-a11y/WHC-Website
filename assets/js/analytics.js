// Google Analytics 4 (Google tag) setup. Kept in its own file because the pages' Content-Security-Policy
// blocks inline scripts; the gtag.js loader itself is included in each page's <head>.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-37F58RW5W6');
