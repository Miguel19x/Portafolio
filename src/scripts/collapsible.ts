/**
 * MÓDULO CASE STUDIES: ACORDEÓN TÉCNICO & SCROLL-REVEAL DE PIPELINES
 * Controla el despliegue de las capturas y paneles técnicos con scroll restoration
 * y la animación escalonada de diagramas de flujo.
 */

import { currentLang, getTranslation } from '../i18n';

function getToggleText(isOpen: boolean): string {
  const key = isOpen ? 'projects.detailsClose' : 'projects.detailsOpen';
  const val = getTranslation(currentLang, key);
  if (val) return val;
  return isOpen ? 'Ocultar Detalles Técnicos ▴' : 'Ver Captura y Detalles Técnicos ▾';
}

export function collapseAllProjects(): void {
  const toggleButtons = document.querySelectorAll<HTMLButtonElement>('.case-study-toggle-btn');

  toggleButtons.forEach((btn) => {
    if (btn.getAttribute('aria-expanded') === 'true') {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-active');

      const targetId = btn.getAttribute('data-toggle');
      if (targetId) {
        const targetCollapse = document.getElementById(targetId);
        if (targetCollapse) {
          targetCollapse.classList.remove('is-open', 'is-expanded');
        }
      }

      const card = btn.closest<HTMLElement>('.case-study-card');
      if (card) {
        card.classList.remove('is-expanded');
      }

      const textSpan = btn.querySelector<HTMLElement>('.toggle-text');
      if (textSpan) {
        textSpan.textContent = getToggleText(false);
      }
    }
  });
}

export function initProjectCollapsible(): void {
  const toggleButtons = document.querySelectorAll<HTMLButtonElement>('.case-study-toggle-btn');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle');
      if (!targetId) return;
      const targetCollapse = document.getElementById(targetId);
      if (!targetCollapse) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const textSpan = btn.querySelector<HTMLElement>('.toggle-text');
      const card = btn.closest<HTMLElement>('.case-study-card');

      if (isExpanded) {
        // Cerrar acordeón
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('is-active');
        targetCollapse.classList.remove('is-open', 'is-expanded');
        if (card) {
          card.classList.remove('is-expanded');
          const cardTop = card.getBoundingClientRect().top + window.scrollY;
          const navOffset = 80;
          if (window.scrollY > cardTop - navOffset) {
            window.scrollTo({
              top: cardTop - navOffset,
              behavior: 'smooth'
            });
          }
        }
        if (textSpan) {
          textSpan.textContent = getToggleText(false);
        }
      } else {
        // Abrir acordeón
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('is-active');
        targetCollapse.classList.add('is-open', 'is-expanded');
        if (card) card.classList.add('is-expanded');
        if (textSpan) {
          textSpan.textContent = getToggleText(true);
        }

        // Revelar diagrama de flujo escalonado si existe
        if (card) {
          const flowDiagram = card.querySelector<HTMLElement>('.diagram-flow');
          if (flowDiagram && !flowDiagram.classList.contains('is-revealed')) {
            setTimeout(() => {
              flowDiagram.classList.add('is-revealed');
            }, 80);
          }
        }
      }
    });
  });

  // Re-evaluar texto de los botones al cambiar de idioma
  document.addEventListener('portfolio:languagechange', () => {
    toggleButtons.forEach((btn) => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const textSpan = btn.querySelector<HTMLElement>('.toggle-text');
      if (textSpan) {
        textSpan.textContent = getToggleText(isExpanded);
      }
    });
  });
}
