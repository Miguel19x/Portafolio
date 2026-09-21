/**
 * MÓDULO CASE STUDIES: ACORDEÓN TÉCNICO & SCROLL-REVEAL DE PIPELINES
 * Controla el despliegue de las capturas y paneles técnicos con scroll restoration
 * y la animación escalonada de diagramas de flujo.
 */

import { getCurrentLang, getTranslation } from './i18n.js';

export function collapseAllProjects() {
  const toggleButtons = document.querySelectorAll('.case-study-toggle-btn');
  const currentLang = getCurrentLang();

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

      const card = btn.closest('.case-study-card');
      if (card) {
        card.classList.remove('is-expanded');
      }

      const textSpan = btn.querySelector('.toggle-text');
      if (textSpan) {
        textSpan.setAttribute('data-i18n', 'projects.techDetailsBtn');
        textSpan.textContent = getTranslation(currentLang, 'projects.techDetailsBtn') || 'Ver Captura y Detalles Técnicos ▾';
      }
    }
  });
}

export function initProjectCollapsible() {
  const toggleButtons = document.querySelectorAll('.case-study-toggle-btn');

  function updateToggleButtonsText() {
    const currentLang = getCurrentLang();
    toggleButtons.forEach((btn) => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const textSpan = btn.querySelector('.toggle-text');
      if (!textSpan) return;

      if (isExpanded) {
        textSpan.setAttribute('data-i18n', 'projects.techDetailsHideBtn');
        textSpan.textContent = getTranslation(currentLang, 'projects.techDetailsHideBtn') || 'Ocultar Captura y Detalles Técnicos ▴';
      } else {
        textSpan.setAttribute('data-i18n', 'projects.techDetailsBtn');
        textSpan.textContent = getTranslation(currentLang, 'projects.techDetailsBtn') || 'Ver Captura y Detalles Técnicos ▾';
      }
    });
  }

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle');
      if (!targetId) return;
      const targetCollapse = document.getElementById(targetId);
      if (!targetCollapse) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const textSpan = btn.querySelector('.toggle-text');
      const card = btn.closest('.case-study-card');
      const currentLang = getCurrentLang();

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
          textSpan.setAttribute('data-i18n', 'projects.techDetailsBtn');
          textSpan.textContent = getTranslation(currentLang, 'projects.techDetailsBtn') || 'Ver Captura y Detalles Técnicos ▾';
        }
      } else {
        // Abrir acordeón
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('is-active');
        targetCollapse.classList.add('is-open', 'is-expanded');
        if (card) card.classList.add('is-expanded');
        if (textSpan) {
          textSpan.setAttribute('data-i18n', 'projects.techDetailsHideBtn');
          textSpan.textContent = getTranslation(currentLang, 'projects.techDetailsHideBtn') || 'Ocultar Captura y Detalles Técnicos ▴';
        }

        // Animar el pipeline de flujo de este case study
        const flowDiagram = targetCollapse.querySelector('.diagram-flow');
        if (flowDiagram && !flowDiagram.classList.contains('is-revealed')) {
          setTimeout(() => {
            flowDiagram.classList.add('is-revealed');
          }, 150);
        }
      }
    });
  });

  // Animación scroll-reveal para los diagramas de pipeline
  const diagramFlows = document.querySelectorAll('.diagram-flow');
  if ('IntersectionObserver' in window) {
    const diagramObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          diagramObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    diagramFlows.forEach((flow) => diagramObserver.observe(flow));
  } else {
    diagramFlows.forEach((flow) => flow.classList.add('is-revealed'));
  }

  // Actualizar textos al cambiar de idioma
  document.addEventListener('portfolio:languagechange', updateToggleButtonsText);
}
