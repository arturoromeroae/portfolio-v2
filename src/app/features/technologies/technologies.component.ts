import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { TechCategory } from '../../core/interfaces/portfolio.interfaces';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
})
export class TechnologiesComponent {
  private dataService = inject(PortfolioDataService);

  readonly categories: { key: TechCategory; labelKey: string; icon: string }[] = [
    { key: 'frontend',     labelKey: 'technologies.frontend',     icon: '◈' },
    { key: 'backend',      labelKey: 'technologies.backend',      icon: '◉' },
    { key: 'databases',    labelKey: 'technologies.databases',    icon: '◎' },
    { key: 'cloud',        labelKey: 'technologies.cloud',        icon: '◌' },
    { key: 'devops',       labelKey: 'technologies.devops',       icon: '⊕' },
    { key: 'integrations', labelKey: 'technologies.integrations', icon: '⊗' },
    { key: 'security',     labelKey: 'technologies.security',     icon: '⊘' },
  ];

  getTech(cat: TechCategory) {
    return this.dataService.getTechByCategory(cat);
  }

  getLevelPercent(level: string): number {
    return level === 'expert' ? 95 : level === 'advanced' ? 80 : 60;
  }

  getLevelColor(level: string): string {
    return level === 'expert' ? 'var(--accent)' : level === 'advanced' ? 'var(--blue)' : 'var(--text-tertiary)';
  }
}
