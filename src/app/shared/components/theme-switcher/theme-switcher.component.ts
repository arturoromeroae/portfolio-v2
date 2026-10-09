import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-switcher-btn"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Cambiar a modo claro (Cielo)' : 'Cambiar a modo oscuro (Espacio)'"
      [title]="themeService.currentTheme() === 'dark' ? 'Activar Cielo Soleado' : 'Activar Espacio Estelar'"
    >
      <div class="theme-icon-container" [class.is-light]="themeService.currentTheme() === 'light'">
        <!-- Sun Icon (Active in Light Mode) -->
        <svg class="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>

        <!-- Moon Icon (Active in Dark Mode) -->
        <svg class="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      </div>
      <span class="theme-label">{{ themeService.currentTheme() === 'dark' ? 'Espacio' : 'Cielo' }}</span>
    </button>
  `,
  styles: [`
    .theme-switcher-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      background: var(--glass-surface);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: var(--glass-shadow);
      color: var(--text-secondary);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
      user-select: none;

      &:hover {
        color: var(--text-primary);
        border-color: rgba(255, 255, 255, 0.35);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .theme-icon-container {
      position: relative;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      .theme-icon {
        position: absolute;
        width: 15px;
        height: 15px;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
      }

      .moon-icon {
        opacity: 1;
        transform: rotate(0deg) scale(1);
        color: #818cf8;
      }

      .sun-icon {
        opacity: 0;
        transform: rotate(-90deg) scale(0.4);
        color: #f59e0b;
      }

      &.is-light {
        .moon-icon {
          opacity: 0;
          transform: rotate(90deg) scale(0.4);
        }

        .sun-icon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }
      }
    }

    .theme-label {
      font-size: 0.72rem;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-weight: 700;
    }
  `]
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
