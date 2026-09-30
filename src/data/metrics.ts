import type { MetricItem } from '../types';

export const HERO_METRICS: MetricItem[] = [
  {
    id: 'etl',
    index: '01 // Procesamiento',
    value: 'Pipelines ETL',
    sublabel: 'Ingesta & Datos Complejos'
  },
  {
    id: 'timezone',
    index: '02 // Cooperación',
    value: 'Zona UTC-4',
    sublabel: 'Overlap fluido con US & LatAm'
  },
  {
    id: 'accuracy',
    index: '03 // Exactitud',
    value: '0 Discrepancias',
    sublabel: 'Conciliación de Precios & Normas APA',
    valueColorClass: 'text-emerald-400'
  },
  {
    id: 'arch',
    index: '04 // Arquitectura',
    value: 'Edge & Serverless',
    sublabel: 'Baja latencia & Docker',
    valueColorClass: 'text-orange-400'
  }
];
