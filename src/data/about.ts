export interface AboutRule {
  num: string;
  title: string;
  desc: string;
}

export interface AboutFieldNote {
  tag: string;
  title: string;
  description: string;
  badge: string;
}

export interface AboutData {
  tag: string;
  title: string;
  paragraphs: string[];
  quote: string;
  badges: string[];
  fieldNote: AboutFieldNote;
  rules: AboutRule[];
  pillars?: { id: string; title: string; description: string; icon: string }[];
}

export const ABOUT_DATA: AboutData = {
  tag: '// 01. Enfoque Técnico',
  title: 'Ingeniería, Lógica y Reducción de Incertidumbre',
  paragraphs: [
    'No concibo el software como acumulación de librerías, sino como flujos de datos donde la <strong>consistencia y el control de excepciones</strong> son innegociables. Mi formación en <strong>Ingeniería de Sistemas (UNEXPO)</strong> guía mi criterio: evaluar restricciones y modos de falla antes de tirar líneas de código.',
    'Desconfío de la sobre-ingeniería: en <strong>Terroso Café</strong> resolví reservas accesibles y Lighthouse 100 con SSG ligero y WhatsApp directo, demostrando que la mejor arquitectura suele ser la que elimina piezas móviles sin sacrificar robustez ni experiencia de usuario.'
  ],
  quote: '“La elegancia en ingeniería no se mide por cuántas dependencias agregas, sino por cuánta incertidumbre logras eliminar con el mínimo código determinista.”',
  badges: [
    'Ingeniería de Sistemas (UNEXPO)',
    'Contratos & Tipado Estricto',
    'Serverless & Edge First'
  ],
  fieldNote: {
    tag: 'REGISTRO DE CAMPO // DATOS EN EL MUNDO REAL',
    title: 'Los datos nunca llegan limpios',
    description: 'En <strong>IrisClassifier</strong> construí parsers para PDFs y Excels rotos de proveedores protegiendo márgenes de venta. En <strong>Inversiones Caracas</strong> audité activos y arqueos de caja sin tolerar 0.01$ de descalce: validar en runtime es innegociable.',
    badge: '✓ 0 discrepancias · Trazabilidad estricta'
  },
  rules: [
    {
      num: '01',
      title: 'Contratos en frontera',
      desc: 'Esquemas validados en el borde (Zod/Pydantic). Cero any en runtime.'
    },
    {
      num: '02',
      title: 'Tests de comportamiento',
      desc: 'Si necesitas 5 mocks para probar, la arquitectura está acoplada.'
    },
    {
      num: '03',
      title: 'Respeto al usuario & hardware',
      desc: 'Zero Layout Shift (CLS), navegación 100% por teclado y 60 FPS.'
    }
  ],
  // Fallback histórico para no romper referencias
  pillars: [
    {
      id: 'pillar-math',
      title: 'Rigor Matemático & Datos Confiables',
      description: 'Cada conclusión o métrica generada por el software mantiene trazabilidad directa con la evidencia cruda registrada.',
      icon: 'math'
    },
    {
      id: 'pillar-serverless',
      title: 'Arquitectura Serverless & Eficiencia',
      description: 'Uso de tecnologías de borde como Cloudflare Workers para procesar solicitudes con latencia mínima y cero sobrecoste de infraestructura.',
      icon: 'serverless'
    },
    {
      id: 'pillar-validation',
      title: 'Validación Continua & Testing',
      description: 'Escribo tests unitarios e integrales (PyTest, Vitest) para asegurar que las reglas comerciales se mantengan firmes ante cualquier cambio.',
      icon: 'testing'
    }
  ]
};
