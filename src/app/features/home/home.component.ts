import { Component, inject } from '@angular/core';
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
  ],
  template: `
    <app-interactive-background />
    <app-scroll-progress />
    <app-header />
    <main>
      <app-hero id="hero" />
      <app-about id="about" />
      <app-technologies id="technologies" />
      <app-experience id="experience" />
      <app-projects id="projects" />
      <app-certifications id="certifications" />
      <app-availability id="availability" />
      <app-contact id="contact" />
    </main>
    <app-footer />
    <app-scroll-to-top />
  `,
  styles: [`
    main { overflow: hidden; }
  `]
})
export class HomeComponent {
  // Ensures LanguageService initializes on first load
  readonly lang = inject(LanguageService);
}
