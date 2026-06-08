import { Component, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit, ViewChild, inject } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
}

interface GlowBlob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorRgb: string;
  baseAlpha: number;
  angle: number;
  speed: number;
}

@Component({
  selector: 'app-interactive-background',
  standalone: true,
  template: `
    <div class="interactive-bg">
      <canvas #bgCanvas></canvas>
    </div>
  `,
  styles: [`
    .interactive-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      pointer-events: none;
      background: var(--bg-primary, #0a0a0a);
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class InteractiveBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ngZone = inject(NgZone);
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  
  private particles: Particle[] = [];
  private glowBlobs: GlowBlob[] = [];
  private mouse = { x: 0, y: 0, active: false };
  private isMobile = false;
  private width = 0;
  private height = 0;
  
  private lastScrollY = 0;
  private scrollSpeed = 0;
  private targetScrollSpeed = 0;

  ngOnInit(): void {
    this.checkDeviceType();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resizeCanvas();
    this.initGlowBlobs();
    this.initParticles();

    // Run animation loop outside of Angular zone to prevent triggering global change detection on each frame.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onResize);
      window.addEventListener('scroll', this.onScroll);
      if (!this.isMobile) {
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseleave', this.onMouseLeave);
      }
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
  }

  private checkDeviceType(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    }
  }

  private resizeCanvas = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
  };

  private onResize = (): void => {
    this.resizeCanvas();
    this.checkDeviceType();
    this.initParticles(); // Reinitialize particles for new screen size
  };

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
  };

  private onMouseLeave = (): void => {
    this.mouse.active = false;
  };

  private onScroll = (): void => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - this.lastScrollY;
      this.lastScrollY = currentScrollY;
      
      // Calculate scroll velocity, direction is inverted so stars fly up when scrolling down
      const boost = delta * 0.18;
      this.targetScrollSpeed = Math.max(-18, Math.min(18, boost));
    }
  };

  private initGlowBlobs(): void {
    this.glowBlobs = [
      {
        x: this.width * 0.3,
        y: this.height * 0.3,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.5,
        colorRgb: '99, 102, 241', // Indigo
        baseAlpha: 0.09,
        angle: 0,
        speed: 0.0004
      },
      {
        x: this.width * 0.7,
        y: this.height * 0.6,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.45,
        colorRgb: '168, 85, 247', // Purple
        baseAlpha: 0.06,
        angle: Math.PI / 3,
        speed: 0.0003
      },
      {
        x: this.width * 0.5,
        y: this.height * 0.8,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.35,
        colorRgb: '59, 130, 246', // Blue
        baseAlpha: 0.04,
        angle: Math.PI * (2/3),
        speed: 0.0002
      }
    ];
  }

  private initParticles(): void {
    const area = this.width * this.height;
    const maxParticles = this.isMobile ? 18 : 60;
    const count = Math.min(maxParticles, Math.floor(area / 25000));
    
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
        targetAlpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  private animate = (): void => {
    if (!this.ctx) return;
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private draw(): void {
    const ctx = this.ctx!;
    ctx.clearRect(0, 0, this.width, this.height);

    // Smoothly decay scroll speed boost over time
    this.scrollSpeed += (this.targetScrollSpeed - this.scrollSpeed) * 0.08;
    this.targetScrollSpeed *= 0.88;

    const isStreaking = Math.abs(this.scrollSpeed) > 1.2;

    // 1. Draw Glow Blobs (Auroras)
    ctx.globalCompositeOperation = 'screen';
    for (const blob of this.glowBlobs) {
      blob.angle += blob.speed;
      const orbitX = Math.cos(blob.angle) * (this.width * 0.15);
      const orbitY = Math.sin(blob.angle * 1.5) * (this.height * 0.1);
      
      // Add a slow parallax scroll translation so background auroras move slower than text sections
      const parallaxY = -(this.lastScrollY * 0.18);
      const currentX = blob.x + orbitX;
      const currentY = blob.y + orbitY + parallaxY;

      const gradient = ctx.createRadialGradient(
        currentX, currentY, 0,
        currentX, currentY, blob.radius
      );
      gradient.addColorStop(0, `rgba(${blob.colorRgb}, ${blob.baseAlpha})`);
      gradient.addColorStop(0.5, `rgba(${blob.colorRgb}, ${blob.baseAlpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, blob.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // 2. Draw & Update Particles
    const connectionDist = 120;
    const mouseConnectionDist = 160;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update positions - add scrollSpeed in opposite direction for spaceship flight effect
      p.x += p.vx;
      p.y += p.vy + this.scrollSpeed;

      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      p.alpha += (p.targetAlpha - p.alpha) * 0.02;
      if (Math.abs(p.alpha - p.targetAlpha) < 0.05) {
        p.targetAlpha = Math.random() * 0.4 + 0.1;
      }

      if (this.mouse.active && !isStreaking) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseConnectionDist) {
          const force = (1 - dist / mouseConnectionDist) * 0.03;
          p.x += dx * force;
          p.y += dy * force;
        }
      }

      // Draw particle (draw as streaks when moving fast)
      const currentVy = p.vy + this.scrollSpeed;
      const totalSpeedY = Math.abs(currentVy);

      if (totalSpeedY > 1.2) {
        // Spaceship hyperdrive effect: draw star streak with a beautiful fading gradient trail
        const trailLength = currentVy * 8.5; // Dynamic length based on speed
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y - trailLength);
        
        // Brand color tint trails for a rich space aesthetic
        let trailColor = '255, 255, 255';
        if (i % 3 === 0) trailColor = '99, 102, 241'; // Indigo accent
        else if (i % 3 === 1) trailColor = '168, 85, 247'; // Purple accent
        
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1.0, p.alpha * 2.5)})`);
        grad.addColorStop(0.3, `rgba(${trailColor}, ${p.alpha * 0.8})`);
        grad.addColorStop(1, `rgba(${trailColor}, 0)`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - trailLength);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.radius * 0.9;
        ctx.stroke();
      } else {
        // Standard circle particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Only draw connections if not streaking rapidly to prevent screen clutter
      if (!isStreaking) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.06;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        if (this.mouse.active) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseConnectionDist) {
            const alpha = (1 - dist / mouseConnectionDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(this.mouse.x, this.mouse.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
  }
}
