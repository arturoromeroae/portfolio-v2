import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DividerVariant = 'brand' | 'indigo' | 'purple' | 'cyan' | 'emerald' | 'amber';

@Component({
  selector: 'app-section-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="divider-container" [attr.data-variant]="variant">
      <!-- Ambient aura glow -->
      <div class="ambient-glow"></div>

      <!-- Main laser track and moving light photon -->
      <div class="laser-track">
        <div class="laser-pulse laser-pulse--primary"></div>
        <div class="laser-pulse laser-pulse--secondary"></div>

        <!-- Center tech node -->
        <div class="center-node">
          <div class="node-ring"></div>
          <span class="node-symbol">✦</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
      z-index: 5;
      pointer-events: none;
      overflow: visible;
    }

    .divider-container {
      position: relative;
      width: 100%;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: -24px 0;

      // Color Theme Variants
      &[data-variant='brand'] {
        --div-primary: #6366f1;
        --div-secondary: #a855f7;
        --div-glow: rgba(99, 102, 241, 0.45);
        --div-glow-sec: rgba(168, 85, 247, 0.35);
        --div-badge-border: rgba(99, 102, 241, 0.5);
      }

      &[data-variant='cyan'] {
        --div-primary: #38bdf8;
        --div-secondary: #6366f1;
        --div-glow: rgba(56, 189, 248, 0.45);
        --div-glow-sec: rgba(99, 102, 241, 0.35);
        --div-badge-border: rgba(56, 189, 248, 0.5);
      }

      &[data-variant='purple'] {
        --div-primary: #a855f7;
        --div-secondary: #ec4899;
        --div-glow: rgba(168, 85, 247, 0.45);
        --div-glow-sec: rgba(236, 72, 153, 0.35);
        --div-badge-border: rgba(168, 85, 247, 0.5);
      }

      &[data-variant='emerald'] {
        --div-primary: #10b981;
        --div-secondary: #06b6d4;
        --div-glow: rgba(16, 185, 129, 0.45);
        --div-glow-sec: rgba(6, 182, 212, 0.35);
        --div-badge-border: rgba(16, 185, 129, 0.5);
      }

      &[data-variant='amber'] {
        --div-primary: #f59e0b;
        --div-secondary: #ef4444;
        --div-glow: rgba(245, 158, 11, 0.45);
        --div-glow-sec: rgba(239, 68, 68, 0.35);
        --div-badge-border: rgba(245, 158, 11, 0.5);
      }
    }

    // Ethereal ambient aura
    .ambient-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(800px, 88vw);
      height: 90px;
      border-radius: 50%;
      filter: blur(48px);
      background: radial-gradient(
        ellipse at center,
        var(--div-glow) 0%,
        var(--div-glow-sec) 40%,
        transparent 75%
      );
      opacity: 0.55;
      animation: auraBreathe 5s ease-in-out infinite alternate;
    }

    // Horizontal laser beam track
    .laser-track {
      position: relative;
      width: min(1080px, 92vw);
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.05) 12%,
        var(--div-primary) 50%,
        rgba(255, 255, 255, 0.05) 88%,
        transparent 100%
      );
      box-shadow: 0 0 10px var(--div-glow);
    }

    // Animated photon sweeps
    .laser-pulse {
      position: absolute;
      top: -1px;
      height: 3px;
      border-radius: 9999px;
      pointer-events: none;

      &--primary {
        width: 150px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--div-primary) 30%,
          #ffffff 50%,
          var(--div-secondary) 70%,
          transparent 100%
        );
        box-shadow:
          0 0 14px var(--div-primary),
          0 0 28px var(--div-secondary),
          0 0 4px #ffffff;
        animation: photonSweepRight 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      &--secondary {
        width: 90px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--div-secondary) 40%,
          #ffffff 60%,
          transparent 100%
        );
        box-shadow:
          0 0 12px var(--div-secondary),
          0 0 20px var(--div-primary);
        animation: photonSweepLeft 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: 2.2s;
        opacity: 0.8;
      }
    }

    // Central geometric cyber-diamond
    .center-node {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      width: 30px;
      height: 30px;
      background: #090c15;
      border: 1px solid var(--div-badge-border);
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 0 24px var(--div-glow),
        inset 0 0 12px rgba(255, 255, 255, 0.06);
      transition: all var(--transition-base);

      .node-ring {
        position: absolute;
        inset: -4px;
        border-radius: 9px;
        border: 1px dashed var(--div-secondary);
        opacity: 0.45;
        animation: spinSlow 18s linear infinite;
      }

      .node-symbol {
        transform: rotate(-45deg);
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        text-shadow:
          0 0 8px var(--div-primary),
          0 0 16px var(--div-secondary);
        line-height: 1;
        animation: sparklePulse 3s ease-in-out infinite alternate;
      }
    }

    // Keyframes
    @keyframes photonSweepRight {
      0% {
        left: -5%;
        opacity: 0;
        transform: scaleX(0.3);
      }
      12% {
        opacity: 1;
        transform: scaleX(1);
      }
      88% {
        opacity: 1;
        transform: scaleX(1);
      }
      100% {
        left: 98%;
        opacity: 0;
        transform: scaleX(0.3);
      }
    }

    @keyframes photonSweepLeft {
      0% {
        left: 98%;
        opacity: 0;
        transform: scaleX(0.3);
      }
      12% {
        opacity: 0.8;
        transform: scaleX(1);
      }
      88% {
        opacity: 0.8;
        transform: scaleX(1);
      }
      100% {
        left: -5%;
        opacity: 0;
        transform: scaleX(0.3);
      }
    }

    @keyframes auraBreathe {
      0% {
        opacity: 0.35;
        transform: translate(-50%, -50%) scale(0.92);
      }
      100% {
        opacity: 0.65;
        transform: translate(-50%, -50%) scale(1.08);
      }
    }

    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes sparklePulse {
      0%   { transform: rotate(-45deg) scale(0.9); opacity: 0.75; }
      100% { transform: rotate(-45deg) scale(1.25); opacity: 1; }
    }

    @media (max-width: 768px) {
      .divider-container {
        height: 72px;
        margin: -16px 0;
      }
      .ambient-glow {
        height: 60px;
        filter: blur(35px);
      }
      .laser-pulse {
        width: 100px;
      }
      .center-node {
        width: 24px;
        height: 24px;
        .node-symbol { font-size: 9px; }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .laser-pulse, .node-ring, .ambient-glow, .node-symbol {
        animation: none !important;
      }
    }
  `]
})
export class SectionDividerComponent {
  @Input() variant: DividerVariant = 'brand';
}
