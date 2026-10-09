import { Component, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit, ViewChild, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

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

interface SunRay {
  baseAngle: number;
  angularWidth: number;
  length: number;
  baseAlpha: number;
  pulseSpeed: number;
  phase: number;
  swaySpeed: number;
}

interface SunSparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
  colorRgb: string;
  isGlint: boolean;
}

interface CloudPuff {
  offsetX: number;
  offsetY: number;
  radius: number;
  alphaMult: number;
}

interface CloudBlob {
  x: number;
  y: number;
  vx: number;
  displaceX: number;
  displaceY: number;
  targetDisplaceX: number;
  targetDisplaceY: number;
  width: number;
  height: number;
  alpha: number;
  puffs: CloudPuff[];
}

@Component({
  selector: 'app-interactive-background',
  standalone: true,
  template: `
    <div class="interactive-bg" [class.is-light]="themeService.currentTheme() === 'light'">
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
      background: var(--bg-primary, #06080e);
      overflow: hidden;
      transition: background 0.5s ease;
    }
    .interactive-bg.is-light {
      background: #0284c7;
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

  themeService = inject(ThemeService);
  private ngZone = inject(NgZone);
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;

  // Dark mode elements (Deep Space)
  private particles: Particle[] = [];
  private glowBlobs: GlowBlob[] = [];

  // Light mode elements (Daytime Sky, Ultra-thin diffusing rays, Interactive Fluffy Clouds)
  private sunRays: SunRay[] = [];
  private sunSparkles: SunSparkle[] = [];
  private clouds: CloudBlob[] = [];

  private mouse = { x: 0, y: 0, active: false };
  private isMobile = false;
  private width = 0;
  private height = 0;
  private time = 0;

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
    this.initDarkSpace();
    this.initLightSky();

    // Run animation loop outside of Angular zone to maintain 60fps without change detection overhead
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
    this.initDarkSpace();
    this.initLightSky();
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

      // Calculate scroll velocity
      const boost = delta * 0.18;
      this.targetScrollSpeed = Math.max(-18, Math.min(18, boost));
    }
  };

  // ─── DARK MODE INITIALIZERS ──────────────────────────────────────────────────
  private initDarkSpace(): void {
    this.initGlowBlobs();
    this.initParticles();
  }

  private initGlowBlobs(): void {
    this.glowBlobs = [
      {
        x: this.width * 0.3,
        y: this.height * 0.3,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.55,
        colorRgb: '99, 102, 241', // Indigo
        baseAlpha: 0.13,
        angle: 0,
        speed: 0.0004
      },
      {
        x: this.width * 0.7,
        y: this.height * 0.6,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.5,
        colorRgb: '168, 85, 247', // Purple
        baseAlpha: 0.1,
        angle: Math.PI / 3,
        speed: 0.0003
      },
      {
        x: this.width * 0.2,
        y: this.height * 0.8,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.45,
        colorRgb: '56, 189, 248', // Cyan
        baseAlpha: 0.08,
        angle: Math.PI / 2,
        speed: 0.00035
      },
      {
        x: this.width * 0.5,
        y: this.height * 0.85,
        vx: 0,
        vy: 0,
        radius: Math.min(this.width, this.height) * 0.4,
        colorRgb: '59, 130, 246', // Blue
        baseAlpha: 0.07,
        angle: Math.PI * (2 / 3),
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

  // ─── LIGHT MODE INITIALIZERS ─────────────────────────────────────────────────
  private initLightSky(): void {
    this.initSunRays();
    this.initSunSparkles();
    this.initClouds();
  }

  private initSunRays(): void {
    // Large quantity of micro-thin, delicate, diffusing ray needles
    const rayCount = this.isMobile ? 32 : 60;
    this.sunRays = [];
    const maxRayLength = Math.hypot(this.width, this.height) * 2.2;

    for (let i = 0; i < rayCount; i++) {
      // Span across quadrant from 0.02 rad (horizontal right) to 1.55 rad (vertical down)
      const ratio = i / (rayCount - 1);
      const baseAngle = 0.015 + ratio * 1.53 + (Math.random() - 0.5) * 0.025;
      // Ultra-thin needle rays (0.0008 to 0.0035 radians)
      const angularWidth = 0.0008 + Math.random() * 0.003;
      const baseAlpha = 0.035 + Math.random() * 0.08;
      const pulseSpeed = 0.0006 + Math.random() * 0.0012;
      const phase = Math.random() * Math.PI * 2;
      const swaySpeed = 0.00025 + Math.random() * 0.00045;

      this.sunRays.push({
        baseAngle,
        angularWidth,
        length: maxRayLength,
        baseAlpha,
        pulseSpeed,
        phase,
        swaySpeed
      });
    }
  }

  private initSunSparkles(): void {
    const sparkleCount = this.isMobile ? 22 : 50;
    this.sunSparkles = [];

    for (let i = 0; i < sparkleCount; i++) {
      const isGlint = Math.random() > 0.4;
      this.sunSparkles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.3) * 0.3,
        vy: -(Math.random() * 0.35 + 0.12),
        radius: Math.random() * 2.0 + 0.8,
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        colorRgb: Math.random() > 0.3 ? '255, 255, 255' : '254, 240, 138',
        isGlint
      });
    }
  }

  private initClouds(): void {
    const cloudCount = this.isMobile ? 5 : 8;
    this.clouds = [];

    for (let i = 0; i < cloudCount; i++) {
      const baseWidth = (Math.min(this.width, this.height) * 0.42) + Math.random() * 240;
      const baseHeight = baseWidth * 0.42;

      // 5 to 8 organic overlapping puffs for visible, beautiful fluffy cloud shapes
      const puffCount = 5 + Math.floor(Math.random() * 4);
      const puffs: CloudPuff[] = [];
      for (let p = 0; p < puffCount; p++) {
        const offsetRatio = (p / (puffCount - 1)) - 0.5;
        puffs.push({
          offsetX: offsetRatio * (baseWidth * 0.8) + (Math.random() - 0.5) * 35,
          offsetY: (Math.random() - 0.5) * (baseHeight * 0.45),
          radius: (baseHeight * 0.55) + Math.random() * (baseHeight * 0.45),
          alphaMult: 0.75 + Math.random() * 0.25
        });
      }

      this.clouds.push({
        x: (this.width / cloudCount) * i + Math.random() * 80,
        y: (this.height * 0.08) + (Math.random() * this.height * 0.78),
        vx: 0.05 + Math.random() * 0.08,
        displaceX: 0,
        displaceY: 0,
        targetDisplaceX: 0,
        targetDisplaceY: 0,
        width: baseWidth,
        height: baseHeight,
        // Clearly visible, soft white clouds (24% to 40% opacity)
        alpha: 0.24 + Math.random() * 0.16,
        puffs
      });
    }
  }

  // ─── MAIN ANIMATION LOOP ─────────────────────────────────────────────────────
  private animate = (): void => {
    if (!this.ctx) return;
    this.time += 16;
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private draw(): void {
    const ctx = this.ctx!;
    ctx.clearRect(0, 0, this.width, this.height);

    // Smoothly decay scroll speed boost over time
    this.scrollSpeed += (this.targetScrollSpeed - this.scrollSpeed) * 0.08;
    this.targetScrollSpeed *= 0.88;

    const isLightMode = this.themeService.currentTheme() === 'light';

    if (isLightMode) {
      this.drawLightSky(ctx);
    } else {
      this.drawDarkSpace(ctx);
    }
  }

  // ─── DRAW LIGHT SKY (DAYTIME, ULTRA-THIN DIFFUSING RAYS & VISIBLE INTERACTIVE CLOUDS) 
  private drawLightSky(ctx: CanvasRenderingContext2D): void {
    // 1. Sky Gradient Base (Serene Azure to Horizon)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#0284c7');      // Deep vibrant sky
    skyGrad.addColorStop(0.3, '#38bdf8');    // Pure azure daylight
    skyGrad.addColorStop(0.65, '#7dd3fc');   // Light sky
    skyGrad.addColorStop(0.88, '#bae6fd');   // Soft atmosphere
    skyGrad.addColorStop(1, '#e0f2fe');      // Gentle warm horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Interactive Visible Wispy Clouds
    ctx.globalCompositeOperation = 'source-over';
    for (const cloud of this.clouds) {
      cloud.x += cloud.vx;
      if (cloud.x - cloud.width * 0.7 > this.width) {
        cloud.x = -cloud.width * 0.7;
      }

      // Cursor Reaction (Clouds part and gently disperse when mouse moves nearby)
      if (this.mouse.active) {
        const currentCenterX = cloud.x + cloud.displaceX;
        const currentCenterY = cloud.y + cloud.displaceY - (this.lastScrollY * 0.08);
        const dx = this.mouse.x - currentCenterX;
        const dy = this.mouse.y - currentCenterY;
        const dist = Math.hypot(dx, dy);
        const repelRadius = Math.max(cloud.width * 0.75, 280);

        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 0.06;
          cloud.targetDisplaceX -= (dx / dist) * force * 55;
          cloud.targetDisplaceY -= (dy / dist) * force * 40;
        }
      }

      // Smooth elastic return
      cloud.displaceX += (cloud.targetDisplaceX - cloud.displaceX) * 0.08;
      cloud.displaceY += (cloud.targetDisplaceY - cloud.displaceY) * 0.08;
      cloud.targetDisplaceX *= 0.93;
      cloud.targetDisplaceY *= 0.93;

      // Parallax scroll on clouds
      const cloudY = cloud.y + cloud.displaceY - (this.lastScrollY * 0.08);
      const cloudX = cloud.x + cloud.displaceX;

      // Draw each fluffy puff of the cloud
      for (const puff of cloud.puffs) {
        const px = cloudX + puff.offsetX;
        const py = cloudY + puff.offsetY;
        const puffAlpha = cloud.alpha * puff.alphaMult;

        const grad = ctx.createRadialGradient(
          px, py, 0,
          px, py, puff.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${puffAlpha})`);
        grad.addColorStop(0.35, `rgba(255, 255, 255, ${puffAlpha * 0.75})`);
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${puffAlpha * 0.25})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, puff.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Volumetric Sun Core & Ultra-Thin Diffusing Crepuscular Rays
    // Sun position tucked into top-left corner, almost off-screen
    const sunX = -25;
    const sunY = -25 + (this.lastScrollY * 0.02);

    ctx.globalCompositeOperation = 'screen';

    // A. Soft Atmospheric Corner Sun Corona
    const outerHaloRadius = Math.min(this.width, this.height) * 0.6;
    const outerHalo = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, outerHaloRadius);
    outerHalo.addColorStop(0, 'rgba(254, 243, 199, 0.3)');
    outerHalo.addColorStop(0.2, 'rgba(253, 224, 71, 0.1)');
    outerHalo.addColorStop(0.5, 'rgba(125, 211, 252, 0.04)');
    outerHalo.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = outerHalo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, outerHaloRadius, 0, Math.PI * 2);
    ctx.fill();

    // B. Ultra-Thin Diffusing Crepuscular Sunbeams (Smooth dispersion across sky)
    for (const ray of this.sunRays) {
      const dynamicSway = Math.sin(this.time * ray.swaySpeed + ray.phase) * 0.012;
      const currentAngle = ray.baseAngle + dynamicSway;
      const pulse = Math.sin(this.time * ray.pulseSpeed + ray.phase);
      const currentAlpha = Math.max(0.01, ray.baseAlpha + pulse * 0.028);

      const angle1 = currentAngle - ray.angularWidth * 0.5;
      const angle2 = currentAngle + ray.angularWidth * 0.5;

      const p1x = sunX + Math.cos(angle1) * ray.length;
      const p1y = sunY + Math.sin(angle1) * ray.length;
      const p2x = sunX + Math.cos(angle2) * ray.length;
      const p2y = sunY + Math.sin(angle2) * ray.length;

      // Linear gradient along ray trajectory with smooth fadeout/diffusion
      const midAngle = currentAngle;
      const endX = sunX + Math.cos(midAngle) * ray.length;
      const endY = sunY + Math.sin(midAngle) * ray.length;

      const rayGrad = ctx.createLinearGradient(sunX, sunY, endX, endY);
      // Starts delicate, peaks near origin, and diffuses gently to 0 by 45%-60% length
      rayGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.65, currentAlpha * 1.5)})`);
      rayGrad.addColorStop(0.06, `rgba(254, 243, 199, ${currentAlpha * 1.0})`);
      rayGrad.addColorStop(0.18, `rgba(253, 230, 138, ${currentAlpha * 0.45})`);
      rayGrad.addColorStop(0.38, `rgba(255, 255, 255, ${currentAlpha * 0.12})`);
      rayGrad.addColorStop(0.58, 'rgba(255, 255, 255, 0)');
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.closePath();
      ctx.fill();
    }

    // C. Very subtle Corner Glare (small and discreet at the edge)
    const coreRadius = 38;
    const coreGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, coreRadius);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    coreGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.5)');
    coreGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.15)');
    coreGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    // 4. Sun Dust Motes & Golden Sparkles (Floating Dancing Sunlight Particles)
    const mouseDisplaceDist = 140;

    for (const sparkle of this.sunSparkles) {
      sparkle.x += sparkle.vx + Math.sin(this.time * 0.0008 + sparkle.phase) * 0.25;
      sparkle.y += sparkle.vy + (this.scrollSpeed * 0.4);

      if (sparkle.x < -20) sparkle.x = this.width + 20;
      if (sparkle.x > this.width + 20) sparkle.x = -20;
      if (sparkle.y < -20) sparkle.y = this.height + 20;
      if (sparkle.y > this.height + 20) sparkle.y = -20;

      if (this.mouse.active) {
        const dx = this.mouse.x - sparkle.x;
        const dy = this.mouse.y - sparkle.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouseDisplaceDist && dist > 0) {
          const force = (1 - dist / mouseDisplaceDist) * 0.035;
          sparkle.x -= (dx / dist) * force * 15;
          sparkle.y -= (dy / dist) * force * 15;
        }
      }

      const pulse = Math.sin(this.time * sparkle.pulseSpeed + sparkle.phase);
      const alpha = Math.max(0.06, sparkle.alpha * (0.65 + 0.35 * pulse));

      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${sparkle.colorRgb}, ${alpha})`;
      ctx.fill();

      if (sparkle.isGlint && alpha > 0.4) {
        const glintLen = sparkle.radius * (2.4 + pulse * 1.0);
        ctx.beginPath();
        ctx.moveTo(sparkle.x - glintLen, sparkle.y);
        ctx.lineTo(sparkle.x + glintLen, sparkle.y);
        ctx.moveTo(sparkle.x, sparkle.y - glintLen);
        ctx.lineTo(sparkle.x, sparkle.y + glintLen);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  // ─── DRAW DARK SPACE (DEEP SPACE, AURORAS & HYPERDRIVE TRAILS) ───────────────
  private drawDarkSpace(ctx: CanvasRenderingContext2D): void {
    const isStreaking = Math.abs(this.scrollSpeed) > 1.2;

    // 1. Draw Glow Blobs (Cosmic Auroras)
    ctx.globalCompositeOperation = 'screen';
    for (const blob of this.glowBlobs) {
      blob.angle += blob.speed;
      const orbitX = Math.cos(blob.angle) * (this.width * 0.15);
      const orbitY = Math.sin(blob.angle * 1.5) * (this.height * 0.1);

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

    // 2. Draw & Update Space Star Particles
    const connectionDist = 120;
    const mouseConnectionDist = 160;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

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
        const dist = Math.hypot(dx, dy);
        if (dist < mouseConnectionDist) {
          const force = (1 - dist / mouseConnectionDist) * 0.03;
          p.x += dx * force;
          p.y += dy * force;
        }
      }

      const currentVy = p.vy + this.scrollSpeed;
      const totalSpeedY = Math.abs(currentVy);

      if (totalSpeedY > 1.2) {
        const trailLength = currentVy * 8.5;
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y - trailLength);

        let trailColor = '255, 255, 255';
        if (i % 3 === 0) trailColor = '99, 102, 241';
        else if (i % 3 === 1) trailColor = '168, 85, 247';

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
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      if (!isStreaking) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

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
          const dist = Math.hypot(dx, dy);

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
