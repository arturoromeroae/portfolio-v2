import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `<div class="scroll-progress" [style.width.%]="progress()"></div>`,
  styles: [`
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: var(--gradient-brand);
      z-index: 200;
      transition: width 0.1s linear;
      box-shadow: 0 0 8px rgba(99,102,241,0.6);
    }
  `]
})
export class ScrollProgressComponent {
  progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    this.progress.set(total > 0 ? (scrolled / total) * 100 : 0);
  }
}
