/* cookies.js — gestione consenso GA */
(function () {
  var GA_ID = (window.__SITE_CONFIG__ && window.__SITE_CONFIG__.gaId) || '';

  function loadGA() {
    if (!GA_ID) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function hide() {
    var el = document.getElementById('cookie-banner');
    if (el) el.classList.remove('is-visible');
  }

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    hide();
    loadGA();
  }

  function reject() {
    localStorage.setItem('cookie-consent', 'rejected');
    hide();
  }

  function init() {
    var c = localStorage.getItem('cookie-consent');
    if (c === 'accepted') {
      loadGA();
      return;
    }
    if (c === 'rejected') return;

    var banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.add('is-visible');

    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');
    if (acceptBtn) acceptBtn.addEventListener('click', accept);
    if (rejectBtn) rejectBtn.addEventListener('click', reject);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
