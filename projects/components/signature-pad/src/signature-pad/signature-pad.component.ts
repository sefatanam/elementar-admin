import {
  Component,
  ElementRef,
  signal,
  viewChild,
  afterNextRender,
  effect,
  input,
  output,
  ChangeDetectionStrategy,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'emr-signature-pad',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './signature-pad.component.html',
  styleUrl: './signature-pad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'handleEscapeKey($event)',
  }
})
export class SignaturePadComponent implements OnDestroy {
  width = input<number>(400);
  height = input<number>(200);
  penColor = input<string>('black');
  lineWidth = input<number>(3);
  backgroundColor = input<string>('white');

  signatureSaved = output<string>();
  signatureCleared = output<void>();

  mainCanvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('signatureCanvas');

  private mainContext = signal<CanvasRenderingContext2D | null>(null);
  private memoryCanvasElement: HTMLCanvasElement | null = null;
  private memoryContext = signal<CanvasRenderingContext2D | null>(null);

  private isDrawing = signal(false);
  private currentPoints = signal<Point[]>([]);

  private boundWindowMouseMove!: (event: MouseEvent | TouchEvent) => void;
  private boundWindowMouseUp!: (event: MouseEvent | TouchEvent) => void;

  constructor(private renderer: Renderer2) {
    afterNextRender(() => {
      this.initializeCanvasesAndContexts();
      this.addLocalListeners();
    });

    effect(() => {
      this.width(); this.height(); this.backgroundColor();
      if (this.mainContext() && this.memoryContext() && this.mainCanvasRef() && this.memoryCanvasElement) {
        const mainCanvasEl = this.mainCanvasRef().nativeElement;
        mainCanvasEl.width = this.width();
        mainCanvasEl.height = this.height();
        this.memoryCanvasElement.width = this.width();
        this.memoryCanvasElement.height = this.height();
        this.configureContextStyling(this.mainContext()!);
        this.configureContextStyling(this.memoryContext()!);
        this.mainContext()!.fillStyle = this.backgroundColor();
        this.mainContext()!.fillRect(0, 0, this.width(), this.height());
        this.memoryContext()!.clearRect(0,0, this.width(), this.height());
        this.currentPoints.set([]);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      this.penColor(); this.lineWidth();
      if (this.mainContext()) {
        this.mainContext()!.strokeStyle = this.penColor();
        this.mainContext()!.lineWidth = this.lineWidth();
        this.mainContext()!.fillStyle = this.penColor();
      }
      if (this.memoryContext()) {
        this.memoryContext()!.strokeStyle = this.penColor();
        this.memoryContext()!.lineWidth = this.lineWidth();
        this.memoryContext()!.fillStyle = this.penColor();
      }
    });
  }

  ngOnDestroy(): void {
    this.removeGlobalPointerListeners();
  }

  private initializeCanvasesAndContexts(): void {
    const mainCanvasEl = this.mainCanvasRef().nativeElement;
    const mainCtx = mainCanvasEl.getContext('2d');
    if (!mainCtx) {
      console.error('Failed to get 2D context for main canvas');
      return;
    }
    this.mainContext.set(mainCtx);
    this.memoryCanvasElement = document.createElement('canvas');
    const memCtx = this.memoryCanvasElement.getContext('2d');
    if (!memCtx) {
      console.error('Failed to get 2D context for memory canvas');
      return;
    }
    this.memoryContext.set(memCtx);
  }

  private configureContextStyling(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.penColor();
    ctx.lineWidth = this.lineWidth();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = this.penColor();
  }

  private addLocalListeners(): void {
    const canvasEl = this.mainCanvasRef().nativeElement;
    this.renderer.listen(canvasEl, 'mousedown', this.handlePointerDown.bind(this));
    this.renderer.listen(canvasEl, 'touchstart', (event: TouchEvent) => {
      if (event.cancelable) event.preventDefault();
      this.handlePointerDown(event);
    });
  }

  private addGlobalPointerListeners(): void {
    this.boundWindowMouseMove = this.handlePointerMove.bind(this);
    this.boundWindowMouseUp = this.handlePointerUp.bind(this);
    window.addEventListener('mousemove', this.boundWindowMouseMove);
    window.addEventListener('touchmove', this.boundWindowMouseMove, { passive: false });
    window.addEventListener('mouseup', this.boundWindowMouseUp);
    window.addEventListener('touchend', this.boundWindowMouseUp);
    window.addEventListener('touchcancel', this.boundWindowMouseUp);
  }

  private removeGlobalPointerListeners(): void {
    if (this.boundWindowMouseMove) {
      window.removeEventListener('mousemove', this.boundWindowMouseMove);
      window.removeEventListener('touchmove', this.boundWindowMouseMove);
    }
    if (this.boundWindowMouseUp) {
      window.removeEventListener('mouseup', this.boundWindowMouseUp);
      window.removeEventListener('touchend', this.boundWindowMouseUp);
      window.removeEventListener('touchcancel', this.boundWindowMouseUp);
    }
  }

  private handlePointerDown(event: MouseEvent | TouchEvent): void {
    const mainCtx = this.mainContext();
    if (!mainCtx) return;
    const coords = this.getCoordinates(event);
    if (!coords) return;

    this.isDrawing.set(true);
    this.currentPoints.update(points => [...points, coords]);
    this.addGlobalPointerListeners();
  }

  private handlePointerMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing()) return;
    if (event.cancelable) event.preventDefault();

