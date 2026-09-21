/**
 * MÓDULO DE CARRUSEL DE PROYECTOS (CASE STUDIES)
 * Controla el desplazamiento horizontal suave, navegación por teclado y botones,
 * soporte de gestos táctiles (swipe) y sincronización con URLs hash (#project-xxx).
 */

import { collapseAllProjects } from './projectCollapsible.js';

let currentSlideIndex = 0;
let carouselSlides = [];
let carouselTrack = null;
let carouselViewport = null;
let prevBtn = null;
let nextBtn = null;
let carouselDots = [];
let counterCurrentNum = null;
let carouselWrapper = null;

export function calculateSlideOffset(index) {
  if (!carouselTrack || !carouselViewport || carouselSlides.length === 0) return 0;
  if (index <= 0) return 0;
  const targetSlide = carouselSlides[index];
  if (!targetSlide) return 0;

  const maxScroll = Math.max(0, carouselTrack.scrollWidth - carouselViewport.clientWidth);
  return Math.min(targetSlide.offsetLeft, maxScroll);
}

export function goToSlide(index, animate = true, shouldScroll = false) {
  if (!carouselTrack || carouselSlides.length === 0) return;

  const clampedIndex = Math.max(0, Math.min(index, carouselSlides.length - 1));

  // Si cambiamos de diapositiva, contraer cualquier acordeón abierto para que la pista
  // recupere su altura compacta inmediatamente y no deje huecos verticales gigantescos.
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
      const isCollapseOpen = slide.querySelector('.case-study-tech-collapse.is-open, .case-study-collapsible.is-open, .case-study-collapsible.is-expanded');
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
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
    if (rect.top < headerHeight + 10) {
      window.scrollTo({
        top: window.pageYOffset + rect.top - headerHeight - 16,
        behavior: 'smooth'
      });
    }
  }
}

export function initCarousel() {
  carouselWrapper = document.getElementById('projects-carousel');
  carouselViewport = document.getElementById('carousel-viewport');
  carouselTrack = document.getElementById('carousel-track');
  carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
  prevBtn = document.getElementById('carousel-prev-btn');
  nextBtn = document.getElementById('carousel-next-btn');
  carouselDots = Array.from(document.querySelectorAll('.carousel-dot'));
  counterCurrentNum = document.getElementById('carousel-current-num');

  if (!carouselTrack || carouselSlides.length === 0) return;

  // Botones prev / next
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1, true, true);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < carouselSlides.length - 1) {
        goToSlide(currentSlideIndex + 1, true, true);
      }
    });
  }

  // Dots indicadores
  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide-index'), 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx, true, true);
      }
    });
  });

  // Teclado en Viewport
  if (carouselViewport) {
    carouselViewport.addEventListener('keydown', (e) => {
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
    });
  }

  // Teclado en lista de dots
  const dotsList = document.querySelector('.carousel-dots');
  if (dotsList) {
    dotsList.addEventListener('keydown', (e) => {
      const activeElement = document.activeElement;
      const currentIndex = carouselDots.indexOf(activeElement);
      if (currentIndex === -1) return;

      let nextIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % carouselDots.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + carouselDots.length) % carouselDots.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = carouselDots.length - 1;
      }

      if (nextIndex !== null) {
        const nextDot = carouselDots[nextIndex];
        nextDot.focus();
        goToSlide(nextIndex, true);
      }
    });
  }

  // Gestos Touch / Swipe
  if (carouselViewport) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalSwipe = false;
    let isGestureDecided = false;

    carouselViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isHorizontalSwipe = false;
      isGestureDecided = false;
    }, { passive: true });

    carouselViewport.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      if (!isGestureDecided) {
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
          isGestureDecided = true;
          isHorizontalSwipe = false;
          return;
        }
        if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
          isGestureDecided = true;
          isHorizontalSwipe = true;
        }
      }
    }, { passive: true });

    carouselViewport.addEventListener('touchend', (e) => {
      if (!isHorizontalSwipe) return;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      const swipeThreshold = 42;

      if (deltaX < -swipeThreshold) {
        if (currentSlideIndex < carouselSlides.length - 1) {
          goToSlide(currentSlideIndex + 1, true);
        }
      } else if (deltaX > swipeThreshold) {
        if (currentSlideIndex > 0) {
          goToSlide(currentSlideIndex - 1, true);
        }
      }

      isHorizontalSwipe = false;
      isGestureDecided = false;
    }, { passive: true });
  }

  // Redimensionamiento responsive
  let carouselResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(carouselResizeTimer);
    carouselResizeTimer = setTimeout(() => {
      goToSlide(currentSlideIndex, false);
    }, 60);
  });

  // Compatibilidad con hashes en la URL
  const projectSlideMap = {
    'project-smn': 0,
    'project-iris': 1,
    'project-psicologia': 2,
    'project-wrapped': 3,
    'project-terroso': 4
  };

  function checkHashProject() {
    const hash = window.location.hash.replace('#', '');
    if (hash && projectSlideMap[hash] !== undefined) {
      goToSlide(projectSlideMap[hash], true);
    }
  }

  goToSlide(0, false);
  checkHashProject();
  window.addEventListener('hashchange', checkHashProject);
}
