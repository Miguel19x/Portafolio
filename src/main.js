/**
 * PUNTO DE ENTRADA PRINCIPAL DEL PORTAFOLIO
 * Arquitectura Modular (ES Modules + Vite)
 * Orquesta la inicialización de módulos independientes para máxima mantenibilidad.
 */

import { initI18n } from './modules/i18n.js';
import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initContact } from './modules/contact.js';
import { initHeroSpecCard } from './modules/heroSpecCard.js';
import { initProjectCollapsible } from './modules/projectCollapsible.js';
import { initCarousel } from './modules/carousel.js';
import { initLightbox } from './modules/lightbox.js';

function initPortfolio() {
  initI18n();
  initTheme();
  initNavigation();
  initContact();
  initHeroSpecCard();
  initProjectCollapsible();
  initCarousel();
  initLightbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
