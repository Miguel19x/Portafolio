import type { ProjectItem } from '../types';

export const ALL_PROJECTS: ProjectItem[] = [
  // --------------------------------------------------------------------------
  // 1. FRONTEND
  // --------------------------------------------------------------------------
  {
    id: 'terroso',
    badge: 'PROYECTO CONCEPTUAL · ASTRO 5 · TAILWIND V4 · WCAG 2.2 AA',
    title: 'Terroso Café — Landing Accesible & Escalable',
    summary: 'Landing page de alto rendimiento y accesibilidad universal (WCAG 2.2 AA) para cafetería de especialidad, adaptable desde móvil hasta pantallas 4K.',
    impactPhrase: 'Diseñé y construí una landing de cafetería que carga al instante, se ve proporcionada en cualquier pantalla (del teléfono al monitor 4K) y se puede usar completa solo con teclado.',
    problemText: 'Las páginas gastronómicas convencionales sufren de lentitud, se rompen en pantallas ultrawide/4K y excluyen a usuarios con navegación por teclado.',
    solutionHtml: 'Arquitectura estática ultra-ligera con <strong>escalado tipográfico proporcional por clamp()</strong>, cero dependencias pesadas y reservas por <strong>WhatsApp sin backend</strong>.',
    solutionText: 'Arquitectura estática ultra-ligera con escalado tipográfico proporcional por clamp(), cero dependencias pesadas y reservas por WhatsApp sin backend.',
    impactText: '<strong>Puntaje 100 en Performance</strong>, navegación completa sin ratón (WCAG 2.2 AA) y layout verificado en más de 8 densidades de pantalla.',
    url: 'https://terrosocafe.netlify.app/',
    statusBadge: 'PRODUCTION LIVE',
    tags: [
      'Astro',
      'TypeScript',
      'Tailwind CSS',
      'Vanilla JS',
      'Accesibilidad WCAG 2.2 AA',
      'SEO Técnico (Schema.org)',
      'Diseño Responsivo (móvil a 4K)',
      'Reservas vía WhatsApp',
      'Despliegue en Producción'
    ],
    image: '/projects/terroso-preview.png',
    imageWebp: '/projects/terroso-preview.webp',
    imageAvif: '/projects/terroso-preview.avif',
    repoUrl: 'https://github.com/Miguel19x/Terroso_Cafe-Restaurante',
    demoUrl: 'https://terrosocafe.netlify.app/',
    themeColor: 'amber',
    diagram: {
      header: 'Pipeline de Arquitectura & Escalado (Terroso)',
      sub: 'PIPELINE ESTÁTICO · ASTRO + TAILWIND V4 + TS',
      steps: [
        { num: 'DISEÑO', label: 'Tokens & Identidad Visual', tech: 'Tailwind v4 (@theme)' },
        { num: 'ARQUITECTURA', label: 'Componentes Estáticos', tech: 'Astro 5 (SSG)' },
        { num: 'INTERACCIÓN', label: 'Accesibilidad & Animaciones', tech: 'TypeScript + WAI-ARIA' },
        { num: 'PRODUCCIÓN', label: 'Escalado & Despliegue', tech: 'clamp() root + Netlify' }
      ]
    },
    footerLinks: [
      { label: 'terrosocafe.netlify.app ↗', url: 'https://terrosocafe.netlify.app/' },
      { label: 'github.com/Miguel19x/Terroso_Cafe-Restaurante ↗', url: 'https://github.com/Miguel19x/Terroso_Cafe-Restaurante' }
    ]
  },
  {
    id: 'psicologia',
    badge: 'PROYECTO POR ENCARGO · LANDING PARA TESIS DE BACHILLERATO',
    title: 'Psicología CSL — Plataforma de Salud Mental',
    summary: 'Plataforma web de concientización y primeros auxilios psicológicos para estudiantes, optimizada para carga móvil instantánea.',
    impactPhrase: 'Transformé una investigación de tesis en una plataforma web interactiva y accesible, facilitando la concientización en salud mental para cientos de estudiantes.',
    problemText: 'Una investigación valiosa de tesis sobre salud mental adolescente carecía de un canal digital accesible para conectar a jóvenes con recursos de apoyo.',
    solutionHtml: 'Diseñé una <strong>arquitectura por componentes modulares</strong> centrada en accesibilidad móvil, con directorios interactivos de emergencia y carga ultrarrápida sin fricción.',
    solutionText: 'Diseñé una arquitectura por componentes modulares centrada en accesibilidad móvil, con directorios interactivos de emergencia y carga ultrarrápida sin fricción.',
    impactText: '<strong>100% responsive y funcional</strong> en el lanzamiento escolar, facilitando acceso directo y seguro a canales de asistencia profesional para cientos de estudiantes.',
    url: 'https://pgpsicologia.netlify.app/',
    statusBadge: 'PRODUCTION LIVE',
    tags: [
      'React',
      'JavaScript (ES6+/JSX)',
      'Tailwind CSS',
      'Vite',
      'PostCSS',
      'Arquitectura de Componentes',
      'Diseño Responsivo',
      'Despliegue en Producción'
    ],
    image: '/projects/psicologia-preview.png',
    imageWebp: '/projects/psicologia-preview.webp',
    imageAvif: '/projects/psicologia-preview.avif',
    repoUrl: 'https://github.com/Miguel19x/web-psicologia-tesis-santiago',
    demoUrl: 'https://pgpsicologia.netlify.app/',
    themeColor: 'purple',
    diagram: {
      header: 'Pipeline de Arquitectura & Despliegue (Psicología CSL)',
      sub: 'PIPELINE JAMSTACK · REACT + VITE + TAILWIND',
      steps: [
        { num: 'INVESTIGACIÓN', label: 'Investigación & Datos', tech: 'Tesis Estudiantil (Docs & Cifras)' },
        { num: 'ARQUITECTURA', label: 'Componentes Modulares', tech: 'React (Navbar, Hero, Helps, Footer)' },
        { num: 'BUILD', label: 'Estilos & Optimización', tech: 'Tailwind CSS + Vite HMR' },
        { num: 'PRODUCCIÓN', label: 'Despliegue Global', tech: 'Netlify Edge Hosting' }
      ]
    },
    footerLinks: [
      { label: 'pgpsicologia.netlify.app ↗', url: 'https://pgpsicologia.netlify.app/' },
      { label: 'github.com/Miguel19x/web-psicologia-tesis-santiago ↗', url: 'https://github.com/Miguel19x/web-psicologia-tesis-santiago' }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. BACKEND
  // --------------------------------------------------------------------------
  {
    id: 'iris',
    badge: 'TYPESCRIPT · PYTHON · DOCKER · PIPELINE MULTI-VENDOR & PRICING',
    title: 'IrisClassifier — Normalización & Pricing ETL',
    summary: 'Pipeline ETL y motor de pricing que unifica catálogos desestructurados en PDF y Excel para calcular márgenes comerciales en tiempo real.',
    impactPhrase: 'Normaliza listas de precios caóticas de proveedores en PDF y Excel a un catálogo unificado al instante, blindando los márgenes comerciales sin errores humanos.',
    problemText: 'Conciliar manualmente listas de precios desactualizadas de múltiples distribuidores provocaba errores de cotización, demoras de días y fugas de margen comercial.',
    solutionHtml: 'Diseñé un <strong>pipeline ETL automatizado</strong> que extrae y valida referencias cruzadas no homogéneas, aplicando <strong>reglas dinámicas de margen comercial</strong> con cobertura de tests continuos.',
    solutionText: 'Diseñé un pipeline ETL automatizado que extrae y valida referencias cruzadas no homogéneas, aplicando reglas dinámicas de margen comercial con cobertura de tests continuos.',
    impactText: '<strong>Reducción de horas a segundos</strong> en emisión de cotizaciones y <strong>eliminación total</strong> de errores humanos en la conciliación de piezas y precios.',
    url: 'https://iris-classifier-omega.vercel.app/',
    statusBadge: 'ETL & PRICING ENGINE',
    tags: [
      'TypeScript',
      'Python',
      'React',
      'Docker & Compose',
      'CI/CD (GitHub Actions)',
      'Desarrollo Web & Móvil',
      'Data Parsing (PDF / Excel)',
      'PyTest & Pruebas Unitarias',
      'Motor de Márgenes'
    ],
    image: '/projects/iris-preview.png',
    imageWebp: '/projects/iris-preview.webp',
    imageAvif: '/projects/iris-preview.avif',
    repoUrl: 'https://github.com/Miguel19x/IrisClassifier',
    demoUrl: 'https://iris-classifier-omega.vercel.app/',
    themeColor: 'amber',
    diagram: {
      header: 'Pipeline de Normalización & Pricing (IrisClassifier)',
      sub: 'PIPELINE FULLSTACK · DOCKER + ETL',
      steps: [
        { num: 'FUENTES', label: 'PDFs & Excel Heterogéneos', tech: 'Múltiples Distribuidores' },
        { num: 'PARSING', label: 'Extracción & ETL', tech: 'Python ETL Pipeline' },
        { num: 'PRICING', label: 'Reglas & Márgenes', tech: 'Motor de Cotización (PyTest)' },
        { num: 'DELIVERY', label: 'Catálogo Unificado', tech: 'TypeScript + React (Docker)' }
      ]
    },
    footerLinks: [
      { label: 'iris-classifier.vercel.app ↗', url: 'https://iris-classifier-omega.vercel.app/' },
      { label: 'github.com/Miguel19x/IrisClassifier ↗', url: 'https://github.com/Miguel19x/IrisClassifier' }
    ]
  },
  {
    id: 'smn',
    badge: 'ASTRO · TYPESCRIPT · CLOUDFLARE WORKERS & ANÁLISIS ESTADÍSTICO',
    title: 'SMN — Informes Estadísticos Automáticos',
    summary: 'Motor de automatización que transforma datos crudos en reportes estadísticos listos para entrega con gráficos interactivos y conclusiones formales.',
    impactPhrase: 'Genera informes estadísticos automatizados con redacción formal APA y gráficos interactivos en segundos, eliminando horas de transcripción manual y errores de cálculo.',
    problemText: 'Generar informes estadísticos a mano tomaba horas de transcripción, provocaba discrepancias matemáticas entre tablas y textos, y acumulaba fallas en el formato formal APA.',
    solutionHtml: 'Construí un <strong>motor sintáctico automatizado con cómputo en el borde (Edge)</strong> que procesa muestras dinámicas al instante y traduce coeficientes estadísticos en <strong>redacción formal APA con trazabilidad algorítmica</strong>.',
    solutionText: 'Construí un motor sintáctico automatizado con cómputo en el borde (Edge) que procesa muestras dinámicas al instante y traduce coeficientes estadísticos en redacción formal APA con trazabilidad algorítmica.',
    impactText: '<strong>De horas a 0 segundos:</strong> 100% de consistencia entre tablas y conclusiones narrativas, eliminando discrepancias matemáticas y acelerando la toma de decisiones.',
    url: 'https://smn-muestra.vercel.app/',
    statusBadge: 'EDGE SERVERLESS',
    tags: [
      'TypeScript',
      'JavaScript',
      'Astro',
      'Tailwind CSS',
      'Cloudflare Workers',
      'NoSQL Database',
      'Generación Gráfica',
      'Estadística Aplicada',
      'Normativa APA',
      'Vitest (Testing)'
    ],
    image: '/projects/smn-preview.png',
    imageWebp: '/projects/smn-preview.webp',
    imageAvif: '/projects/smn-preview.avif',
    repoUrl: 'https://github.com/Miguel19x/SMN---Muestra',
    demoUrl: 'https://smn-muestra.vercel.app/',
    themeColor: 'cyan',
    diagram: {
      header: 'Flujo de Arquitectura del Sistema (SMN)',
      sub: 'PIPELINE SERVERLESS · ASTRO + EDGE',
      steps: [
        { num: 'PASO 01', label: 'Ingesta de Muestra', tech: 'Dataset NoSQL' },
        { num: 'PASO 02', label: 'Cálculo & Muestreo', tech: 'Cloudflare Workers (TS)' },
        { num: 'PASO 03', label: 'Renderizado Visual', tech: 'Astro · Gráficos Estadísticos' },
        { num: 'PASO 04', label: 'Generador APA', tech: 'Conclusiones con Trazabilidad' }
      ]
    },
    footerLinks: [
      { label: 'smn-muestra.vercel.app ↗', url: 'https://smn-muestra.vercel.app/' },
      { label: 'github.com/Miguel19x/SMN---Muestra ↗', url: 'https://github.com/Miguel19x/SMN---Muestra' }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. VARIOS
  // --------------------------------------------------------------------------
  {
    id: 'wrapped',
    badge: 'PROYECTO FREELANCE · ASTRO · REACT · WEB AUDIO · FRAMER MOTION',
    title: 'Spotify Wrapped — Experiencia Interactiva',
    summary: 'Experiencia web interactiva estilo historias de redes sociales con reproducción de audio en tiempo real y métricas personalizadas.',
    impactPhrase: 'Recrea la experiencia anual de Spotify con animaciones dinámicas, audio en tiempo real y estadísticas personalizadas directamente en el navegador.',
    problemText: 'Necesidad de transformar un dataset de escucha anual en un producto digital memorable, dinámico y compartible como regalo personalizado.',
    solutionHtml: 'Implementé <strong>arquitectura de islas interactivas</strong> con control de gestos táctiles fluidos (100dvh) e integración de streaming de audio verificado vía <strong>Spotify oEmbed</strong>.',
    solutionText: 'Implementé arquitectura de islas interactivas con control de gestos táctiles fluidos (100dvh) e integración de streaming de audio verificado vía Spotify oEmbed.',
    impactText: '<strong>Fluidez constante de 60 FPS</strong> en móvil y desktop con streaming de música continuo y tarjeta de resumen lista para compartir.',
    url: 'https://spotify-wrapped-2024-client.vercel.app/',
    statusBadge: 'AUDIO REACTIVE',
    tags: [
      'Astro',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Spotify oEmbed',
      'Web Audio API',
      'Diseño Móvil (100dvh)',
      'Interactividad por Gestos'
    ],
    image: '/projects/wrapped-preview.png',
    imageWebp: '/projects/wrapped-preview.webp',
    imageAvif: '/projects/wrapped-preview.avif',
    repoUrl: 'https://github.com/Miguel19x/Spotify-Wrapped',
    demoUrl: 'https://spotify-wrapped-2024-client.vercel.app/',
    themeColor: 'emerald',
    diagram: {
      header: 'Pipeline de Arquitectura & Reproducción (Spotify Wrapped)',
      sub: 'PIPELINE JAMSTACK · ASTRO + REACT + FRAMER MOTION',
      steps: [
        { num: 'DATOS', label: 'Curaduría & Métricas', tech: 'Datos de Escucha Anual (JSON)' },
        { num: 'ARQUITECTURA', label: 'Islas Interactivas', tech: 'Astro + React (Estado de Stories)' },
        { num: 'INTERACCIÓN', label: 'Gestos & Animaciones', tech: 'Framer Motion + Touch 100dvh' },
        { num: 'AUDIO', label: 'Reproducción & Entrega', tech: 'Spotify oEmbed + Vercel Edge' }
      ]
    },
    footerLinks: [
      { label: 'spotify-wrapped.vercel.app ↗', url: 'https://spotify-wrapped-2024-client.vercel.app/' },
      { label: 'github.com/Miguel19x/Spotify-Wrapped ↗', url: 'https://github.com/Miguel19x/Spotify-Wrapped' }
    ]
  }
];
