/* ui.js — interazioni UI: hamburger, scroll animations, floating CTA */
(function () {
  function initHamburger() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-menu]');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.card, .split');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    });
    els.forEach(function (el) { observer.observe(el); });
  }

  function initFloatingCta() {
    var cta = document.getElementById('floating-cta');
    if (!cta) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        cta.classList.add('is-visible');
      } else {
        cta.classList.remove('is-visible');
      }
    }, { passive: true });
  }

  function initAcademyOffers() {
    const now = new Date();
    const superOffertaEnd = new Date('2026-07-09T00:00:00Z');
    const offertaLancioEnd = new Date('2026-09-08T00:00:00Z');

    let activeTier = 'ordinario';
    if (now < superOffertaEnd) {
      activeTier = 'super';
    } else if (now < offertaLancioEnd) {
      activeTier = 'lancio';
    }

    const items = document.querySelectorAll('[data-tier]');
    items.forEach(function(item) {
      const tier = item.getAttribute('data-tier');
      if (tier === activeTier) {
        item.classList.add('price-timeline-item--active');
      } else if (
        (activeTier === 'lancio' && tier === 'super') ||
        (activeTier === 'ordinario' && (tier === 'super' || tier === 'lancio'))
      ) {
        item.classList.add('price-timeline-item--expired');
      } else {
        item.classList.add('price-timeline-item--upcoming');
      }
    });
  }

  function init() {
    initHamburger();
    initScrollAnimations();
    initFloatingCta();
    initAcademyOffers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
