import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'portfolio_lang';
  readonly currentLang = signal<SupportedLang>(this.getInitialLang());

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.translate.use(this.currentLang());
    document.documentElement.lang = this.currentLang();
  }

  switchLang(lang: SupportedLang): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  private getInitialLang(): SupportedLang {
    const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedLang;
    if (stored === 'es' || stored === 'en') return stored;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return browser === 'es' ? 'es' : 'en';
  }
}
