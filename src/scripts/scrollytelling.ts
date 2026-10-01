import { THEMED_SECTION_PALETTES } from '../data/palettes';
import type { SectionId } from '../types';

export function initScrollytelling(): () => void {
  const root = document.documentElement;
  const glow1 = document.getElementById('glow-circle-1');
  const glow2 = document.getElementById('glow-circle-2');
  const navPills = Array.from(document.querySelectorAll<HTMLElement>('.nav-scroller-pill'));
  const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('section[data-section]'));

  let activeSectionId: SectionId = 'hero';
  let rafId: number | null = null;

  let cachedDocHeight = 0;
  function updateDocHeight() {
    cachedDocHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
  }
  updateDocHeight();

  function determineActiveSection(): SectionId {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const winHeight = window.innerHeight;
    const docHeight = cachedDocHeight || (document.documentElement.scrollHeight || 0);

    // 1. Extremo superior absoluto: Hero garantizado
    if (scrollY < 80) {
      return 'hero';
    }

    // 2. Extremo inferior absoluto: Contacto garantizado
    if (scrollY + winHeight >= docHeight - 45) {
      return 'contacto';
    }

    // 3. Selección basada en presencia visual ponderada en el centro del viewport
    // Funciona con secciones dinámicas de cualquier altura (como acordeones expandidos de 1500px+)
    const midScreen = winHeight * 0.48;
    let bestSection: SectionId = 'hero';
    let maxScore = -1;

    for (let i = 0; i < sectionElements.length; i++) {
      const sec = sectionElements[i];
      const rect = sec.getBoundingClientRect();
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(winHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight <= 0) continue;

      // Bono si la sección abarca el centro de lectura del viewport
      const coversCenter = rect.top <= midScreen && rect.bottom >= midScreen;
      const score = visibleHeight + (coversCenter ? winHeight * 0.45 : 0);

      if (score > maxScore) {
        maxScore = score;
        bestSection = (sec.getAttribute('data-section') as SectionId) || 'hero';
      }
    }

    return bestSection;
  }

  function applyPalette(sectionId: SectionId) {
    const theme = (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark') as 'dark' | 'light';
    const palette = THEMED_SECTION_PALETTES[theme]?.[sectionId] || THEMED_SECTION_PALETTES.dark[sectionId];
    if (palette) {
      root.style.setProperty('--bg-current', palette.bg);
      root.style.setProperty('--bg-surface', palette.surface);
      root.style.setProperty('--section-tint', palette.tint);
      root.style.setProperty('--section-tint-dim', palette.tintDim);
      root.style.setProperty('--border-token', palette.border);

      if (glow1) glow1.style.background = palette.glow1;
      if (glow2) glow2.style.background = palette.glow2;
    }
  }

  function updatePills(sectionId: SectionId) {
    for (let i = 0; i < navPills.length; i++) {
      const pill = navPills[i];
      const isMatch = pill.getAttribute('data-nav') === sectionId;
      if (isMatch) {
        pill.classList.add('active');
        pill.setAttribute('aria-current', 'true');
      } else {
        pill.classList.remove('active');
        pill.removeAttribute('aria-current');
      }
    }
  }

  function syncThemeAndNav(force = false) {
    if (force) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      updateDocHeight();
      const nextSectionId = determineActiveSection();
      activeSectionId = nextSectionId;
      applyPalette(activeSectionId);
      updatePills(activeSectionId);
      return;
    }

    if (rafId !== null) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      const nextSectionId = determineActiveSection();
      if (nextSectionId === activeSectionId) return;
      activeSectionId = nextSectionId;
      applyPalette(activeSectionId);
      updatePills(activeSectionId);
    });
  }

  // Sincronización continua en scroll, redimensionamiento y cambios de layout (acordeones)
  const onScroll = () => syncThemeAndNav(false);
  const onResize = () => {
    updateDocHeight();
    syncThemeAndNav(true);
  };
  const onThemeChange = () => {
    // Sincronización INMEDIATA y SÍNCRONA de la paleta para la sección activa actual.
    // No requiere ejecutar determineActiveSection() ni consultar geometrías del DOM
    // porque el tema no altera la posición de scroll ni la sección activa.
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    applyPalette(activeSectionId);
    updatePills(activeSectionId);
  };
  const onLayoutChange = () => {
    updateDocHeight();
    syncThemeAndNav(true);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('portfolio:themechange', onThemeChange);
  document.addEventListener('portfolio:layoutchange', onLayoutChange);

  // Ejecución inicial inmediata
  syncThemeAndNav(true);

  // ==========================================================================
  // ENTRADA & SCROLL REVEAL (Hero Entrance + Cascading Scroll Reveal)
  // Las animaciones se ejecutan de forma nativa independientemente de ajustes del SO
  // ==========================================================================
  let revealObserver: IntersectionObserver | null = null;

  // 1. Hero Entrance Animation: Entrada fluida y escalonada al entrar a la página
  const heroMain = document.querySelector<HTMLElement>('#hero .hero-main');
  const heroSpec = document.querySelector<HTMLElement>('#hero .hero-spec');
  const heroEntranceEls: HTMLElement[] = [];

    if (heroMain) {
      const rawHeroEls = [
        heroMain.querySelector(':scope > div:first-child'),   // Status & Prompt badge
        heroMain.querySelector(':scope > h1'),                // Nombre principal
        heroMain.querySelector(':scope > p:first-of-type'),    // Tagline & Typewriter
        heroMain.querySelector(':scope > p:last-of-type'),     // Biografía narrativa
        heroMain.querySelector(':scope > div:nth-of-type(2)'), // Botones CTA
        heroMain.querySelector(':scope > div:nth-of-type(3)'), // Cinta de métricas
      ].filter(Boolean) as HTMLElement[];

      rawHeroEls.forEach((el, idx) => {
        el.classList.add('reveal-el');
        el.style.transitionDelay = `${idx * 80}ms`;
        heroEntranceEls.push(el);
      });

      if (heroSpec) {
        heroSpec.classList.add('reveal-scale');
        heroSpec.style.transitionDelay = '240ms';
        heroEntranceEls.push(heroSpec);
      }

      // Disparo secuencial al primer render del navegador
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          heroEntranceEls.forEach((el) => {
            el.classList.add('is-visible');
            el.addEventListener(
              'transitionend',
              (e) => {
                if (e.target === el) {
                  el.style.willChange = 'auto';
                  el.style.transitionDelay = '';
                }
              },
              { once: true }
            );
          });
        });
      });
    }

    // 2. Scroll Reveal: Cabeceras y bloques de contenido al bajar por la página
    const scrollRevealTargets: HTMLElement[] = [];
    const contentSections = Array.from(
      document.querySelectorAll<HTMLElement>('section[data-section]:not(#hero)')
    );

    contentSections.forEach((sec) => {
      // Cabecera de la sección
      const header = sec.querySelector<HTMLElement>('.section-header-mb');
      if (header) {
        header.classList.add('reveal-el');
        header.style.transitionDelay = '0ms';
        scrollRevealTargets.push(header);
      }

      // Elementos de contenido según cada sección
      const secId = sec.getAttribute('data-section');
      let contentItems: HTMLElement[] = [];

      if (secId === 'sobre-mi') {
        contentItems = Array.from(sec.querySelectorAll<HTMLElement>('.site-container > .grid > div'));
      } else if (secId === 'proyectos') {
        contentItems = Array.from(sec.querySelectorAll<HTMLElement>('.project-accordion-item'));
      } else if (secId === 'habilidades') {
        contentItems = Array.from(sec.querySelectorAll<HTMLElement>('.site-container > .grid > div'));
      } else if (secId === 'trayectoria') {
        const expCard = sec.querySelector<HTMLElement>('.experience-card');
        if (expCard) contentItems = [expCard];
      } else if (secId === 'contacto') {
        contentItems = Array.from(sec.querySelectorAll<HTMLElement>('.site-container > .grid > div'));
      }

      contentItems.forEach((item, idx) => {
        item.classList.add('reveal-el');
        item.style.transitionDelay = `${(idx + 1) * 90}ms`;
        scrollRevealTargets.push(item);
      });
    });

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('is-visible');
            target.addEventListener(
              'transitionend',
              (e) => {
                if (e.target === target) {
                  target.style.willChange = 'auto';
                  target.style.transitionDelay = '';
                }
              },
              { once: true }
            );
            revealObserver?.unobserve(target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    scrollRevealTargets.forEach((el) => revealObserver?.observe(el));

  // Cleanup
  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('portfolio:themechange', onThemeChange);
    document.removeEventListener('portfolio:layoutchange', onLayoutChange);
    revealObserver?.disconnect();
  };
}
