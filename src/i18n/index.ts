/**
 * MOTOR DE INTERNACIONALIZACIÓN (i18n)
 * Controla el cambio de idioma en cliente, persistencia en localStorage,
 * actualización de atributos data-i18n, meta tags y botones selectores.
 */

import { translations, type Lang } from './translations';

export let currentLang: Lang = 'es';

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch (_) {}

  const browserLang = navigator.language?.toLowerCase() || '';
  if (browserLang.startsWith('en')) return 'en';
  return 'es';
}

currentLang = getInitialLang();

export function getTranslation(lang: Lang, path: string): string | null {
  const t = translations[lang];
  if (!t) return null;

  const keys = path.split('.');
  let current: any = t;
  for (const key of keys) {
    if (current && current[key] !== undefined) {
      current = current[key];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
}

export function applyTranslations(lang: Lang) {
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  const t = translations[lang];
  if (!t) return;

  // 1. Elementos de texto plano data-i18n
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = getTranslation(lang, key);
    if (val !== null) {
      el.textContent = val;
    }
  });

  // 2. Elementos con HTML data-i18n-html
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    const val = getTranslation(lang, key);
    if (val !== null) {
      el.innerHTML = val;
    }
  });

  // 3. Placeholders data-i18n-placeholder
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const val = getTranslation(lang, key);
    if (val !== null) {
      el.setAttribute('placeholder', val);
    }
  });

  // 4. Aria-labels data-i18n-aria-label
  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key) return;
    const val = getTranslation(lang, key);
    if (val !== null) {
      el.setAttribute('aria-label', val);
    }
  });

  // 5. Titles data-i18n-title
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (!key) return;
    const val = getTranslation(lang, key);
    if (val !== null) {
      el.setAttribute('title', val);
    }
  });

  // 6. Meta Tags y SEO
  if (t.meta) {
    document.title = t.meta.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.meta.description);

    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle) metaOgTitle.setAttribute('content', t.meta.ogTitle);

    const metaOgDesc = document.querySelector('meta[property="og:description"]');
    if (metaOgDesc) metaOgDesc.setAttribute('content', t.meta.ogDescription);
  }

  // 7. Actualizar Botones Selectores de Idioma (Lang Toggle)
  const toggleInfo = t.langToggle;
  document.querySelectorAll<HTMLElement>('.lang-toggle-btn').forEach((btn) => {
    btn.setAttribute('aria-label', toggleInfo.ariaLabel);
    btn.setAttribute('title', toggleInfo.title);
    const indicator = btn.querySelector<HTMLElement>('.lang-code') || document.getElementById('lang-code-indicator');
    if (indicator) {
      indicator.textContent = toggleInfo.buttonText;
    }
  });

  // 8. Despachar evento para componentes reactivos
  document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { lang, t } }));
}

export function initI18n(): (() => void) {
  const toggleHandler = (e: Event) => {
    e.preventDefault();
    const newLang: Lang = currentLang === 'es' ? 'en' : 'es';
    try {
      localStorage.setItem('portfolio-lang', newLang);
    } catch (_) {}
    applyTranslations(newLang);
  };

  const buttons = document.querySelectorAll<HTMLElement>('.lang-toggle-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', toggleHandler);
  });

  // Aplicar traducción según preferencia almacenada o navegador
  applyTranslations(currentLang);

  return () => {
    buttons.forEach((btn) => {
      btn.removeEventListener('click', toggleHandler);
    });
  };
}
