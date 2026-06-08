import { Component, inject, signal, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

const FORMSPREE_ID  = 'xnjrebjv';
const TURNSTILE_KEY = '0x4AAAAAADddTF3ch93Y-Z4D';

declare const turnstile: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private fb         = inject(FormBuilder);
  private http       = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  status         = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  turnstileError = signal(false);
  turnstileToken = signal('');
  private widgetId: any;

  form = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    company: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  get f() { return this.form.controls; }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.renderTurnstile();
  }

  private renderTurnstile(): void {
    const container = document.getElementById('turnstile-container');
    if (!container) return;

    const tryRender = () => {
      if (typeof turnstile !== 'undefined') {
        this.widgetId = turnstile.render(container, {
          sitekey: TURNSTILE_KEY,
          theme: 'dark',
          callback: (token: string) => {
            this.turnstileToken.set(token);
            this.turnstileError.set(false);
          },
          'expired-callback': () => this.turnstileToken.set(''),
          'error-callback':   () => this.turnstileToken.set(''),
        });
      } else {
        setTimeout(tryRender, 500);
      }
    };
    tryRender();
  }

  ngOnDestroy(): void {
    if (typeof turnstile !== 'undefined' && this.widgetId != null) {
      turnstile.remove(this.widgetId);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.turnstileToken()) {
      this.turnstileError.set(true);
      return;
    }
    this.turnstileError.set(false);
    this.status.set('sending');

    this.http.post(
      `https://formspree.io/f/${FORMSPREE_ID}`,
      { ...this.form.value, 'cf-turnstile-response': this.turnstileToken() },
      { headers: { Accept: 'application/json' } }
    ).subscribe({
      next: () => {
        this.status.set('success');
        this.form.reset();
        this.turnstileToken.set('');
        if (typeof turnstile !== 'undefined' && this.widgetId != null) {
          turnstile.reset(this.widgetId);
        }
      },
      error: () => this.status.set('error'),
    });
  }

  readonly directLinks = [
    { label: 'LinkedIn',             url: 'https://www.linkedin.com/in/arturo-romero-b01b641a7', icon: 'linkedin' },
    { label: 'GitHub',               url: 'https://github.com/arturoromeroae',                   icon: 'github'   },
    { label: 'ajruwork@gmail.com',   url: 'mailto:ajruwork@gmail.com',                           icon: 'email'    },
  ];
}
