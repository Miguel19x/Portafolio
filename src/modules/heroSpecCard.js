/**
 * MÓDULO HERO SPEC CARD
 * Controla la ventana arrastrable de especificaciones técnicas (Hero Spec Card)
 * y la animación en cascada (stagger) para los badges de Core Stack.
 */

export function initHeroSpecCard() {
  // 1. Animación en cascada para badges de Core Stack
  const specTags = document.querySelector('.spec-tags');
  if (specTags) {
    const specObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          specTags.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    specObserver.observe(specTags);
  }

  // 2. Ventana interactiva arrastrable (Spec Card)
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
      if (e.button !== 0 || window.innerWidth <= 860) return;

      isDragging = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      startTranslateX = currentTranslateX;
      startTranslateY = currentTranslateY;

      const rect = specCard.getBoundingClientRect();
      baseLeft = rect.left - currentTranslateX;
      baseTop = rect.top - currentTranslateY;

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

      const cardW = specCard.offsetWidth || 340;
      const cardH = specCard.offsetHeight || 380;

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

    specHeader.addEventListener('dblclick', resetCardPosition);

    if (specDotReset) {
      specDotReset.addEventListener('click', (e) => {
        e.stopPropagation();
        resetCardPosition();
      });
    }

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
