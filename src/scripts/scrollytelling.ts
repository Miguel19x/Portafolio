import { THEMED_SECTION_PALETTES } from '../data/palettes';
import type { SectionId } from '../types';

export function initScrollytelling(): () => void {
  const root = document.documentElement;
  const glow1 = document.getElementById('glow-circle-1');
  const glow2 = document.getElementById('glow-circle-2');
  const navPills = Array.from(document.querySelectorAll<HTMLElement>('.nav-scroller-pill'));
  const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('section[data-section]'));
  const sectionOrder = sectionElements.map((el) => (el.getAttribute('data-section') as SectionId) || 'hero');

  let activeSectionId: SectionId = 'hero';

  let cachedDocHeight = 0;
  function updateDocHeight() {
    cachedDocHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
  }
  updateDocHeight();

  // ==========================================================================
  // DETECCIÓN DE SECCIÓN ACTIVA (SIN getBoundingClientRect POR FRAME)
  // Un IntersectionObserver sobre una franja delgada en el centro del viewport
  // reemplaza el escaneo de las 6 secciones en cada evento de scroll. El
  // callback del observer solo se ejecuta cuando una sección realmente entra
  // o sale de esa franja, no en cada frame de scroll (nativo o por rAF).
  // ==========================================================================
  const visibleInBand = new Set<SectionId>();

  function pickActiveFromVisible(): SectionId {
    for (let i = sectionOrder.length - 1; i >= 0; i--) {
      if (visibleInBand.has(sectionOrder[i])) return sectionOrder[i];
    }
    return activeSectionId;
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

  function setActiveSection(nextSectionId: SectionId) {
    if (nextSectionId === activeSectionId) return;
    activeSectionId = nextSectionId;
    applyPalette(activeSectionId);
    updatePills(activeSectionId);
  }

  // Observer de la franja central: decide qué sección domina el centro del
  // viewport. Solo se ejecuta cuando una sección cruza el umbral, no en cada
  // frame de scroll — es el reemplazo barato de recorrer getBoundingClientRect
  // sobre las 6 secciones todo el tiempo que dura cualquier scroll (nativo,
  // por rAF, o el scroll suave largo al navegar entre secciones con los botones).
  const centerBandObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target.getAttribute('data-section') as SectionId) || 'hero';
        if (entry.isIntersecting) {
          visibleInBand.add(id);
        } else {
          visibleInBand.delete(id);
        }
      });

      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollY >= 80) {
        setActiveSection(pickActiveFromVisible());
      }
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sectionElements.forEach((sec) => centerBandObserver.observe(sec));

  // Casos extremos (tope y fondo absolutos de la página): comparaciones
  // numéricas baratas (scrollY/innerHeight), sin leer geometría de elementos.
  let edgeRafId: number | null = null;
  function checkEdges() {
    edgeRafId = null;
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const winHeight = window.innerHeight;
    const docHeight = cachedDocHeight || document.documentElement.scrollHeight || 0;

    if (scrollY < 80) {
      setActiveSection('hero');
    } else if (scrollY + winHeight >= docHeight - 45) {
      setActiveSection('contacto');
    }
  }

  const onScroll = () => {
    if (edgeRafId !== null) return;
    edgeRafId = window.requestAnimationFrame(checkEdges);
  };

  const onResize = () => {
    updateDocHeight();
    checkEdges();
    setActiveSection(pickActiveFromVisible());
  };

  const onThemeChange = () => {
    // Sincronización inmediata de la paleta para la sección activa actual.
    // No requiere recalcular qué sección está activa: el tema no altera
    // la posición de scroll.
    applyPalette(activeSectionId);
    updatePills(activeSectionId);
  };

  const onLayoutChange = () => {
    // Un acordeón se expandió/colapsó: solo necesitamos refrescar la altura
    // cacheada del documento para los casos extremos. El IntersectionObserver
    // ya se reajusta solo cuando cambia la geometría de las secciones.
    updateDocHeight();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('portfolio:themechange', onThemeChange);
  document.addEventListener('portfolio:layoutchange', onLayoutChange);

  // Estado inicial (el IntersectionObserver entregará su primera lectura
  // real en el próximo microtask; mientras tanto mostramos la paleta de Hero).
  applyPalette(activeSectionId);
  updatePills(activeSectionId);

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

    if ('IntersectionObserver' in window) {
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
        { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
      );

      scrollRevealTargets.forEach((el) => revealObserver?.observe(el));
    } else {
      scrollRevealTargets.forEach((el) => el.classList.add('is-visible'));
    }

  // Cleanup
  return () => {
    if (edgeRafId !== null) cancelAnimationFrame(edgeRafId);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('portfolio:themechange', onThemeChange);
    document.removeEventListener('portfolio:layoutchange', onLayoutChange);
    centerBandObserver.disconnect();
    revealObserver?.disconnect();
  };
}
