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
  }

  switchLang(lang: SupportedLang): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
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
    document.documentElement.lang = lang;
  }

  private getInitialLang(): SupportedLang {
    const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedLang;
    if (stored === 'es' || stored === 'en') return stored;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return browser === 'es' ? 'es' : 'en';
  }
}
