/**
 * MÓDULO i18n (INTERNACIONALIZACIÓN REACTIVA)
 * Gestiona el idioma actual, persistencia en localStorage,
 * traducción de textos y atributos (placeholders, aria-labels, titles, SEO).
 */

import { translations } from '../i18n.js';

let currentLang = (() => {
  try {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }
  } catch (e) {
    console.warn('localStorage not accessible for portfolio-lang:', e);
  }
  const navLang = navigator.language || navigator.userLanguage || '';
  return navLang.toLowerCase().startsWith('en') ? 'en' : 'es';
})();

export function getCurrentLang() {
  return currentLang;
}

export function getTranslation(lang, path) {
  if (!translations[lang]) return null;
  const keys = path.split('.');
  let current = translations[lang];
  for (const key of keys) {
    if (current && current[key] !== undefined) {
      current = current[key];
    } else {
      return null;
    }
  }
  return current;
}

export function applyTranslations(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  const t = translations[lang];
  if (!t) return;

  // A. Elementos de texto plano data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = getTranslation(lang, key);
    if (val !== null && val !== undefined) {
      el.textContent = val;
    }
  });

  // B. Elementos con HTML data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    const val = getTranslation(lang, key);
    if (val !== null && val !== undefined) {
      el.innerHTML = val;
    }
  });

  // C. Placeholders data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = getTranslation(lang, key);
    if (val !== null && val !== undefined) {
      el.setAttribute('placeholder', val);
    }
  });

  // D. Aria-labels data-i18n-aria-label
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    const val = getTranslation(lang, key);
    if (val !== null && val !== undefined) {
      el.setAttribute('aria-label', val);
    }
  });

  // E. Titles data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const val = getTranslation(lang, key);
    if (val !== null && val !== undefined) {
      el.setAttribute('title', val);
    }
  });

  // F. SEO y Meta Tags
  if (t.meta) {
    document.title = t.meta.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.meta.description);

    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle) metaOgTitle.setAttribute('content', t.meta.ogTitle);

    const metaOgDesc = document.querySelector('meta[property="og:description"]');
    if (metaOgDesc) metaOgDesc.setAttribute('content', t.meta.ogDescription);

    const metaTwTitle = document.querySelector('meta[name="twitter:title"]');
    if (metaTwTitle) metaTwTitle.setAttribute('content', t.meta.ogTitle);

    const metaTwDesc = document.querySelector('meta[name="twitter:description"]');
    if (metaTwDesc) metaTwDesc.setAttribute('content', t.meta.ogDescription);
  }

  // G. Actualizar Botones Selectores de Idioma
  const toggleInfo = t.langToggle;
  document.querySelectorAll('.lang-toggle-btn').forEach((btn) => {
    btn.setAttribute('aria-label', toggleInfo.ariaLabel);
    btn.setAttribute('title', toggleInfo.title);
    const indicator = btn.querySelector('.lang-code') || document.getElementById('lang-code-indicator');
    if (indicator) {
      indicator.textContent = toggleInfo.buttonText;
    }
  });

  // Notificar a otros módulos que el idioma cambió
  document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { lang, t } }));
}

export function initI18n() {
  document.querySelectorAll('.lang-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'es' ? 'en' : 'es';
      try {
        localStorage.setItem('portfolio-lang', newLang);
      } catch (err) {
        console.warn('localStorage setItem failed:', err);
      }
      applyTranslations(newLang);
    });
  });

  // Aplicar traducción inicial
  applyTranslations(currentLang);
}
