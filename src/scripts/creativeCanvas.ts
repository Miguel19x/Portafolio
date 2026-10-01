/**
 * LIENZO DE ESFERAS FLOTANTES Y RED DE CONSTELACIÓN GLOBAL (OPTIMIZADO PARA ALTO RENDIMIENTO)
 * - Renderiza partículas orbitales sutiles en el viewport global sin saturar la GPU.
 * - Pausa dinámica e inteligente durante desplazamientos (scroll) para garantizar 60-120 FPS fluidos.
 * - Búsqueda por proximidad con rechazo rápido por caja delimitadora (AABB) y sin raíces cuadradas (Math.hypot).
 * - Agrupación de trazados (batching) en una única llamada de stroke para reducir drásticamente el overhead del contexto 2D.
 * - Soporte nativo para prefers-reduced-motion y ahorro de energía con visibilitychange.
 */

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

export function initCreativeCanvas(): (() => void) | undefined {
  const canvas = document.getElementById('creative-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrameId: number;
  let isPageActive = true;
  let isScrolling = false;
  let scrollTimeout: number | undefined;

  // Paleta armónica basada en los temas de las secciones
  const colors = [
    'rgba(249, 115, 22, 0.65)',  // Naranja (Hero / Contacto)
    'rgba(245, 158, 11, 0.65)',  // Ámbar (Sobre Mí)
    'rgba(6, 182, 212, 0.65)',   // Cian (Proyectos)
    'rgba(16, 185, 129, 0.65)',  // Esmeralda (Habilidades)
    'rgba(168, 85, 247, 0.60)',  // Púrpura (Trayectoria)
    'rgba(148, 163, 184, 0.45)', // Slate neutro estelar
  ];

  function resize() {
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx?.scale(dpr, dpr);
  }

  resize();

  // Respetar preferencia de reducción de movimiento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Detección de dispositivos de bajos recursos (low-end laptops / tablets / móviles)
  const isLowEndDevice =
    (typeof navigator !== 'undefined' && (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4)
    )) || false;

  // Cantidad de partículas balanceada para máxima fluidez sin saturar GPU
  const isMobile = window.innerWidth < 768;
  const particleCount = isLowEndDevice ? 10 : (isMobile ? 14 : 26);
  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (width || 1200),
      y: Math.random() * (height || 800),
      radius: Math.random() * 1.5 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: colors[i % colors.length],
    });
  }

  // Detección de scroll: pausa temporalmente el canvas durante el desplazamiento del usuario
  // para liberar el 100% de la GPU a la composición y filtros de la página
  const onScroll = () => {
    isScrolling = true;
    if (scrollTimeout) window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      isScrolling = false;
    }, 120);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const onResize = () => {
    resize();
  };
  window.addEventListener('resize', onResize, { passive: true });

  // Pausar animación si la pestaña está oculta
  const onVisibilityChange = () => {
    isPageActive = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const maxDist = isMobile ? 80 : 95;
  const maxDistSq = maxDist * maxDist;

  function renderFrame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // 1. Dibujar partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      else if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      else if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    // 2. Dibujar conexiones de constelación en un único lote (Single Batch Stroke)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.6;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;

        // Rechazo rápido por caja delimitadora (AABB)
        if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();
  }

  // Control de FPS: 30 FPS en móviles o laptops de gama modesta (<= 4 núcleos) para liberar la GPU
  let lastTime = 0;
  const frameInterval = (isMobile || isLowEndDevice) ? 1000 / 30 : 1000 / 60;

  function animate(currentTime: number) {
    animationFrameId = requestAnimationFrame(animate);
    if (!isPageActive || isScrolling) return;

    const elapsed = currentTime - lastTime;
    if (elapsed < frameInterval) return;

    lastTime = currentTime - (elapsed % frameInterval);
    renderFrame();
  }

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (scrollTimeout) window.clearTimeout(scrollTimeout);
    cancelAnimationFrame(animationFrameId);
  };
}
