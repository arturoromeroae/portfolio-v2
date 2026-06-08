import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  visible = signal(false);
  typedText = signal('');

  private roles = ['Senior Full Stack Developer', 'Angular Architect', 'Cloud Engineer', 'Tech Lead'];
  private roleIndex = 0;
  private charIndex = 0;
  private deleting = false;

  ngOnInit(): void {
    setTimeout(() => this.visible.set(true), 100);
    this.typeRole();
  }

  private typeRole(): void {
    const current = this.roles[this.roleIndex];

    if (!this.deleting) {
      this.typedText.set(current.slice(0, ++this.charIndex));
      if (this.charIndex === current.length) {
        this.deleting = true;
        setTimeout(() => this.typeRole(), 2200);
        return;
      }
    } else {
      this.typedText.set(current.slice(0, --this.charIndex));
      if (this.charIndex === 0) {
        this.deleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      }
    }

    setTimeout(() => this.typeRole(), this.deleting ? 45 : 80);
  }

  scrollToContact(): void {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  scrollDown(): void {
    const el = document.getElementById('about');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  readonly techStack = [
    'Angular 20', 'TypeScript', 'PHP', 'Python',
    'Azure', 'AWS', 'Docker', 'Salesforce', 'PeopleSoft'
  ];

  readonly socialLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arturo-romero-b01b641a7', icon: 'linkedin' },
    { label: 'GitHub', url: 'https://github.com/arturoromeroae', icon: 'github' },
  ];
}
