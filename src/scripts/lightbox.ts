/**
 * MÓDULO LIGHTBOX PARA CAPTURAS DE PANTALLA
 * Permite previsualizar capturas a tamaño completo con accesibilidad (teclado, Escape, foco),
 * asegurando ajuste visual óptimo sin ningún tipo de overflow o desbordamiento en pantalla.
 */

let lightboxModal: HTMLElement | null = null;
let lightboxImg: HTMLImageElement | null = null;
let lightboxUrl: HTMLElement | null = null;
let lightboxCloseBtn: HTMLButtonElement | null = null;
let lightboxBackdrop: HTMLElement | null = null;
let lastFocusedPreview: HTMLElement | null = null;

let hoverPopup: HTMLElement | null = null;
let hoverPopupImg: HTMLImageElement | null = null;
let hoverPopupUrl: HTMLElement | null = null;

function isDesktopHover(): boolean {
  return window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
}

export function hideHoverPopup(): void {
  if (!hoverPopup || !hoverPopup.classList.contains('is-visible')) return;
  hoverPopup.classList.remove('is-visible');
  hoverPopup.setAttribute('aria-hidden', 'true');
  hoverPopup.setAttribute('inert', '');
}

export function showHoverPopup(previewEl: HTMLElement, src: string, url?: string | null, alt?: string | null): void {
  if (!hoverPopup || !hoverPopupImg || !isDesktopHover()) return;
  if (lightboxModal && lightboxModal.classList.contains('is-open')) return;

  hoverPopupImg.src = src;
  hoverPopupImg.alt = alt || 'Vista previa ampliada';
  if (hoverPopupUrl) {
    hoverPopupUrl.textContent = url || '';
  }

  const rect = previewEl.getBoundingClientRect();
  const margin = 16;
  const maxW = Math.max(300, window.innerWidth - margin * 2);
  const maxH = Math.max(220, window.innerHeight - margin * 2);
  const popupWidth = Math.min(680, maxW);
  const popupHeight = Math.min(460, maxH);

  let left = rect.right + margin;
  let top = rect.top + (rect.height / 2) - (popupHeight / 2);

  // Si a la derecha sobrepasa el borde del viewport, evaluar posicionarlo a la izquierda o centrado
  if (left + popupWidth > window.innerWidth - margin) {
    if (rect.left - popupWidth - margin >= margin) {
      left = rect.left - popupWidth - margin;
    } else {
      left = Math.max(margin, (window.innerWidth - popupWidth) / 2);
      top = Math.max(margin, (window.innerHeight - popupHeight) / 2);
    }
  }

  // Clamping seguro dentro de los límites visibles de la ventana
  left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
  top = Math.max(margin, Math.min(top, window.innerHeight - popupHeight - margin));

  hoverPopup.style.left = `${Math.round(left)}px`;
  hoverPopup.style.top = `${Math.round(top)}px`;
  hoverPopup.style.width = `${Math.round(popupWidth)}px`;
  hoverPopup.style.height = `${Math.round(popupHeight)}px`;

  hoverPopup.removeAttribute('inert');
  hoverPopup.classList.add('is-visible');
  hoverPopup.setAttribute('aria-hidden', 'false');
}

export function openLightbox(src: string, url?: string | null, alt?: string | null): void {
  hideHoverPopup();
  if (!lightboxModal || !lightboxImg) return;

  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Captura de pantalla de proyecto a pantalla completa';
  if (lightboxUrl) {
    lightboxUrl.textContent = url || '';
  }

  lightboxModal.removeAttribute('inert');
  lightboxModal.classList.add('is-open');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (lightboxCloseBtn) {
    requestAnimationFrame(() => {
      lightboxCloseBtn?.focus();
    });
  }
}

export function closeLightbox(): void {
  if (!lightboxModal) return;

  // 1. Desenfocar de inmediato cualquier elemento dentro del modal ANTES de ocultarlo
  const returnTarget = lastFocusedPreview;
  lastFocusedPreview = null;

  if (document.activeElement && lightboxModal.contains(document.activeElement)) {
    (document.activeElement as HTMLElement).blur();
  }

  // 2. Restaurar el foco al elemento que abrió la vista previa si existe y es enfocable
  if (returnTarget && typeof returnTarget.focus === 'function') {
    if (!returnTarget.hasAttribute('tabindex') && returnTarget.tagName === 'DIV') {
      returnTarget.setAttribute('tabindex', '-1');
    }
    returnTarget.focus();
  }

  // 3. Una vez garantizado que ningún descendiente retiene foco, ocultar y aislar
  lightboxModal.classList.remove('is-open');
  lightboxModal.setAttribute('aria-hidden', 'true');
  lightboxModal.setAttribute('inert', '');
  document.body.style.overflow = '';
}

export function initLightbox(): void {
  lightboxModal = document.getElementById('project-lightbox');
  lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  lightboxUrl = document.getElementById('lightbox-url');
  lightboxCloseBtn = document.getElementById('lightbox-close') as HTMLButtonElement | null;
  lightboxBackdrop = document.getElementById('lightbox-backdrop');

  hoverPopup = document.getElementById('image-hover-popup');
  hoverPopupImg = document.getElementById('hover-popup-img') as HTMLImageElement | null;
  hoverPopupUrl = document.getElementById('hover-popup-url');

  document.querySelectorAll<HTMLElement>('.case-study-preview-window').forEach((previewWin) => {
    function handleTrigger(e: Event) {
      if ((e.target as HTMLElement).closest('a')) return;
      const src = previewWin.getAttribute('data-lightbox-src');
      const url = previewWin.getAttribute('data-lightbox-url');
      const alt = previewWin.getAttribute('data-lightbox-alt');
      if (src) {
        lastFocusedPreview = (e.target as HTMLElement).closest<HTMLElement>('button, [role="button"], [tabindex="0"]') || previewWin;
        openLightbox(src, url, alt);
      }
    }

    previewWin.addEventListener('click', handleTrigger);

    previewWin.addEventListener('mouseenter', (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a')) {
        hideHoverPopup();
        return;
      }
      const src = previewWin.getAttribute('data-lightbox-src');
      const url = previewWin.getAttribute('data-lightbox-url');
      const alt = previewWin.getAttribute('data-lightbox-alt');
      if (src) {
        showHoverPopup(previewWin, src, url, alt);
      }
    });

    previewWin.addEventListener('mouseleave', () => {
      hideHoverPopup();
    });

    previewWin.addEventListener('mousemove', (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a')) {
        hideHoverPopup();
      } else if (hoverPopup && !hoverPopup.classList.contains('is-visible')) {
        const src = previewWin.getAttribute('data-lightbox-src');
        const url = previewWin.getAttribute('data-lightbox-url');
        const alt = previewWin.getAttribute('data-lightbox-alt');
        if (src) {
          showHoverPopup(previewWin, src, url, alt);
        }
      }
    });

    previewWin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });

  window.addEventListener('scroll', hideHoverPopup, { passive: true });
  window.addEventListener('resize', hideHoverPopup, { passive: true });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(
        lightboxModal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
}
