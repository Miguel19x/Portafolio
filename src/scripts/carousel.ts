/**
 * MÓDULO DE CARRUSEL DE PROYECTOS (CASE STUDIES) EN TYPESCRIPT
 * Réplica exacta del carrusel de Miguel Angel Aranguren:
 * Desplazamiento horizontal fluido, navegación por teclado, controles con dots animados,
 * contador 01/05, soporte de swipe táctil, colapso coordinado de acordeones y sincronización con hashes en la URL.
 */

import { collapseAllProjects } from './collapsible';

let currentSlideIndex = 0;
let carouselSlides: HTMLElement[] = [];
let carouselTrack: HTMLElement | null = null;
let carouselViewport: HTMLElement | null = null;
let prevBtn: HTMLButtonElement | null = null;
let nextBtn: HTMLButtonElement | null = null;
let carouselDots: HTMLButtonElement[] = [];
let counterCurrentNum: HTMLElement | null = null;
let carouselWrapper: HTMLElement | null = null;

export function calculateSlideOffset(index: number): number {
  if (!carouselTrack || !carouselViewport || carouselSlides.length === 0) return 0;
  if (index <= 0) return 0;
  const targetSlide = carouselSlides[index];
  if (!targetSlide) return 0;

  const viewportWidth = carouselViewport.clientWidth;
  const lastSlide = carouselSlides[carouselSlides.length - 1];

  // Margen derecho de seguridad para que el borde derecho de la tarjeta,
  // sus esquinas redondeadas y su sombra no se corten contra el viewport
  const rightMargin = 16;

  const lastSlideRight = lastSlide 
    ? (lastSlide.offsetLeft + lastSlide.offsetWidth) 
    : carouselTrack.scrollWidth;
  const totalTrackExtent = Math.max(lastSlideRight, carouselTrack.scrollWidth);

  const maxScroll = Math.max(0, totalTrackExtent + rightMargin - viewportWidth);

  if (index === carouselSlides.length - 1) {
    return maxScroll;
  }

  return Math.min(targetSlide.offsetLeft, maxScroll);
}

