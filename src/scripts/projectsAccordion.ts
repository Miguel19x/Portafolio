/**
 * MÓDULO DE ACORDEÓN DE PROYECTOS (CASE STUDIES)
 * - Transforma los proyectos en un acordeón vertical moderno, fluido y accesible.
 * - Cierre al hacer clic encima de la cabecera/acordeón cuando está desplegado.
 * - Cierre automático al hacer scroll hacia abajo fuera del acordeón desplegado,
 *   con compensación instantánea de scroll para evitar saltos de pantalla.
 * - Admite navegación por teclado (flechas arriba/abajo, Home, End, Enter, Espacio).
 * - Sincronización con hashes en la URL (#terroso, #psicologia, #smn, etc.).
 */

export function initProjectsAccordion(): (() => void) | undefined {
  const accordionContainer = document.getElementById('projects-accordion');
  if (!accordionContainer) return;

  if (accordionContainer.dataset.accordionInit === 'true') return;
  accordionContainer.dataset.accordionInit = 'true';

  const items = Array.from(accordionContainer.querySelectorAll<HTMLElement>('.project-accordion-item'));
  const headers = Array.from(accordionContainer.querySelectorAll<HTMLButtonElement>('.project-accordion-header'));

  if (items.length === 0) return;

  function toggleItem(targetItem: HTMLElement, forceOpen?: boolean): void {
    const isCurrentlyExpanded = targetItem.classList.contains('is-expanded') || targetItem.getAttribute('data-expanded') === 'true';
    const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyExpanded;

    items.forEach((item) => {
      const header = item.querySelector<HTMLButtonElement>('.project-accordion-header');
      const collapse = item.querySelector<HTMLElement>('.project-accordion-collapse');
      const flowDiagram = item.querySelector<HTMLElement>('.diagram-flow');

      if (item === targetItem && shouldOpen) {
        item.classList.add('is-expanded');
        item.setAttribute('data-expanded', 'true');
        header?.setAttribute('aria-expanded', 'true');
        collapse?.setAttribute('aria-hidden', 'false');

        // Revelar diagrama de flujo escalonado si existe
        if (flowDiagram && !flowDiagram.classList.contains('is-revealed')) {
          setTimeout(() => {
            flowDiagram.classList.add('is-revealed');
          }, 120);
        }

        // Si el encabezado del elemento quedó oculto debajo de la navbar fija, alinear suavemente
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 80) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          document.dispatchEvent(new CustomEvent('portfolio:layoutchange'));
        }, 220);
      } else {
        item.classList.remove('is-expanded');
        item.setAttribute('data-expanded', 'false');
        header?.setAttribute('aria-expanded', 'false');
        collapse?.setAttribute('aria-hidden', 'true');
      }
    });

    document.dispatchEvent(new CustomEvent('portfolio:layoutchange'));
  }

  // 1. Configuración de clics y teclado en cada acordeón
  items.forEach((item, index) => {
    const headerRow = item.querySelector<HTMLElement>('.project-accordion-header-row');
    const headerBtn = item.querySelector<HTMLButtonElement>('.project-accordion-header');
    const closeBtn = item.querySelector<HTMLButtonElement>('.project-accordion-close-btn');

    // Clic en la cabecera (encima del acordeón): abre o cierra
    if (headerRow) {
      headerRow.addEventListener('click', (e: MouseEvent) => {
        // No cerrar si el clic fue en un enlace directo o botón de acción (demo/repo)
        if ((e.target as HTMLElement).closest('a, .header-quick-btn, .header-quick-actions')) {
          return;
        }
        toggleItem(item);
      });
    }

    // Botón de cierre explícito al final del acordeón desplegado
    if (closeBtn) {
      closeBtn.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        toggleItem(item, false);
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    // Navegación accesible por teclado en el botón trigger
    if (headerBtn) {
      headerBtn.addEventListener('keydown', (e: KeyboardEvent) => {
        let targetHeader: HTMLButtonElement | null = null;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          targetHeader = headers[(index + 1) % headers.length];
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          targetHeader = headers[(index - 1 + headers.length) % headers.length];
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetHeader = headers[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          targetHeader = headers[headers.length - 1];
        }

        if (targetHeader) {
          targetHeader.focus();
        }
      });
    }
  });

  // 2. Cierre automático al scrollear hacia abajo fuera del acordeón desplegado
  let lastScrollY = window.scrollY;
  let isCompensatingScroll = false;

  function handleAutoCloseOnScroll() {
    if (isCompensatingScroll) return;

    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    if (!isScrollingDown) return;

    const expandedItem = items.find((item) => item.classList.contains('is-expanded'));
    if (!expandedItem) return;

    const rect = expandedItem.getBoundingClientRect();
    // Cuando el usuario ha scrolleado hacia abajo y el acordeón ha salido por la parte superior
    if (rect.bottom < 60) {
      const preHeight = expandedItem.offsetHeight;
      toggleItem(expandedItem, false);

      // Compensar la reducción de altura para evitar saltos en la posición del viewport
      const postHeight = expandedItem.offsetHeight;
      const heightDiff = preHeight - postHeight;
      if (heightDiff > 0) {
        isCompensatingScroll = true;
        window.scrollBy({ top: -heightDiff, behavior: 'instant' });
        lastScrollY = window.scrollY;
        setTimeout(() => {
          isCompensatingScroll = false;
        }, 60);
      }
    }
  }

  window.addEventListener('scroll', handleAutoCloseOnScroll, { passive: true });

  // 3. Revelar diagrama del primer item si ya está abierto
  const firstExpanded = items.find((item) => item.classList.contains('is-expanded'));
  if (firstExpanded) {
    const initialFlow = firstExpanded.querySelector<HTMLElement>('.diagram-flow');
    if (initialFlow) {
      setTimeout(() => {
        initialFlow.classList.add('is-revealed');
      }, 200);
    }
  }

  // 4. Sincronización con Hash en la URL (#terroso, #smn, #iris, etc.)
  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;

    const matchingItem = items.find((item) => {
      const id = item.getAttribute('data-project-id');
      return id === hash || item.id === `project-${hash}`;
    });

    if (matchingItem) {
      toggleItem(matchingItem, true);
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  if (window.location.hash) {
    handleHashChange();
  }

  return () => {
    window.removeEventListener('scroll', handleAutoCloseOnScroll);
    window.removeEventListener('hashchange', handleHashChange);
  };
}
