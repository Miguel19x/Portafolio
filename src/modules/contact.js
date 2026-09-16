/**
 * MÓDULO DE CONTACTO Y FORMULARIO
 * Gestiona el copiado rápido de correo con toast localizado,
 * la inserción anti-scraping y la validación y envío del formulario de contacto.
 */

import { getCurrentLang, getTranslation } from './i18n.js';
import { translations } from '../i18n.js';

export const EMAIL_ADDRESS = 'miguelaranguren19x@outlook.com';

let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

export function initContact() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  // Inserción dinámica del correo en el DOM (protección básica anti-scraping)
  const contactEmailVal = document.getElementById('contact-email-val');
  const contactMailtoLink = document.getElementById('contact-mailto-link');

  if (contactEmailVal) {
    contactEmailVal.textContent = EMAIL_ADDRESS;
  }

  if (contactMailtoLink) {
    const defaultSubject = encodeURIComponent('Oportunidad Fullstack - Miguel Aranguren');
    contactMailtoLink.setAttribute('href', `mailto:${EMAIL_ADDRESS}?subject=${defaultSubject}`);
  }

  // Copiado Rápido de Email con Toast
  if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener('click', async () => {
      const currentLang = getCurrentLang();
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

  // Envío Funcional del Formulario con i18n
  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const currentLang = getCurrentLang();
      const t = translations[currentLang] || translations.es;

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const botFieldInput = document.getElementById('contact-bot-field');

      // 1. Protección Honeypot
      if (botFieldInput && botFieldInput.value.trim() !== '') {
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

      // Estado enviando
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block; animation: pulse-ring 1s infinite;">●</span>
        <span>${t.contact.sendingBtnText}</span>
      `;
      formStatus.className = 'form-status info';
      formStatus.textContent = t.contact.statusProcessing;

      try {
        const formData = new FormData(contactForm);
        formData.set('form-name', 'contact');

        const isLocalhost = Boolean(
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.endsWith('.local')
        );

        if (isLocalhost) {
          // En desarrollo local simular éxito
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          // Envío nativo a Netlify Forms mediante POST URL-encoded
          const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
          });

          if (!response.ok) {
            throw new Error(`Error en servidor (${response.status})`);
          }
        }

        formStatus.className = 'form-status success';
        formStatus.textContent = t.contact.statusSuccess;
        contactForm.reset();
      } catch (err) {
        // Fallback garantizado sin pérdida de datos (Mailto)
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
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>${t.contact.submitBtnText}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }
    });
  }
}
