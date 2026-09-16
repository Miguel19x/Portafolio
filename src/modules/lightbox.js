/**
 * MÓDULO LIGHTBOX PARA CAPTURAS DE PANTALLA
 * Permite previsualizar capturas a tamaño completo con accesibilidad (teclado, Escape, foco).
 */

let lightboxModal = null;
let lightboxImg = null;
let lightboxUrl = null;
let lightboxCloseBtn = null;
let lightboxBackdrop = null;
let lastFocusedPreview = null;

export function openLightbox(src, url, alt) {
  if (!lightboxModal || !lightboxImg) return;

  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Captura de pantalla de proyecto a pantalla completa';
  if (lightboxUrl) {
    lightboxUrl.textContent = url || '';
  }

  lightboxModal.classList.add('is-open');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (lightboxCloseBtn) {
    setTimeout(() => lightboxCloseBtn.focus(), 100);
  }
}

export function closeLightbox() {
  if (!lightboxModal) return;

  lightboxModal.classList.remove('is-open');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedPreview) {
    lastFocusedPreview.focus();
    lastFocusedPreview = null;
  }
}

export function initLightbox() {
  lightboxModal = document.getElementById('project-lightbox');
  lightboxImg = document.getElementById('lightbox-img');
  lightboxUrl = document.getElementById('lightbox-url');
  lightboxCloseBtn = document.getElementById('lightbox-close');
  lightboxBackdrop = document.getElementById('lightbox-backdrop');

  document.querySelectorAll('.case-study-preview-window').forEach((previewWin) => {
    function handleTrigger(e) {
      if (e.target.closest('a')) return;
      const src = previewWin.getAttribute('data-lightbox-src');
      const url = previewWin.getAttribute('data-lightbox-url');
      const alt = previewWin.getAttribute('data-lightbox-alt');
      if (src) {
        lastFocusedPreview = previewWin;
        openLightbox(src, url, alt);
      }
    }

    previewWin.addEventListener('click', handleTrigger);

    previewWin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}
