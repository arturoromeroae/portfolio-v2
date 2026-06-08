import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly specialties = [
    { key: 'about.specialty_1', icon: '⬡' },
    { key: 'about.specialty_2', icon: '⬡' },
    { key: 'about.specialty_3', icon: '⬡' },
    { key: 'about.specialty_4', icon: '⬡' },
    { key: 'about.specialty_5', icon: '⬡' },
    { key: 'about.specialty_6', icon: '⬡' },
  ];
}