    const mainCtx = this.mainContext();
    const memCanvas = this.memoryCanvasElement;
    if (!mainCtx || !memCanvas) return;

    const coords = this.getCoordinates(event);
    if (!coords) return;

    this.currentPoints.update(points => [...points, coords]);

    mainCtx.clearRect(0, 0, this.width(), this.height());
    mainCtx.drawImage(memCanvas, 0, 0);
    this.drawSmoothPoints(mainCtx, this.currentPoints());
  }

  private handlePointerUp(event?: MouseEvent | TouchEvent): void {
    if (!this.isDrawing()) return;
    this.removeGlobalPointerListeners();

    const mainCtx = this.mainContext();
    const memCtx = this.memoryContext();
    const mainCanvasEl = this.mainCanvasRef().nativeElement;

    if (!mainCtx || !memCtx || !this.memoryCanvasElement) {
      this.isDrawing.set(false);
      this.currentPoints.set([]);
      return;
    }

    if (this.currentPoints().length > 0) {
      mainCtx.clearRect(0, 0, this.width(), this.height());
      mainCtx.drawImage(this.memoryCanvasElement, 0, 0);
      this.drawSmoothPoints(mainCtx, this.currentPoints());
    }

    memCtx.clearRect(0, 0, this.width(), this.height());
    memCtx.drawImage(mainCanvasEl, 0, 0);

    this.isDrawing.set(false);
    this.currentPoints.set([]);
  }

  private drawSmoothPoints(ctx: CanvasRenderingContext2D, points: Point[]): void {
    if (points.length === 0) return;

    ctx.strokeStyle = this.penColor();
    ctx.lineWidth = this.lineWidth();
    ctx.fillStyle = this.penColor();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length < 3) {
      const b = points[0];
      ctx.beginPath();
      const radius = points.length === 1 ? this.lineWidth() / 2 : this.lineWidth() / 2.5;
      ctx.arc(b.x, b.y, Math.max(0.5, radius) , 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let i;
    for (i = 1; i < points.length - 2; i++) {
      const c = (points[i].x + points[i + 1].x) / 2;
      const d = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    ctx.stroke();
    ctx.closePath();
  }

  private getCoordinates(event: MouseEvent | TouchEvent): Point | null {
    const canvas = this.mainCanvasRef()?.nativeElement;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent) {
      const touch = event.touches.length > 0 ? event.touches[0] :
        (event.changedTouches.length > 0 ? event.changedTouches[0] : null);
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else { return null; }
    } else { return null; }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  clear(): void {
    const mainCtx = this.mainContext();
    const memCtx = this.memoryContext();
    if (mainCtx) {
      mainCtx.clearRect(0, 0, this.width(), this.height());
      mainCtx.fillStyle = this.backgroundColor();
      mainCtx.fillRect(0, 0, this.width(), this.height());
    }
    if (memCtx) {
      memCtx.clearRect(0, 0, this.width(), this.height());
    }
    this.currentPoints.set([]);
    this.signatureCleared.emit();
  }

  save(): void {
    const memCanvas = this.memoryCanvasElement;
    if (!memCanvas) {
      console.warn('Memory canvas not available for saving.');
      return;
    }
    if (this.isCanvasEffectivelyBlank(memCanvas)) {
      console.warn('Canvas is effectively empty or contains only background. Nothing to save.');
      return;
    }
    const dataUrl = memCanvas.toDataURL('image/png');
    this.signatureSaved.emit(dataUrl);
  }

  private isCanvasEffectivelyBlank(canvas: HTMLCanvasElement): boolean {
    if (!canvas) return true;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return true;
    tempCtx.fillStyle = this.backgroundColor();
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    return canvas.toDataURL() === tempCanvas.toDataURL();
  }

  handleEscapeKey(event: KeyboardEvent): void {
    this.clear();
  }
}
