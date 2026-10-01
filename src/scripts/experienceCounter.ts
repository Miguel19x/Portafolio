/**
 * MÓDULO DE CONTADORES NUMÉRICOS (TRAYECTORIA PROFESIONAL)
 * - Anima los números de las métricas con un efecto odómetro/count-up fluido y progresivo.
 * - Se activa automáticamente al hacer scroll hacia la sección (#trayectoria) o al recargar la página.
 * - Funciona SIEMPRE, incluso si las animaciones de Windows están desactivadas.
 * - Soporta formato con prefijos (+), sufijos (%) y separadores de miles (,).
 */

interface ParsedMetric {
  prefix: string;
  target: number;
  suffix: string;
  hasCommas: boolean;
  decimals: number;
  raw: string;
  isKMetric: boolean;
}

function parseMetricValue(raw: string): ParsedMetric {
  const trimmed = raw.trim();
  const isKMetric = trimmed.toLowerCase() === '+1k' || trimmed.toLowerCase() === '1k';

  const match = trimmed.match(/^([^0-9.]*)([0-9,]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { prefix: '', target: 0, suffix: '', hasCommas: false, decimals: 0, raw, isKMetric };
  }

  const prefix = match[1] || '';
  const numPart = match[2] || '0';
  const suffix = match[3] || '';
  const hasCommas = numPart.includes(',');
  const cleanNumStr = numPart.replace(/,/g, '');
  const decimalMatch = cleanNumStr.split('.')[1];
  const decimals = decimalMatch ? decimalMatch.length : 0;
  const target = parseFloat(cleanNumStr) || 0;

  return { prefix, target, suffix, hasCommas, decimals, raw, isKMetric };
}

function formatValue(current: number, parsed: ParsedMetric): string {
  const rounded = parsed.decimals > 0
    ? current.toFixed(parsed.decimals)
    : Math.round(current).toString();

  let formattedNumber = rounded;
  if (parsed.hasCommas) {
    const parts = rounded.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNumber = parts.join('.');
  }

  return `${parsed.prefix}${formattedNumber}${parsed.suffix}`;
}

// Curva de aceleración cúbica para transición natural y desaceleración elegante
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function initExperienceCounter(): (() => void) | undefined {
  const container = document.getElementById('trayectoria');
  if (!container) return;

  const targetCard = container.querySelector<HTMLElement>('.experience-card') || container;
  const counterElements = Array.from(
    container.querySelectorAll<HTMLElement>('.experience-metric-number')
  );
  if (counterElements.length === 0) return;

  function getMetricTarget(el: HTMLElement): string {
    const isMobile = window.innerWidth < 640;
    const mobileVal = el.getAttribute('data-metric-target-mobile');
    if (isMobile && mobileVal) {
      return mobileVal;
    }
    return el.getAttribute('data-metric-target') || el.textContent || '';
  }

  let isAnimating = false;
  let hasAnimatedInCurrentView = false;
  let activeRafIds: number[] = [];

  function stopAllAnimations() {
    activeRafIds.forEach((id) => cancelAnimationFrame(id));
    activeRafIds = [];
    isAnimating = false;
  }

  function startCountUp() {
    if (isAnimating || hasAnimatedInCurrentView) return;
    hasAnimatedInCurrentView = true;
    isAnimating = true;

    stopAllAnimations();

    const duration = 1400; // ms de animación
    const staggerDelay = 120; // ms entre cada métrica

    const activeMetrics = counterElements.map((el) => {
      const rawVal = getMetricTarget(el);
      return {
        el,
        parsed: parseMetricValue(rawVal),
      };
    });

    activeMetrics.forEach(({ el, parsed }, index) => {
      // Estado visual inicial en 0 manteniendo prefijo (+0) y sufijo (0%)
      el.textContent = parsed.isKMetric ? `${parsed.prefix}0` : formatValue(0, parsed);
      el.classList.remove('is-counted');
      el.classList.add('is-counting');

      const startTime = performance.now() + index * staggerDelay;

      function updateFrame(now: number) {
        if (now < startTime) {
          const rafId = requestAnimationFrame(updateFrame);
          activeRafIds[index] = rafId;
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easedProgress = easeOutCubic(progress);

        if (parsed.isKMetric) {
          // En móvil para +1k: anima fluidamente de 0 a 999 durante el primer 88% del tiempo, y luego salta rápido a +1k
          if (progress < 0.88) {
            const subProgress = progress / 0.88;
            const subEased = easeOutCubic(subProgress);
            const countVal = Math.min(999, Math.round(999 * subEased));
            el.textContent = `${parsed.prefix}${countVal}`;
          } else {
            el.textContent = parsed.raw;
          }
        } else {
          const currentValue = parsed.target * easedProgress;
          el.textContent = formatValue(currentValue, parsed);
        }

        if (progress < 1) {
          const rafId = requestAnimationFrame(updateFrame);
          activeRafIds[index] = rafId;
        } else {
          // Asegurar valor exacto final
          el.textContent = parsed.raw;
          el.classList.remove('is-counting');
          el.classList.add('is-counted');

          if (index === activeMetrics.length - 1) {
            isAnimating = false;
          }
        }
      }

      const rafId = requestAnimationFrame(updateFrame);
      activeRafIds[index] = rafId;
    });
  }

  function checkVisibilityAndTrigger() {
    const rect = targetCard.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.88 && rect.bottom > 80;

    if (inView) {
      if (!hasAnimatedInCurrentView) {
        startCountUp();
      }
    } else {
      // Al salir de pantalla (arriba o abajo), permitir re-animar al volver a bajar
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        hasAnimatedInCurrentView = false;
        stopAllAnimations();
      }
    }
  }

  // 1. IntersectionObserver para activar al bajar
  let observer: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCountUp();
          } else {
            hasAnimatedInCurrentView = false;
            stopAllAnimations();
          }
        });
      },
      {
        threshold: [0.08, 0.25],
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(targetCard);
  }

  // 2. Listener de scroll pasivo como respaldo únicamente si no existe IntersectionObserver
  let scrollRafId: number | null = null;
  const handleScroll = () => {
    if (scrollRafId !== null) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      checkVisibilityAndTrigger();
    });
  };

  if (!observer) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // 3. Activación garantizada: Si existe IntersectionObserver, este se encarga sin forzar reflows.
  // Solo medimos rect si no hay soporte de IntersectionObserver.
  if (!observer) {
    requestAnimationFrame(() => {
      checkVisibilityAndTrigger();
    });
  }

  // Cleanup
  return () => {
    if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
    if (!observer) {
      window.removeEventListener('scroll', handleScroll);
    }
    stopAllAnimations();
    if (observer) {
      observer.disconnect();
    }
  };
}
