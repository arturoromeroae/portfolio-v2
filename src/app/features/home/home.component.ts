import { Component, inject, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { TechnologiesComponent } from '../technologies/technologies.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { CertificationsComponent } from '../certifications/certifications.component';
import { AvailabilityComponent } from '../availability/availability.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ScrollProgressComponent } from '../../shared/components/scroll-progress/scroll-progress.component';
import { InteractiveBackgroundComponent } from '../../shared/components/interactive-background/interactive-background.component';
import { ScrollToTopComponent } from '../../shared/components/scroll-to-top/scroll-to-top.component';
import { SectionDividerComponent } from '../../shared/components/section-divider/section-divider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    TechnologiesComponent,
    ExperienceComponent,
    ProjectsComponent,
    CertificationsComponent,
    AvailabilityComponent,
    ContactComponent,
    FooterComponent,
    ScrollProgressComponent,
    InteractiveBackgroundComponent,
    ScrollToTopComponent,
    SectionDividerComponent,
  ],
  template: `
    <app-interactive-background />
    <app-scroll-progress />
    <app-header />
    <main class="home-main">
      <app-hero id="hero" />
      <app-section-divider variant="cyan" />
      <app-about id="about" />
      <app-section-divider variant="brand" />
      <app-technologies id="technologies" />
      <app-section-divider variant="purple" />
      <app-experience id="experience" />
      <app-section-divider variant="brand" />
      <app-projects id="projects" />
      <app-section-divider variant="cyan" />
      <app-certifications id="certifications" />
      <app-section-divider variant="emerald" />
      <app-availability id="availability" />
      <app-section-divider variant="amber" />
      <app-contact id="contact" />
    </main>
    <app-footer />
    <app-scroll-to-top />
  `,
  styles: [`
    main { overflow: hidden; position: relative; }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  readonly lang = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScrollReveal();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initScrollReveal(): void {
    const mainEl = document.querySelector('.home-main');
    if (!mainEl) return;

    // Enable CSS transitions dynamically once running in browser
    document.body.classList.add('reveal-enabled');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => this.observer?.observe(sec));
  }
}
