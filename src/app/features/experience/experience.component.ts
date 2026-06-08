import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  activeJob = signal(0);

  readonly jobs = [
    {
      id: 'seidor',
      prefix: 'experience.seidor',
      current: true,
      color: 'var(--accent)',
      techs: ['Angular', 'PHP', 'REST API', 'Salesforce', 'PeopleSoft', 'ETL', 'Izipay', 'PostgreSQL'],
      responsibilities: [
        'experience.seidor.resp_1',
        'experience.seidor.resp_2',
        'experience.seidor.resp_3',
        'experience.seidor.resp_4',
        'experience.seidor.resp_5',
      ],
    },
    {
      id: 'csti',
      prefix: 'experience.csti',
      current: false,
      color: 'var(--blue)',
      techs: ['Azure', 'Docker', 'WordPress', 'CI/CD', 'CSP', 'reCAPTCHA', 'Wordfence'],
      responsibilities: [
        'experience.csti.resp_1',
        'experience.csti.resp_2',
        'experience.csti.resp_3',
        'experience.csti.resp_4',
        'experience.csti.resp_5',
      ],
    },
    {
      id: 'ae',
      prefix: 'experience.ae',
      current: false,
      color: 'var(--orange)',
      techs: ['PHP', 'Python', 'Django', 'AWS', 'Docker', 'REST API', 'PostgreSQL'],
      responsibilities: [
        'experience.ae.resp_1',
        'experience.ae.resp_2',
        'experience.ae.resp_3',
        'experience.ae.resp_4',
        'experience.ae.resp_5',
      ],
    },
    {
      id: 'freelance',
      prefix: 'experience.freelance',
      current: true,
      color: 'var(--green)',
      techs: ['WordPress', 'Django', 'APIs', 'Figma', 'Python', 'PHP'],
      responsibilities: [
        'experience.freelance.resp_1',
        'experience.freelance.resp_2',
        'experience.freelance.resp_3',
        'experience.freelance.resp_4',
        'experience.freelance.resp_5',
      ],
    },
  ];
}
