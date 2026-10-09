import { Injectable } from '@angular/core';
import { Technology, Project, Certification, SocialLink, NavItem } from '../interfaces/portfolio.interfaces';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {

  readonly technologies: Technology[] = [
    // Frontend
    { name: 'Angular', icon: 'angular', level: 'expert', category: 'frontend' },
    { name: 'TypeScript', icon: 'typescript', level: 'expert', category: 'frontend' },
    { name: 'JavaScript', icon: 'javascript', level: 'expert', category: 'frontend' },
    { name: 'HTML5', icon: 'html5', level: 'expert', category: 'frontend' },
    { name: 'CSS3 / SCSS', icon: 'css3', level: 'expert', category: 'frontend' },
    { name: 'RxJS', icon: 'rxjs', level: 'advanced', category: 'frontend' },
    // Backend
    { name: 'PHP', icon: 'php', level: 'expert', category: 'backend' },
    { name: 'Python', icon: 'python', level: 'advanced', category: 'backend' },
    { name: 'Django', icon: 'django', level: 'advanced', category: 'backend' },
    { name: 'REST APIs', icon: 'api', level: 'expert', category: 'backend' },
    { name: 'Node.js', icon: 'nodejs', level: 'intermediate', category: 'backend' },
    // Databases
    { name: 'PostgreSQL', icon: 'postgresql', level: 'advanced', category: 'databases' },
    { name: 'MySQL', icon: 'mysql', level: 'advanced', category: 'databases' },
    { name: 'MongoDB', icon: 'mongodb', level: 'intermediate', category: 'databases' },
    // Cloud
    { name: 'Microsoft Azure', icon: 'azure', level: 'advanced', category: 'cloud' },
    { name: 'AWS', icon: 'aws', level: 'advanced', category: 'cloud' },
    // DevOps
    { name: 'Docker', icon: 'docker', level: 'advanced', category: 'devops' },
    { name: 'Git', icon: 'git', level: 'expert', category: 'devops' },
    { name: 'CI/CD', icon: 'cicd', level: 'intermediate', category: 'devops' },
    // Integrations
    { name: 'Salesforce', icon: 'salesforce', level: 'advanced', category: 'integrations' },
    { name: 'PeopleSoft', icon: 'peoplesoft', level: 'advanced', category: 'integrations' },
    { name: 'Izipay', icon: 'payment', level: 'advanced', category: 'integrations' },
    // Security
    { name: 'CSP', icon: 'security', level: 'advanced', category: 'security' },
    { name: 'reCAPTCHA Enterprise', icon: 'recaptcha', level: 'advanced', category: 'security' },
    { name: 'Wordfence', icon: 'wordfence', level: 'advanced', category: 'security' },
    { name: 'Cybersecurity', icon: 'shield', level: 'advanced', category: 'security' },
  ];

  readonly projects: Project[] = [
    {
      id: 'p1',
      titleKey: 'projects.p1.title',
      descriptionKey: 'projects.p1.description',
      technologies: ['Angular', 'PHP', 'Salesforce', 'PeopleSoft', 'REST API', 'PostgreSQL'],
      image: 'assets/images/project-1.svg',
      featured: true,
      typeKey: 'projects.type_enterprise',
    },
    {
      id: 'p2',
      titleKey: 'projects.p2.title',
      descriptionKey: 'projects.p2.description',
      technologies: ['Angular', 'TypeScript', 'Azure', 'Docker', 'JWT', 'SCSS'],
      image: 'assets/images/project-2.svg',
      featured: true,
      typeKey: 'projects.type_enterprise',
    },
    {
      id: 'p3',
      titleKey: 'projects.p3.title',
      descriptionKey: 'projects.p3.description',
      technologies: ['Python', 'Django', 'AWS', 'Docker', 'PostgreSQL', 'Swagger'],
      image: 'assets/images/project-3.svg',
      featured: true,
      typeKey: 'projects.type_enterprise',
    },
    {
      id: 'p4',
      titleKey: 'projects.p4.title',
      descriptionKey: 'projects.p4.description',
      technologies: ['Angular', 'PHP', 'Azure', 'PostgreSQL', 'Docker', 'REST API'],
      image: 'assets/images/project-4.svg',
      featured: true,
      typeKey: 'projects.type_enterprise',
    },
    {
      id: 'p5',
      titleKey: 'projects.p5.title',
      descriptionKey: 'projects.p5.description',
      technologies: ['Next.js / React', 'TypeScript', 'Tailwind CSS', 'Booking API', 'SEO'],
      image: 'assets/images/project-5.svg',
      demoUrl: 'https://chaletinngatlinburg.com/',
      featured: true,
      typeKey: 'projects.type_freelance',
    },
    {
      id: 'p6',
      titleKey: 'projects.p6.title',
      descriptionKey: 'projects.p6.description',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Dark/Light Theme'],
      image: 'assets/images/project-6.svg',
      demoUrl: 'https://cavbio-app.vercel.app/',
      featured: true,
      typeKey: 'projects.type_freelance',
    },
  ];

  readonly certifications: Certification[] = [
    { id: 'c1', nameKey: 'certifications.c1', issuer: 'ISC2', year: '2024', icon: 'shield-check', color: '#00A4A6' },
    { id: 'c2', nameKey: 'certifications.c2', issuer: 'IBM & ISC2', year: '2024', icon: 'security', color: '#054ADA' },
    { id: 'c3', nameKey: 'certifications.c3', issuer: 'Cisco', year: '2023', icon: 'network', color: '#1BA0D7' },
    { id: 'c4', nameKey: 'certifications.c4', issuer: 'Platzi', year: '2022', icon: 'code', color: '#98CA3F' },
    { id: 'c5', nameKey: 'certifications.c5', issuer: 'Platzi', year: '2022', icon: 'react', color: '#61DAFB' },
    { id: 'c6', nameKey: 'certifications.c6', issuer: 'Platzi', year: '2021', icon: 'webpack', color: '#8DD6F9' },
  ];

  readonly socialLinks: SocialLink[] = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arturo-romero-b01b641a7', icon: 'linkedin' },
    { label: 'GitHub', url: 'https://github.com/arturoromeroae', icon: 'github' },
    { label: 'Email', url: 'mailto:ajruwork@gmail.com', icon: 'email' },
  ];

  readonly navItems: NavItem[] = [
    { labelKey: 'nav.about', fragment: 'about' },
    { labelKey: 'nav.technologies', fragment: 'technologies' },
    { labelKey: 'nav.experience', fragment: 'experience' },
    { labelKey: 'nav.projects', fragment: 'projects' },
    { labelKey: 'nav.certifications', fragment: 'certifications' },
    { labelKey: 'nav.contact', fragment: 'contact' },
  ];

  getTechByCategory(category: string): Technology[] {
    return this.technologies.filter(t => t.category === category);
  }
}
