import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, SupportedLang } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lang-switcher">
      @for (lang of langs; track lang.code) {
        <button
          class="lang-btn"
          [class.active]="langService.currentLang() === lang.code"
          (click)="langService.switchLang(lang.code)"
          [attr.aria-label]="lang.label"
        >
          {{ lang.flag }} {{ lang.code.toUpperCase() }}
        </button>
      }
    </div>
  `,
  styles: [`
    .lang-switcher {
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 3px;
    }

    .lang-btn {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--text-tertiary);
      transition: all var(--transition-fast);
      cursor: pointer;
      border: none;
      background: none;
      display: flex;
      align-items: center;
      gap: 4px;

      &.active {
        background: var(--accent);
        color: white;
        box-shadow: 0 0 12px rgba(99, 102, 241, 0.45);
        animation: btnPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      &:not(.active):hover {
        color: var(--text-primary);
        background: var(--bg-glass);
      }
    }

    @keyframes btnPop {
      0%   { transform: scale(0.9); }
      55%  { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
  `]
})
export class LanguageSwitcherComponent {
  langService = inject(LanguageService);
  langs: { code: SupportedLang; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇵🇪' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];
}
