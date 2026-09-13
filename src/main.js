/**
 * PORTAFOLIO MIGUEL ANGEL ARANGUREN
 * Funcionalidad interactiva:
 * - Sistema i18n reactivo con LocalStorage (Español / Inglés) sin recarga
 * - Tema (Oscuro / Claro) con persistencia
 * - Copiado Rápido de Email con Toast
 * - Menú Móvil y Navegación Activa
 * - Formulario de Contacto Funcional con retroalimentación localizada
 */

import { translations } from './i18n.js';

function initPortfolio() {
  // =========================================================================
  // ELEMENTOS DOM PRINCIPALES
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit-btn');
  // Obtención del correo (desde variable de entorno VITE_CONTACT_EMAIL o ensamblado dinámico ofuscado)
  const getObfuscatedEmail = () => {
    if (import.meta.env && import.meta.env.VITE_CONTACT_EMAIL) {
      return import.meta.env.VITE_CONTACT_EMAIL;
    }
    const user = atob('bWlndWVsYXJhbmd1cmVuMTl4');
    const domain = atob('b3V0bG9vay5jb20=');
    return `${user}@${domain}`;
  };
  const EMAIL_ADDRESS = getObfuscatedEmail();

  // Asegurar que el widget de Turnstile tenga la sitekey correcta desde el entorno
  const turnstileWidget = document.getElementById('cf-turnstile');
  if (turnstileWidget) {
    const envKey = import.meta.env?.VITE_TURNSTILE_SITE_KEY;
    const currentKey = turnstileWidget.getAttribute('data-sitekey');
    if (envKey && (!currentKey || currentKey.startsWith('%VITE_'))) {
      turnstileWidget.setAttribute('data-sitekey', envKey);
    } else if (!currentKey || currentKey.startsWith('%VITE_')) {
      turnstileWidget.setAttribute('data-sitekey', '1x00000000000000000000AA');
    }
  }
  let toastTimer = null;

  // =========================================================================
  // 1. SISTEMA i18n (INTERNACIONALIZACIÓN REACTIVA)
  // =========================================================================
  
  // Obtener idioma guardado o preferido del navegador, o por defecto 'es'
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

  function getTranslation(lang, path) {
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

  function applyTranslations(lang) {
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

    // H. Actualizar Tooltip / Aria-label del Tema
    updateThemeIcon();
  }

  // Escuchar clic en todos los conmutadores de idioma
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

  // =========================================================================
  // 2. GESTIÓN DEL TEMA (Dark / Light)
  // =========================================================================
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

  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    const t = translations[currentLang] || translations.es;
    
    themeToggleBtn.innerHTML = isDark
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    
    themeToggleBtn.setAttribute('aria-label', isDark ? t.theme.toLight : t.theme.toDark);
    themeToggleBtn.setAttribute('title', t.theme.title);
  }

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

  // Inicializar idioma en DOM
  applyTranslations(currentLang);

  // =========================================================================
  // 3. COPIADO RÁPIDO DE EMAIL CON TOAST LOCALIZADO
  // =========================================================================
  if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener('click', async () => {
      const t = translations[currentLang] || translations.es;
      const copyMsg = t.contact.toastCopied + EMAIL_ADDRESS;

      try {
        await navigator.clipboard.writeText(EMAIL_ADDRESS);
        showToast(copyMsg);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = EMAIL_ADDRESS;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(copyMsg);
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Inserción dinámica del correo en el DOM (protección anti-scraping para que no esté en el HTML inicial)
  const contactEmailVal = document.getElementById('contact-email-val');
  const contactMailtoLink = document.getElementById('contact-mailto-link');

  if (contactEmailVal) {
    contactEmailVal.textContent = EMAIL_ADDRESS;
  }

  if (contactMailtoLink) {
    const defaultSubject = encodeURIComponent('Oportunidad Fullstack - Miguel Aranguren');
    contactMailtoLink.setAttribute('href', `mailto:${EMAIL_ADDRESS}?subject=${defaultSubject}`);
  }

  // =========================================================================
  // 4. MENÚ MÓVIL
  // =========================================================================
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
      mobileMenuBtn.innerHTML = isOpen
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // =========================================================================
  // 5. ANIMACIÓN EN CASCADA (STAGGER) PARA BADGES DE CORE STACK
  // =========================================================================
  const specTags = document.querySelector('.spec-tags');
  if (specTags) {
    const specObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          specTags.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    specObserver.observe(specTags);
  }

  // =========================================================================
  // 6. ENVÍO FUNCIONAL DEL FORMULARIO DE CONTACTO CON i18n
  // =========================================================================
  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const t = translations[currentLang] || translations.es;

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const hpInput = document.getElementById('contact-hp-company');

      // 1. Protección Honeypot: si un bot llena este campo invisible, descartar silenciosamente
      if (hpInput && hpInput.value.trim() !== '') {
        submitBtn.disabled = true;
        formStatus.className = 'form-status info';
        formStatus.textContent = t.contact.statusProcessing;
        setTimeout(() => {
          formStatus.className = 'form-status success';
          formStatus.textContent = t.contact.statusSuccess;
          contactForm.reset();
          submitBtn.disabled = false;
        }, 1200);
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = t.contact.statusEmpty;
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.className = 'form-status error';
        formStatus.textContent = t.contact.statusInvalidEmail || 'Por favor ingresa un correo electrónico válido.';
        return;
      }

      // Obtener token de Cloudflare Turnstile si está presente
      const turnstileToken = contactForm.querySelector('[name="cf-turnstile-response"]')?.value || '';

      // Estado enviando
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block; animation: pulse-ring 1s infinite;">●</span>
        <span>${t.contact.sendingBtnText}</span>
      `;
      formStatus.className = 'form-status info';
      formStatus.textContent = t.contact.statusProcessing;

      const contactApiUrl = (import.meta.env && import.meta.env.VITE_CONTACT_API_URL) || '/api/contact';
      try {
        const response = await fetch(contactApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            hp_company_website: hpInput ? hpInput.value : '',
            'cf-turnstile-response': turnstileToken
          })
        });

        let result = {};
        try {
          result = await response.json();
        } catch (_) {}

        if (response.ok && (result.success === true || result.success === 'true')) {
          formStatus.className = 'form-status success';
          formStatus.textContent = t.contact.statusSuccess;
          contactForm.reset();
          if (window.turnstile) {
            try { window.turnstile.reset(); } catch (_) {}
          }
        } else {
          const errMsg = result.error || result.message || 'Error en el procesamiento del mensaje.';
          throw new Error(errMsg);
        }
      } catch (err) {
        // Fallback garantizado sin pérdida de datos
        const mailtoSubject = encodeURIComponent(`Contacto Portafolio - ${name}`);
        const mailtoBody = encodeURIComponent(`${message}\n\nDe: ${name} (${email})`);
        const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${mailtoSubject}&body=${mailtoBody}`;

        formStatus.className = 'form-status warning';
        formStatus.innerHTML = `
          <span>${t.contact.statusWarning} (${err.message ? err.message : ''}) </span>
          <a href="${mailtoUrl}" style="text-decoration: underline; color: var(--accent-primary); font-weight: 700;">
            ${t.contact.statusMailtoLink}
          </a>
        `;
        if (window.turnstile) {
          try { window.turnstile.reset(); } catch (_) {}
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>${t.contact.submitBtnText}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }
    });
  }

  // =========================================================================
  // 7. RESALTAR ENLACE DE NAVEGACIÓN ACTIVO AL HACER SCROLL
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // =========================================================================
  // 8. VENTANA INTERACTIVA ARRASTRABLE (SPEC CARD EN HERO)
  // =========================================================================
  const specCard = document.getElementById('spec-card');
  const specHeader = document.getElementById('spec-header');
  const specDotReset = document.getElementById('spec-dot-reset');

  if (specCard && specHeader) {
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let startTranslateX = 0;
    let startTranslateY = 0;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let baseLeft = 0;
    let baseTop = 0;

    function onPointerDown(e) {
      // Ignorar clics que no sean el botón principal (izquierdo) o en pantallas móviles/tablets (<= 860px)
      if (e.button !== 0 || window.innerWidth <= 860) return;

      isDragging = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      startTranslateX = currentTranslateX;
      startTranslateY = currentTranslateY;

      // Calcular posición base absoluta sin la transformación actual
      const rect = specCard.getBoundingClientRect();
      baseLeft = rect.left - currentTranslateX;
      baseTop = rect.top - currentTranslateY;

      // Capturar puntero para no perder el arrastre si se mueve rápido
      try {
        specHeader.setPointerCapture(e.pointerId);
      } catch (_) {}

      specCard.classList.add('is-dragging');
      specCard.style.transition = 'none';
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - startPointerX;
      const deltaY = e.clientY - startPointerY;

      const nextX = startTranslateX + deltaX;
      const nextY = startTranslateY + deltaY;

      // Restricciones de pantalla para que la ventana nunca se pierda fuera de vista
      const cardW = specCard.offsetWidth || 340;
      const cardH = specCard.offsetHeight || 380;

      const minX = (60 - cardW) - baseLeft;
      const maxX = (window.innerWidth - 60) - baseLeft;
      const minY = 75 - baseTop; // No tapar el navbar fijo superior

      // Límite inferior estricto: La ventana no puede bajar a "Enfoque Técnico" (#sobre-mi)
      const sobreMiSection = document.getElementById('sobre-mi');
      const heroSection = document.getElementById('hero');
      let maxYSection = Infinity;

      if (sobreMiSection) {
        const sobreMiRect = sobreMiSection.getBoundingClientRect();
        // El borde inferior de la tarjeta (baseTop + cardH + nextY) no debe entrar en Enfoque Técnico
        maxYSection = (sobreMiRect.top - 16) - baseTop - cardH;
      } else if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        maxYSection = (heroRect.bottom - 16) - baseTop - cardH;
      }

      const maxYViewport = (window.innerHeight - 50) - baseTop;
      const maxY = Math.min(maxYViewport, maxYSection);

      const clampedX = Math.max(minX, Math.min(maxX, nextX));
      const clampedY = Math.max(minY, Math.min(Math.max(minY, maxY), nextY));

      currentTranslateX = clampedX;
      currentTranslateY = clampedY;

      specCard.style.transform = `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0)`;
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;

      try {
        specHeader.releasePointerCapture(e.pointerId);
      } catch (_) {}

      specCard.classList.remove('is-dragging');
      specCard.style.transition = '';
    }

    function resetCardPosition() {
      specCard.style.transition = 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 360ms ease';
      currentTranslateX = 0;
      currentTranslateY = 0;
      specCard.style.transform = 'translate3d(0, 0, 0)';
      setTimeout(() => {
        specCard.style.transition = '';
      }, 380);
    }

    specHeader.addEventListener('pointerdown', onPointerDown);
    specHeader.addEventListener('pointermove', onPointerMove);
    specHeader.addEventListener('pointerup', onPointerUp);
    specHeader.addEventListener('pointercancel', onPointerUp);

    // Doble clic en el encabezado devuelve la ventana a su posición original
    specHeader.addEventListener('dblclick', resetCardPosition);

    // Clic en el punto rojo de control restablece la ventana con animación suave
    if (specDotReset) {
      specDotReset.addEventListener('click', (e) => {
        e.stopPropagation();
        resetCardPosition();
      });
    }

    // Reajustar límites en caso de cambio de tamaño de ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 860) {
        if (currentTranslateX !== 0 || currentTranslateY !== 0) {
          resetCardPosition();
        }
        return;
      }
      if (currentTranslateX === 0 && currentTranslateY === 0) return;
      const rect = specCard.getBoundingClientRect();
      const cardW = specCard.offsetWidth || 340;
      const cardH = specCard.offsetHeight || 380;
      baseLeft = rect.left - currentTranslateX;
      baseTop = rect.top - currentTranslateY;

      const minX = (60 - cardW) - baseLeft;
      const maxX = (window.innerWidth - 60) - baseLeft;
      const minY = 75 - baseTop;

      const sobreMiSection = document.getElementById('sobre-mi');
      const heroSection = document.getElementById('hero');
      let maxYSection = Infinity;

      if (sobreMiSection) {
        const sobreMiRect = sobreMiSection.getBoundingClientRect();
        maxYSection = (sobreMiRect.top - 16) - baseTop - cardH;
      } else if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        maxYSection = (heroRect.bottom - 16) - baseTop - cardH;
      }

      const maxYViewport = (window.innerHeight - 50) - baseTop;
      const maxY = Math.min(maxYViewport, maxYSection);

      currentTranslateX = Math.max(minX, Math.min(maxX, currentTranslateX));
      currentTranslateY = Math.max(minY, Math.min(Math.max(minY, maxY), currentTranslateY));
      specCard.style.transform = `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0)`;
    }, { passive: true });
  }
}

// Ejecutar cuando el DOM esté listo o inmediatamente si ya cargó
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
