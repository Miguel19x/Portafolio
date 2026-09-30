export type SectionId = 'hero' | 'sobre-mi' | 'proyectos' | 'habilidades' | 'trayectoria' | 'contacto';

export interface SectionPalette {
  bg: string;
  surface: string;
  tint: string;
  tintDim: string;
  glow1: string;
  glow2: string;
  border: string;
}

export interface MetricItem {
  id: string;
  index: string;
  label?: string;
  value: string;
  sublabel: string;
  valueColorClass?: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  dataNav: SectionId;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'email' | 'code';
}

export interface ArchitectureStep {
  num: string;
  label: string;
  tech: string;
}

export interface ArchitectureDiagram {
  header: string;
  sub: string;
  steps: ArchitectureStep[];
}

export interface ProjectFooterLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  badge: string;
  title: string;
  summary: string;
  impactPhrase: string;
  problemText: string;
  solutionHtml: string;
  solutionText?: string;
  impactText: string;
  url: string;
  statusBadge: string;
  tags: string[];
  image: string;
  imageAvif?: string;
  imageWebp?: string;
  repoUrl: string;
  demoUrl?: string;
  themeColor: 'amber' | 'cyan' | 'emerald' | 'purple' | 'orange';
  diagram?: ArchitectureDiagram;
  footerLinks?: ProjectFooterLink[];
}

export interface SkillItem {
  name: string;
  context: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: 'frontend' | 'backend' | 'cloud';
  skills: SkillItem[];
}

export interface ExperienceItem {
  role: string;
  period: string;
  company: string;
  location: string;
  description: string;
  metrics: {
    value: string;
    label: string;
  }[];
}
