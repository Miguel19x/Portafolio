/**
 * MÓDULO DE GESTIÓN DEL TEMA (Dark / Light)
 * Controla la conmutación entre modo claro y oscuro, sincroniza con localStorage
 * y escucha preferencias del sistema operativo.
 */

import { getCurrentLang, getTranslation } from './i18n.js';
import { translations } from '../i18n.js';

export function updateThemeIcon() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = document.documentElement.getAttribute('data-theme');
  const isDark = currentTheme === 'dark';
  const currentLang = getCurrentLang();
  const t = translations[currentLang] || translations.es;

  themeToggleBtn.innerHTML = isDark
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  themeToggleBtn.setAttribute('aria-label', isDark ? t.theme.toLight : t.theme.toDark);
  themeToggleBtn.setAttribute('title', t.theme.title);
}

export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem('portfolio-theme');
  } catch (err) {
    console.warn('localStorage getItem failed for portfolio-theme:', err);
  }

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  updateThemeIcon();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('portfolio-theme', newTheme);
      } catch (err) {
        console.warn('localStorage setItem failed for portfolio-theme:', err);
      }
      updateThemeIcon();
    });
  }

  // Actualizar tooltip al cambiar idioma
  document.addEventListener('portfolio:languagechange', () => {
    updateThemeIcon();
  });
}
