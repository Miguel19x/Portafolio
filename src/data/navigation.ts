import type { NavLink, SocialLink } from '../types';

export const NAV_LINKS: NavLink[] = [
  { id: 'nav-about', label: '01.enfoque', href: '#sobre-mi', dataNav: 'sobre-mi' },
  { id: 'nav-projects', label: '02.proyectos', href: '#proyectos', dataNav: 'proyectos' },
  { id: 'nav-skills', label: '03.habilidades', href: '#habilidades', dataNav: 'habilidades' },
  { id: 'nav-exp', label: '04.trayectoria', href: '#trayectoria', dataNav: 'trayectoria' },
  { id: 'nav-contact', label: '05.contacto', href: '#contacto', dataNav: 'contacto' }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { id: 'social-github', label: 'GitHub', href: 'https://github.com/Miguel19x', icon: 'github' },
  { id: 'social-linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/miguela19x', icon: 'linkedin' },
  { id: 'social-portfolio', label: 'Repositorio Portafolio', href: 'https://github.com/Miguel19x/Portafolio', icon: 'code' }
];

export const PERSONAL_INFO = {
  name: 'Miguel Angel Aranguren Ramirez',
  username: 'miguel.aranguren',
  role: 'Desarrollador Fullstack Remoto',
  tagline: '~/fullstack-systems',
  email: 'miguelaranguren19x@outlook.com',
  availability: 'Disponible para roles Fullstack Remotos',
  location: 'Caracas, VE (UTC-4) · Remoto Internacional',
  education: 'Ing. de Sistemas (5to Semestre, UNEXPO)',
  cvUrl: '/cv-miguel-aranguren.pdf',
  githubUrl: 'https://github.com/Miguel19x',
  linkedinUrl: 'https://linkedin.com/in/miguela19x'
};
