export interface Technology {
  name: string;
  icon: string;
  level: 'expert' | 'advanced' | 'intermediate';
  category: TechCategory;
}

export type TechCategory =
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'cloud'
  | 'devops'
  | 'integrations'
  | 'security';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  current?: boolean;
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  codeUrl?: string;
  featured: boolean;
}

export interface Certification {
  id: string;
  nameKey: string;
  issuer: string;
  year: string;
  icon: string;
  color: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface NavItem {
  labelKey: string;
  fragment: string;
}
