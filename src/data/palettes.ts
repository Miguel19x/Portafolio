import type { SectionId, SectionPalette } from '../types';

export const THEMED_SECTION_PALETTES: Record<'dark' | 'light', Record<SectionId, SectionPalette>> = {
  dark: {
    'hero': {
      bg: '#090a0f',
      surface: '#11131c',
      tint: '#f97316',
      tintDim: 'rgba(249, 115, 22, 0.15)',
      glow1: 'rgba(249, 115, 22, 0.05)',
      glow2: 'rgba(14, 165, 233, 0.03)',
      border: 'rgba(255, 255, 255, 0.08)'
    },
    'sobre-mi': {
      // Terracota / Ámbar analítico
      bg: '#140c09',
      surface: '#1d120d',
      tint: '#ea580c',
      tintDim: 'rgba(234, 88, 12, 0.22)',
      glow1: 'rgba(245, 158, 11, 0.12)',
      glow2: 'rgba(194, 65, 12, 0.14)',
      border: 'rgba(245, 158, 11, 0.22)'
    },
    'proyectos': {
      // Azul / cian técnico frío
      bg: '#060e17',
      surface: '#091522',
      tint: '#06b6d4',
      tintDim: 'rgba(6, 182, 212, 0.20)',
      glow1: 'rgba(6, 182, 212, 0.15)',
      glow2: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)'
    },
    'habilidades': {
      // Verde esmeralda vibrante
      bg: '#08120d',
      surface: '#0e1e17',
      tint: '#10b981',
      tintDim: 'rgba(16, 185, 129, 0.22)',
      glow1: 'rgba(16, 185, 129, 0.16)',
      glow2: 'rgba(168, 85, 247, 0.15)',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    'trayectoria': {
      // Púrpura / Índigo institucional
      bg: '#0d0a17',
      surface: '#141024',
      tint: '#8b5cf6',
      tintDim: 'rgba(139, 92, 246, 0.22)',
      glow1: 'rgba(139, 92, 246, 0.16)',
      glow2: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)'
    },
    'contacto': {
      // Vuelve animadamente a la base neutra
      bg: '#090a0f',
      surface: '#11131c',
      tint: '#f97316',
      tintDim: 'rgba(249, 115, 22, 0.15)',
      glow1: 'rgba(249, 115, 22, 0.06)',
      glow2: 'rgba(148, 163, 184, 0.04)',
      border: 'rgba(255, 255, 255, 0.08)'
    }
  },
  light: {
    'hero': {
      bg: '#f8fafc',
      surface: '#ffffff',
      tint: '#ea580c',
      tintDim: 'rgba(234, 88, 12, 0.12)',
      glow1: 'rgba(249, 115, 22, 0.07)',
      glow2: 'rgba(14, 165, 233, 0.05)',
      border: 'rgba(226, 232, 240, 0.9)'
    },
    'sobre-mi': {
      // Ámbar suave y cálido
      bg: '#fffdfa',
      surface: '#ffffff',
      tint: '#d97706',
      tintDim: 'rgba(217, 119, 6, 0.12)',
      glow1: 'rgba(245, 158, 11, 0.09)',
      glow2: 'rgba(234, 88, 12, 0.06)',
      border: 'rgba(253, 230, 138, 0.7)'
    },
    'proyectos': {
      // Cian técnico luminoso
      bg: '#f7faff',
      surface: '#ffffff',
      tint: '#0284c7',
      tintDim: 'rgba(2, 132, 199, 0.12)',
      glow1: 'rgba(6, 182, 212, 0.08)',
      glow2: 'rgba(59, 130, 246, 0.06)',
      border: 'rgba(186, 230, 253, 0.7)'
    },
    'habilidades': {
      // Menta y esmeralda fresco
      bg: '#f7fdf9',
      surface: '#ffffff',
      tint: '#059669',
      tintDim: 'rgba(5, 150, 105, 0.12)',
      glow1: 'rgba(16, 185, 129, 0.08)',
      glow2: 'rgba(5, 150, 105, 0.05)',
      border: 'rgba(167, 243, 208, 0.7)'
    },
    'trayectoria': {
      // Lavanda suave
      bg: '#faf8ff',
      surface: '#ffffff',
      tint: '#7c3aed',
      tintDim: 'rgba(124, 58, 237, 0.12)',
      glow1: 'rgba(139, 92, 246, 0.08)',
      glow2: 'rgba(124, 58, 237, 0.05)',
      border: 'rgba(221, 214, 254, 0.7)'
    },
    'contacto': {
      bg: '#f8fafc',
      surface: '#ffffff',
      tint: '#ea580c',
      tintDim: 'rgba(234, 88, 12, 0.12)',
      glow1: 'rgba(249, 115, 22, 0.07)',
      glow2: 'rgba(148, 163, 184, 0.05)',
      border: 'rgba(226, 232, 240, 0.9)'
    }
  }
};

export const SECTION_PALETTES: Record<SectionId, SectionPalette> = THEMED_SECTION_PALETTES.dark;

