/**
 * MÓDULO DE INTERACCIÓN DE NAVEGACIÓN Y CABECERA (Header)
 * - Barra de progreso de lectura / scroll fluida.
 * - Menú móvil con animaciones, soporte de accesibilidad y auto-cierre.
 */

export function initHeaderNav(): () => void {
  const progressBar = document.getElementById('header-scroll-progress');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll<HTMLAnchorElement>('.mobile-nav-link, .mobile-cta-link');

  // 1. Barra de progreso de scroll (Reading progress)
  let ticking = false;
  let cachedScrollHeight = 0;

  function recalculateScrollHeight() {
    const docElem = document.documentElement;
    const docBody = document.body;
    cachedScrollHeight = (docElem.scrollHeight || docBody.scrollHeight || 0) - window.innerHeight;
  }

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = cachedScrollHeight || ((document.documentElement.scrollHeight || 0) - window.innerHeight);

    const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  };

  const onLayoutChange = () => {
    recalculateScrollHeight();
    onScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onLayoutChange, { passive: true });
  document.addEventListener('portfolio:layoutchange', onLayoutChange);

  // Defer initial layout measurements to rAF to eliminate forced reflow on page load
  window.requestAnimationFrame(() => {
    recalculateScrollHeight();
    updateScrollProgress();
  });

  // 2. Control interactivo del menú móvil
  let closeTimeout: number | undefined;

  function openMenu() {
    if (!mobileDrawer || !menuToggle) return;
    if (closeTimeout) clearTimeout(closeTimeout);

    mobileDrawer.classList.remove('hidden');
    requestAnimationFrame(() => {
      mobileDrawer.classList.add('is-open');
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    });
  }

  function closeMenu() {
    if (!mobileDrawer || !menuToggle) return;
    mobileDrawer.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');

    if (closeTimeout) clearTimeout(closeTimeout);
    closeTimeout = window.setTimeout(() => {
      if (!menuToggle.classList.contains('is-open')) {
        mobileDrawer.classList.add('hidden');
      }
    }, 260);
  }

  function toggleMenu() {
    const isOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  const onToggleClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggleMenu();
  };

  menuToggle?.addEventListener('click', onToggleClick);

  // Auto-cierre al hacer click en cualquiera de los enlaces móviles
  const onLinkClick = () => {
    closeMenu();
  };

  mobileLinks.forEach((link) => {
    link.addEventListener('click', onLinkClick);
  });

  // Cerrar al hacer click fuera del contenedor de navegación
  const onDocumentClick = (e: MouseEvent) => {
    const target = e.target as Node;
    if (mobileDrawer && !mobileDrawer.contains(target) && menuToggle && !menuToggle.contains(target)) {
      if (menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    }
  };
  document.addEventListener('click', onDocumentClick);

  // Cerrar con tecla Escape
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  };
  document.addEventListener('keydown', onKeyDown);

  // Auto-cierre si se redimensiona a pantalla de escritorio (lg >= 1024px)
  const onResize = () => {
    if (window.innerWidth >= 1024 && menuToggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  };
  window.addEventListener('resize', onResize, { passive: true });

  // 3. Navegación fluida y centrada sin desplazamiento sobrante hacia secciones previas
  function navigateToSection(targetHash: string): void {
    if (!targetHash) return;

    if (targetHash === '#top' || targetHash === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', targetHash);
      return;
    }

    const cleanId = targetHash.replace(/^#/, '');
    const targetEl = document.getElementById(cleanId) || document.querySelector(`[data-section="${cleanId}"]`);
    if (!targetEl) return;

    const section = (targetEl.tagName.toLowerCase() === 'section' 
      ? targetEl 
      : targetEl.closest('section') || targetEl) as HTMLElement;

    const siteContainer = section.querySelector('.site-container') as HTMLElement | null;
    
    // Altura efectiva del header flotante
    const headerNav = document.querySelector('.site-header-nav') as HTMLElement | null;
    const headerBottom = headerNav 
      ? headerNav.getBoundingClientRect().height + (window.innerWidth < 640 ? 10 : 16)
      : 70;

    // Calcular la posición absoluta del inicio del contenido
    const containerTopAbsolute = siteContainer 
      ? siteContainer.getBoundingClientRect().top + window.scrollY 
      : section.getBoundingClientRect().top + window.scrollY;

    // Queremos que el contenido empiece exactamente debajo de la barra flotante con un respiro estético de 20px
    // Esto asegura que el bloque esté perfectamente enfocado y centrado en la vista
    // y que el separador y la sección previa queden 100% ocultos arriba.
    const optimalScrollY = Math.max(0, containerTopAbsolute - headerBottom - 20);

    window.scrollTo({
      top: optimalScrollY,
      behavior: 'smooth'
    });

    if (history.pushState) {
      history.pushState(null, '', targetHash);
    }
  }

  // Interceptar clicks en todos los enlaces de sección (desktop navbar, mobile drawer, botones CTA y hero pill)
  const navSectionAnchors = document.querySelectorAll<HTMLAnchorElement>(
    '.nav-scroller-pill, .mobile-nav-link, a.btn-brand-accent[href^="#"], a.mobile-cta-link[href^="#"], #hero-scroll-cue, a[href="#hero"], a[href="#sobre-mi"], a[href="#proyectos"], a[href="#habilidades"], a[href="#trayectoria"], a[href="#contacto"], a[href="#enfoque"], a[href="#top"]'
  );

  const onNavAnchorClick = (e: MouseEvent) => {
    const anchor = e.currentTarget as HTMLAnchorElement;
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      navigateToSection(href);
    }
  };

  navSectionAnchors.forEach((anchor) => {
    anchor.addEventListener('click', onNavAnchorClick);
  });

  return () => {
    window.removeEventListener('scroll', onScroll);
    menuToggle?.removeEventListener('click', onToggleClick);
    mobileLinks.forEach((link) => link.removeEventListener('click', onLinkClick));
    navSectionAnchors.forEach((anchor) => anchor.removeEventListener('click', onNavAnchorClick));
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onResize);
    if (closeTimeout) clearTimeout(closeTimeout);
  };
}
