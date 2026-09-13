# Instrucciones para Google Antigravity (Gemini Flash) — Portafolio de Miguel Angel Aranguren

Copia y pega todo el bloque de abajo ("PROMPT PARA LA IA") tal cual en el chat del agente dentro de Antigravity, en la raíz de un proyecto nuevo. Está escrito como un brief completo para que el agente no tenga que adivinar nada: contexto, contenido real, dirección de diseño y una lista explícita de errores a evitar.

---

## PROMPT PARA LA IA

Actúa como un diseñador/desarrollador frontend senior especializado en portafolios de programadores que consiguen entrevistas reales (no portafolios "bonitos pero genéricos"). Vas a construir mi portafolio personal desde cero.

### 1. Quién soy y cómo debo presentarme
- Nombre: Miguel Angel Aranguren.
- Posicionamiento: **Desarrollador Fullstack** (Python, TypeScript, JavaScript, SQL, React). NO me presentes como "QA Automation" ni pongas el foco en testing — el testing es una fortaleza secundaria, no mi identidad profesional.
- Estudiante de Ingeniería de Sistemas (UNEXPO, 5to semestre), basado en Caracas, Venezuela, buscando trabajo remoto.
- Contacto: miguelaranguren19x@outlook.com · GitHub: Miguel19x · LinkedIn: miguela19x.

### 2. Contenido real que debes usar (no inventes proyectos ni cifras)

**Proyecto 1 — SMN (Sistema de Informes Estadísticos Automáticos)**
- Backend propio en JavaScript sobre Cloudflare Workers, con base de datos NoSQL.
- Genera gráficos y muestreos estadísticos a partir de datos registrados.
- Módulo que redacta conclusiones automáticas fundamentadas en principios estadísticos y normas APA, garantizando trazabilidad entre resultado y evidencia.
- Repo: github.com/Miguel19x/SMN---Muestra

**Proyecto 2 — IrisClassifier (freelance para MegaAutopartes)**
- Plataforma fullstack (web + móvil) que escanea listados en PDF y Excel de múltiples distribuidores para extraer y validar precios automáticamente.
- Combina y renderiza catálogos de distintas fuentes en un catálogo propio, resolviendo inconsistencias entre ellas.
- Calcula cotizaciones aplicando márgenes de negocio definidos por el cliente.
- Incluye tests unitarios/integración en Python y pruebas manuales de frontend.
- Repo: github.com/Miguel19x/IrisClassifier

**Experiencia adicional (usar como credibilidad, no como sección de proyecto):**
- Analista de Soporte Técnico y Operaciones en Inversiones Caracas C.A. (2023): arqueos de caja al 100% de precisión, auditorías de inventario de +1000 componentes, configuración de redes para +20 equipos.

**Stack técnico real:** Python, TypeScript, JavaScript (ES6+), Java, React, Astro, HTML5/CSS3, SQL, MongoDB, APIs REST, Cloudflare Workers, Git/GitHub, Docker (básico).

Para cada proyecto, escribe un **mini case study**, no solo una tarjeta con una línea. Estructura sugerida por proyecto:
1. Problema/contexto (qué necesidad real resolvía).
2. Qué construí y decisiones técnicas clave (por qué Cloudflare Workers, por qué NoSQL, etc.).
3. Resultado/impacto concreto (ej. "elimina la validación manual de precios entre distribuidores").
4. Stack usado (badges o lista corta).
5. Enlaces: repo y demo en vivo si existe.

### 3. Estructura del sitio
1. **Hero**: mi nombre, una frase de posicionamiento (no genérica tipo "soy un apasionado desarrollador"), y dos CTAs claros: "Ver proyectos" y "Descargar CV" / "Contactar".
2. **Sobre mí**: breve, enfocado en cómo pienso resolviendo problemas (lógica, estadística, rigurosidad), no un resumen de vida.
3. **Proyectos**: los dos case studies detallados arriba.
4. **Skills**: agrupadas por categoría (Desarrollo, Backend/Datos, Herramientas), no una nube de badges sin jerarquía.
5. **Experiencia**: línea de tiempo corta con Inversiones Caracas como credibilidad de rigurosidad/atención al detalle.
6. **Contacto**: formulario simple o mailto directo + enlaces a GitHub/LinkedIn. Sin fricción.

### 4. Dirección de diseño (evita que se vea "hecho con IA" o con plantilla)
- Nada de la fórmula por defecto: hero centrado + 3 tarjetas idénticas con ícono + gradiente morado-azul genérico. Elige una paleta con un color de acento fuerte y poco común (evita el morado/azul degradado típico de "SaaS landing page").
- Tipografía con carácter: una fuente para títulos con personalidad (no Inter/Poppins por defecto sin más) combinada con una fuente legible para cuerpo de texto.
- Layout con asimetría intencional en al menos una sección (no todo en grids perfectamente centrados).
- Micro-interacciones sutiles (hover states, transiciones de 150-250ms), nunca animaciones que retrasen la lectura del contenido o que se repitan de forma molesta al hacer scroll.
- Modo oscuro/claro si el tiempo lo permite, pero funcional en ambos, no solo estético.
- Debe verse como el portafolio de una persona real con dos proyectos concretos, no como una landing de producto SaaS.

### 5. Errores típicos de portafolio que debes evitar activamente
- Texto de relleno tipo "Lorem ipsum" o placeholders olvidados.
- Botones o enlaces que no llevan a ningún lado (todo link debe apuntar a algo real: GitHub, mailto, o ancla interna).
- Descripciones de proyecto de una sola línea sin explicar el problema que resuelven ni las decisiones técnicas.
- Sección de skills como lista plana de 30 tecnologías sin jerarquía ni contexto de uso real.
- Imágenes o capturas sin optimizar (usa formatos modernos/comprimidos; si no hay capturas reales, usa mockups simples o diagramas, nunca imágenes genéricas de stock).
- Mala experiencia en móvil: prueba y ajusta breakpoints, no asumas que el grid de escritorio se ve bien reducido.
- Tiempos de carga altos por fuentes/animaciones pesadas sin necesidad.
- Falta de contraste de color (cumplir accesibilidad AA como mínimo) y falta de texto alternativo en imágenes.
- Ausencia de un CTA claro de contacto — el reclutador no debería tener que buscar cómo escribirme.
- Que el sitio no diga en ningún lado, de forma directa, "qué tipo de rol busco" (desarrollador fullstack remoto).
- Metadatos vacíos: agrega title, meta description y og:image básicos para que se vea bien si comparto el link.

### 6. Requisitos técnicos
- Responsive real (mobile-first), probado en al menos 3 anchos de viewport.
- Rendimiento: imágenes optimizadas, sin librerías pesadas innecesarias.
- Accesibilidad básica: etiquetas semánticas, contraste AA, navegación por teclado funcional.
- SEO básico: title, meta description, favicon, Open Graph tags.
- Código organizado en componentes reutilizables (usa el stack que consideres mejor para un sitio estático rápido — por ejemplo Astro o React + Tailwind; justifícalo brevemente si eliges otro).
- Despliegue final debe poder hacerse fácilmente en Vercel, Netlify o GitHub Pages.

### 7. Proceso de trabajo
1. Antes de escribir código, muéstrame un esquema/wireframe en texto de las secciones y el orden, y la paleta de colores + fuentes propuestas, para que las apruebe.
2. Luego construye el sitio sección por sección.
3. Al final, dame un checklist de verificación cruzando la lista de "errores a evitar" de la sección 5, confirmando cuáles ya están cubiertos.

---