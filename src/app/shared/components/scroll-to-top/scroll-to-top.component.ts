import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  template: `
    <button 
      class="scroll-to-top" 
      [class.visible]="visible()" 
      (click)="scrollToTop()"
      aria-label="Scroll to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  `,
  styles: [`
    .scroll-to-top {
      position: fixed;
      bottom: var(--space-8, 2rem);
      right: var(--space-8, 2rem);
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full, 9999px);
      background: var(--bg-card, #161616);
      border: 1px solid var(--border-strong, rgba(255,255,255,0.15));
      color: var(--text-secondary, #a1a1a1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(16px);
      transition: opacity var(--transition-base, 250ms ease), 
                  transform var(--transition-base, 250ms ease), 
                  visibility var(--transition-base, 250ms ease), 
                  color var(--transition-fast, 150ms ease), 
                  border-color var(--transition-fast, 150ms ease),
                  box-shadow var(--transition-base, 250ms ease);
      z-index: 90;
      box-shadow: var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.5));
    }

    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .scroll-to-top:hover {
      color: var(--text-primary, #ededed);
      border-color: var(--accent, #6366f1);
      box-shadow: var(--shadow-glow, 0 0 20px rgba(99,102,241,0.25));
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        bottom: var(--space-6, 1.5rem);
        right: var(--space-6, 1.5rem);
        width: 42px;
        height: 42px;
      }
    }
  `]
})
export class ScrollToTopComponent {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    if (typeof window !== 'undefined') {
      this.visible.set(window.scrollY > 400);
    }
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