export function goToSlide(index: number, animate = true, shouldScroll = false): void {
  if (!carouselTrack || carouselSlides.length === 0) return;

  const clampedIndex = Math.max(0, Math.min(index, carouselSlides.length - 1));

  // Al cambiar de diapositiva, contraer cualquier acordeón abierto para que la pista
  // recupere su altura compacta inmediatamente y no deje huecos verticales
  if (clampedIndex !== currentSlideIndex) {
    collapseAllProjects();
  }

  currentSlideIndex = clampedIndex;

  const offset = calculateSlideOffset(currentSlideIndex);

  carouselTrack.style.transition = animate ? 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
  carouselTrack.style.transform = `translate3d(-${offset}px, 0, 0)`;

  // Actualizar clases activas y accesibilidad
  carouselSlides.forEach((slide, i) => {
    const isActive = i === currentSlideIndex;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', (!isActive).toString());

    if (isActive) {
      const isCollapseOpen = slide.querySelector('.case-study-tech-collapse.is-open, .case-study-collapsible.is-open');
      if (isCollapseOpen) {
        const flowDiagram = slide.querySelector('.diagram-flow');
        if (flowDiagram && !flowDiagram.classList.contains('is-revealed')) {
          setTimeout(() => {
            flowDiagram.classList.add('is-revealed');
          }, 100);
        }
      }
    }
  });

  if (prevBtn) {
    prevBtn.disabled = currentSlideIndex === 0;
    prevBtn.setAttribute('aria-disabled', (currentSlideIndex === 0).toString());
  }
  if (nextBtn) {
    nextBtn.disabled = currentSlideIndex === carouselSlides.length - 1;
    nextBtn.setAttribute('aria-disabled', (currentSlideIndex === carouselSlides.length - 1).toString());
  }

  carouselDots.forEach((dot, i) => {
    const isActive = i === currentSlideIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive.toString());
    dot.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  if (counterCurrentNum) {
    counterCurrentNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
  }

  if (shouldScroll && carouselWrapper) {
    const rect = carouselWrapper.getBoundingClientRect();
    if (rect.top < 85) {
      window.scrollTo({
        top: window.pageYOffset + rect.top - 85,
        behavior: 'smooth'
      });
    }
  }
}

export function initCarousel(): (() => void) | undefined {
  carouselWrapper = document.getElementById('projects-carousel');
  carouselViewport = document.getElementById('carousel-viewport');
  carouselTrack = document.getElementById('carousel-track');
  carouselSlides = Array.from(document.querySelectorAll<HTMLElement>('.carousel-slide'));
  prevBtn = document.getElementById('carousel-prev-btn') as HTMLButtonElement | null;
  nextBtn = document.getElementById('carousel-next-btn') as HTMLButtonElement | null;
  carouselDots = Array.from(document.querySelectorAll<HTMLButtonElement>('.carousel-dot'));
  counterCurrentNum = document.getElementById('carousel-current-num');

  if (!carouselTrack || carouselSlides.length === 0) return;

  // Botones prev / next
  const onPrevClick = () => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1, true, true);
    }
  };

  const onNextClick = () => {
    if (currentSlideIndex < carouselSlides.length - 1) {
      goToSlide(currentSlideIndex + 1, true, true);
    }
  };

  prevBtn?.addEventListener('click', onPrevClick);
  nextBtn?.addEventListener('click', onNextClick);

  // Dots indicadores
  const dotClickHandlers: Array<() => void> = [];
  carouselDots.forEach((dot) => {
    const handler = () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide-index') || '0', 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx, true, true);
      }
    };
    dotClickHandlers.push(handler);
    dot.addEventListener('click', handler);
  });

  // Teclado en Viewport
  const onViewportKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentSlideIndex < carouselSlides.length - 1) {
        goToSlide(currentSlideIndex + 1, true);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1, true);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(carouselSlides.length - 1, true);
    }
  };
  carouselViewport?.addEventListener('keydown', onViewportKeyDown);

  // Gestos Touch / Swipe
  let touchStartX = 0;
  let touchStartY = 0;
  let isHorizontalSwipe = false;
  let isGestureDecided = false;

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isHorizontalSwipe = false;
    isGestureDecided = false;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;

    if (!isGestureDecided) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        isHorizontalSwipe = false;
        isGestureDecided = true;
        return;
      }
      if (Math.abs(deltaX) > 8) {
        isHorizontalSwipe = true;
        isGestureDecided = true;
      }
    }

    if (isHorizontalSwipe && Math.abs(deltaX) > 10) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isHorizontalSwipe) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 42;

    if (deltaX < -swipeThreshold && currentSlideIndex < carouselSlides.length - 1) {
      goToSlide(currentSlideIndex + 1, true, false);
    } else if (deltaX > swipeThreshold && currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1, true, false);
    }
  };

  carouselViewport?.addEventListener('touchstart', onTouchStart, { passive: true });
  carouselViewport?.addEventListener('touchmove', onTouchMove, { passive: false });
  carouselViewport?.addEventListener('touchend', onTouchEnd, { passive: true });

  // Sincronización con Hash en la URL
  const handleHashChange = () => {
    const hash = window.location.hash;
    if (!hash) return;
    const slideIdx = carouselSlides.findIndex((slide) => slide.id === hash.replace('#', ''));
    if (slideIdx !== -1 && slideIdx !== currentSlideIndex) {
      goToSlide(slideIdx, true, true);
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  if (window.location.hash) {
    handleHashChange();
  }

  // Redimensionamiento con debounce
  let resizeTimeout: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      goToSlide(currentSlideIndex, false, false);
    }, 120);
  };
  window.addEventListener('resize', onResize);

  // Inicializar estado de controles
  goToSlide(currentSlideIndex, false, false);

  // Cleanup handler
  return () => {
    prevBtn?.removeEventListener('click', onPrevClick);
    nextBtn?.removeEventListener('click', onNextClick);
    carouselViewport?.removeEventListener('keydown', onViewportKeyDown);
    carouselViewport?.removeEventListener('touchstart', onTouchStart);
    carouselViewport?.removeEventListener('touchmove', onTouchMove);
    carouselViewport?.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('hashchange', handleHashChange);
    window.removeEventListener('resize', onResize);
  };
}
