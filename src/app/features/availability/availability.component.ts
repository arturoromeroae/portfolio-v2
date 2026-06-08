import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss',
})
export class AvailabilityComponent {
  readonly options = [
    { icon: '🌐', titleKey: 'availability.remote', descKey: 'availability.remote_desc' },
    { icon: '🏢', titleKey: 'availability.hybrid', descKey: 'availability.hybrid_desc' },
    { icon: '✈️', titleKey: 'availability.relocation', descKey: 'availability.relocation_desc' },
  ];

  scrollToContact(): void {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
