import type { SkillCategory } from '../types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend & UI',
    icon: 'frontend',
    skills: [
      { name: 'React', context: 'Interfaces dinámicas y componentes modulares con hooks' },
      { name: 'TypeScript', context: 'Tipado estricto, interfaces seguras y contratos de datos' },
      { name: 'JavaScript (ES6+)', context: 'Manipulación del DOM, programación asíncrona y modular' },
      { name: 'HTML5 & CSS3', context: 'Semántica accesible (WCAG AA), Flexbox, Grid y Tokens' },
      { name: 'Astro', context: 'Arquitectura de islas y sitios estáticos ultrarrápidos' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend & Datos',
    icon: 'backend',
    skills: [
      { name: 'Python', context: 'Extracción de datos (ETL), automatización y lógica de servidor' },
      { name: 'SQL', context: 'Consultas relacionales y consistencia transaccional' },
      { name: 'MongoDB / NoSQL', context: 'Modelado dinámico de documentos y colecciones NoSQL' },
      { name: 'REST APIs', context: 'Endpoints eficientes, autenticación y manejo de errores' },
      { name: 'Java', context: 'Fundamentos de Programación Orientada a Objetos y patrones' }
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud & Operaciones',
    icon: 'cloud',
    skills: [
      { name: 'Cloudflare Workers', context: 'Lógica serverless de ejecución global en el edge' },
      { name: 'Git & GitHub', context: 'Control de versiones riguroso, branches y pull requests' },
      { name: 'Docker', context: 'Contenedores para consistencia en entornos de desarrollo' },
      { name: 'Testing (PyTest & Vitest)', context: 'Aseguramiento de reglas críticas y prevención de regresiones' },
      { name: 'CI/CD (GitHub Actions)', context: 'Pipelines de integración continua y despliegues automáticos' }
    ]
  }
];
