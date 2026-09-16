/**
 * MÓDULO DE NAVEGACIÓN
 * Controla el menú móvil desplegable, el scroll spy para resaltar secciones activas
 * y el indicador de scroll interactivo en el Hero.
 */

export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  // Menú Móvil
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
      mobileMenuBtn.innerHTML = isOpen
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // Resaltar Enlace Activo en el Scroll (Scroll Spy)
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((item) => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // Indicadores de Scroll Interactivos entre Secciones
  const scrollBtns = document.querySelectorAll('.section-scroll-btn, .hero-scroll-btn, [data-scroll-to]');
  scrollBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-scroll-to') || (btn.id === 'hero-scroll-indicator' ? '#sobre-mi' : null);
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const headerEl = document.querySelector('.site-header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 72;
      const targetRect = target.getBoundingClientRect();
      const targetTop = targetRect.top + window.pageYOffset - (headerHeight - 6);

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    });
  });

  // Visibilidad del indicador del Hero
  const heroScrollWrap = document.getElementById('hero-scroll-wrap');
  function updateHeroScrollIndicatorVisibility() {
    if (!heroScrollWrap) return;
    if (window.pageYOffset > 50) {
      heroScrollWrap.classList.add('is-hidden');
    } else {
      heroScrollWrap.classList.remove('is-hidden');
    }
  }

  window.addEventListener('scroll', updateHeroScrollIndicatorVisibility, { passive: true });
  updateHeroScrollIndicatorVisibility();
}
