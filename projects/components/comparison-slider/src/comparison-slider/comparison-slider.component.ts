import {
  Component,
  input,
  signal,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  effect,
  computed,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'emr-comparison-slider',
  exportAs: 'emrComparisonSlider',
  imports: [
    MatIcon,
  ],
  templateUrl: './comparison-slider.component.html',
  styleUrl: './comparison-slider.component.scss',
  host: {
    'class': 'emr-comparison-slider',
  }
})
export class ComparisonSliderComponent implements AfterViewInit, OnDestroy {
  initialPosition = input<number>(50);

  sliderPosition = signal<number>(0);
  isDragging = signal<boolean>(false);

  private sliderContainerRef = viewChild.required<ElementRef<HTMLDivElement>>('sliderContainer');
  private handleRef = viewChild.required<ElementRef<HTMLDivElement>>('handle');

  private containerRect = signal<DOMRect | null>(null);
  private unlistenMouseMove: (() => void) | null = null;
  private unlistenMouseUp: (() => void) | null = null;
  private unlistenTouchMove: (() => void) | null = null;
  private unlistenTouchEnd: (() => void) | null = null;

  private resizeObserver: ResizeObserver | null = null;

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor(private renderer: Renderer2) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    effect(() => {
      const initial = this.initialPosition();
      this.sliderPosition.set(Math.max(0, Math.min(100, initial)));
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.updateContainerRect();

      if (typeof ResizeObserver !== 'undefined' && this.sliderContainerRef() && this.sliderContainerRef().nativeElement) {
        this.resizeObserver = new ResizeObserver(() => {
          this.updateContainerRect();
        });
        this.resizeObserver.observe(this.sliderContainerRef().nativeElement);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.removeGlobalListeners();
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }

  private updateContainerRect(): void {
    if (this.isBrowser && this.sliderContainerRef() && this.sliderContainerRef().nativeElement &&
      typeof this.sliderContainerRef().nativeElement.getBoundingClientRect === 'function') {
      this.containerRect.set(this.sliderContainerRef().nativeElement.getBoundingClientRect());
    } else {
      this.containerRect.set(null);
    }
  }

  handleLeftStyle = computed(() => `${this.sliderPosition()}%`);
  afterImageClipStyle = computed(() => `inset(0 ${100 - this.sliderPosition()}% 0 0)`);

  onMouseDown(event: MouseEvent): void {
    if (!this.isBrowser) return;

    this.isDragging.set(true);
    this.updateContainerRect();

    this.unlistenMouseMove = this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
    this.unlistenMouseUp = this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.isBrowser) return;

    if (event.touches.length === 1) {
      this.isDragging.set(true);
      this.updateContainerRect();

      this.unlistenTouchMove = this.renderer.listen('document', 'touchmove', this.onTouchMove.bind(this));
      this.unlistenTouchEnd = this.renderer.listen('document', 'touchend', this.onTouchEnd.bind(this));
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();
    this.updateSliderPosition(event.clientX);
  }

  private onTouchMove(event: TouchEvent): void {
    if (!this.isDragging() || event.touches.length !== 1) return;
    this.updateSliderPosition(event.touches[0].clientX);
  }

  private updateSliderPosition(clientX: number): void {
    const rect = this.containerRect();
    if (!rect) return; // Важная проверка, rect будет null в SSR

    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    this.sliderPosition.set(percentage);
  }

  private onMouseUp(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
      this.removeGlobalListeners();
    }
  }

  private onTouchEnd(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
      this.removeGlobalListeners();
    }
  }

  private removeGlobalListeners(): void {
    if (this.unlistenMouseMove) {
      this.unlistenMouseMove();
      this.unlistenMouseMove = null;
    }
    if (this.unlistenMouseUp) {
      this.unlistenMouseUp();
      this.unlistenMouseUp = null;
    }
    if (this.unlistenTouchMove) {
      this.unlistenTouchMove();
      this.unlistenTouchMove = null;
    }
    if (this.unlistenTouchEnd) {
      this.unlistenTouchEnd();
      this.unlistenTouchEnd = null;
    }
  }

  onContainerClick(event: MouseEvent): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.handleRef() && this.handleRef().nativeElement && this.handleRef().nativeElement.contains(event.target as Node) || this.isDragging()) {
      return;
    }

    this.updateContainerRect();
    this.updateSliderPosition(event.clientX);
    this.onMouseDown(event);
  }

  onDragStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
