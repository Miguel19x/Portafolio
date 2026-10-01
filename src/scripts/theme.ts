/**
 * MÓDULO DE GESTIÓN DEL TEMA (Dark / Light)
 * Controla la conmutación entre modo claro y oscuro, sincroniza con localStorage,
 * actualiza el icono del botón #theme-toggle y despacha 'portfolio:themechange'.
 */

import { currentLang } from '../i18n';
import { translations } from '../i18n/translations';

export type Theme = 'dark' | 'light';

export let currentTheme: Theme = 'dark';

const SUN_SVG = `<svg class="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const MOON_SVG = `<svg class="w-4 h-4 text-indigo-500 group-hover:text-indigo-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

export function updateThemeIcon(): void {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const isDark = currentTheme === 'dark';
  const t = translations[currentLang]?.theme || translations.es.theme;

  // Si está en dark, mostramos el sol para indicar que al hacer clic se pasará a light
  // Si está en light, mostramos la luna para indicar que se pasará a dark
  themeToggleBtn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
  themeToggleBtn.setAttribute('aria-label', isDark ? t.toLight : t.toDark);
  themeToggleBtn.setAttribute('title', t.title);
}

function applyThemeDom(theme: Theme): void {
  // Congelamos temporalmente todas las transiciones CSS durante la mutación de clases y variables
  // para erradicar el lag perceptivo, los flashes de contraste (texto oscuro sobre fondo oscuro)
  // y la saturación de cálculos en elementos complejos con backdrop-filter o sombras.
  const lockId = 'theme-transition-lock';
  let lock = document.getElementById(lockId);
  if (!lock) {
    lock = document.createElement('style');
    lock.id = lockId;
    lock.textContent = `
      *, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(lock);
  }

  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch (_) {}

  updateThemeIcon();

  // Disparamos evento de sincronización inmediata y síncrona
  document.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: { theme } }));

  // Restaurar transiciones en el frame subsiguiente para que las interacciones de scroll/hover sigan fluidas
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(lockId);
      if (el) el.remove();
    });
  });
}

export function setTheme(theme: Theme, animated = false): void {
  // Si se solicita transición animada y el navegador soporta View Transitions API
  if (
    animated &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document
  ) {
    (document as any).startViewTransition(() => {
      applyThemeDom(theme);
    });
  } else {
    applyThemeDom(theme);
  }
}

export function initTheme(): (() => void) | undefined {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // 1. Obtener tema inicial guardado o preferencia del SO
  let initialTheme: Theme = 'dark';
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') {
      initialTheme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      initialTheme = 'light';
    }
  } catch (_) {}

  // 2. Aplicar al elemento raíz sin animación en carga inicial
  setTheme(initialTheme, false);

  // 3. Listener al botón con transición fluida sin lag
  const onToggleClick = (e: MouseEvent) => {
    e.preventDefault();
    const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, true);
  };

  themeToggleBtn?.addEventListener('click', onToggleClick);

  // 4. Actualizar textos al cambiar de idioma
  const onLangChange = () => {
    updateThemeIcon();
  };
  document.addEventListener('portfolio:languagechange', onLangChange);

  // 5. Escuchar cambios de preferencia del sistema si el usuario no ha forzado uno manualmente
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemThemeChange = (e: MediaQueryListEvent) => {
    try {
      if (!localStorage.getItem('portfolio-theme')) {
        setTheme(e.matches ? 'dark' : 'light', true);
      }
    } catch (_) {}
  };
  mediaQuery.addEventListener?.('change', onSystemThemeChange);

  return () => {
    themeToggleBtn?.removeEventListener('click', onToggleClick);
    document.removeEventListener('portfolio:languagechange', onLangChange);
    mediaQuery.removeEventListener?.('change', onSystemThemeChange);
  };
}
