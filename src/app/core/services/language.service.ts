import { Injectable, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'portfolio_lang';
  readonly currentLang = signal<SupportedLang>(this.getInitialLang());

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.applyLang(this.currentLang());
    this.listenToSystemLanguageChanges();
  }

  switchLang(lang: SupportedLang): void {
    if (this.currentLang() === lang) return;

    if (typeof document !== 'undefined') {
      document.body.classList.remove('lang-changing');
      // Trigger browser reflow so CSS animation restarts seamlessly
      void document.body.offsetWidth;
      document.body.classList.add('lang-changing');
      setTimeout(() => {
        document.body.classList.remove('lang-changing');
      }, 480);
    }

    this.currentLang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
    this.applyLang(lang);
  }

  private applyLang(lang: SupportedLang): void {
    this.translate.use(lang).subscribe(() => {
      this.translate.get(['meta.title', 'meta.description']).subscribe(res => {
        if (res['meta.title']) {
          this.titleService.setTitle(res['meta.title']);
        }
        if (res['meta.description']) {
          this.metaService.updateTag({ name: 'description', content: res['meta.description'] });
        }
      });
    });
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

  private getInitialLang(): SupportedLang {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedLang;
      if (stored === 'es' || stored === 'en') return stored;
    }
    return this.detectDeviceLanguage();
  }

  private detectDeviceLanguage(): SupportedLang {
    if (typeof navigator === 'undefined') return 'es';
    // Check navigator.languages list or navigator.language
    const languages = navigator.languages || [navigator.language];
    for (const lang of languages) {
      if (lang && lang.toLowerCase().startsWith('es')) {
        return 'es';
      }
    }
    return 'en';
  }

  private listenToSystemLanguageChanges(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('languagechange', () => {
        const hasStoredPreference = localStorage.getItem(this.STORAGE_KEY);
        if (!hasStoredPreference) {
          const detected = this.detectDeviceLanguage();
          if (detected !== this.currentLang()) {
            this.switchLang(detected);
          }
        }
      });
    }
  }
}
