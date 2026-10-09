import { Injectable, signal, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'portfolio_theme';
  private metaService = inject(Meta);

  readonly currentTheme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
    this.listenToSystemThemeChanges();
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    if (this.currentTheme() === theme) return;

    this.currentTheme.set(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;

      if (theme === 'light') {
        root.classList.add('light-theme');
        body.classList.add('light-theme');
        this.metaService.updateTag({ name: 'theme-color', content: '#38bdf8' });
      } else {
        root.classList.remove('light-theme');
        body.classList.remove('light-theme');
        this.metaService.updateTag({ name: 'theme-color', content: '#06080e' });
      }
    }
  }

  private getInitialTheme(): ThemeMode {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as ThemeMode;
      if (stored === 'dark' || stored === 'light') return stored;
    }
    // Auto-detect device / OS color scheme preference (Dark / Light)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      return isSystemLight ? 'light' : 'dark';
    }
    return 'dark';
  }

  private listenToSystemThemeChanges(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      mediaQuery.addEventListener('change', (e) => {
        // If the user hasn't explicitly chosen a preference via the toggle button, auto-adapt to OS changes
        const hasStoredPreference = localStorage.getItem(this.STORAGE_KEY);
        if (!hasStoredPreference) {
          const newTheme: ThemeMode = e.matches ? 'light' : 'dark';
          this.currentTheme.set(newTheme);
          this.applyTheme(newTheme);
        }
      });
    }
  }
}
