import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostBinding,
  NgZone,
  ChangeDetectorRef,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges, inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'emr-overlay-scrollbar',
  imports: [],
  templateUrl: './overlay-scrollbar.component.html',
  styleUrl: './overlay-scrollbar.component.scss',
  host: {
    'class': 'emr-overlay-scrollbar'
  }
})
export class OverlayScrollbarComponent implements AfterViewInit, OnDestroy, OnChanges {
  private _platformId = inject(PLATFORM_ID);

  @ViewChild('scrollableContent', { static: true }) scrollableContentRef!: ElementRef<HTMLElement>;
  @ViewChild('scrollTrack', { static: true }) scrollTrackRef!: ElementRef<HTMLElement>;
  @ViewChild('scrollThumb', { static: true }) scrollThumbRef!: ElementRef<HTMLElement>;

  @Input() scrollbarWidth: string = '8px'; // Ширина скроллбара
  @Input() autoHide: boolean = true; // Автоматически скрывать скроллбар

  private scrollRatio: number = 1;
  private isDragging: boolean = false;
  private dragStartY: number = 0;
  private dragStartScrollTop: number = 0;
  private isHovering: boolean = false;
  private hideTimeout: any = null;
  private isVisible: boolean = !this.autoHide; // Начальное состояние видимости

  // Привязка класса к хосту для управления видимостью
  @HostBinding('class.scrollbar-visible') get scrollbarVisible() {
    return this.isVisible;
  }
  @HostBinding('class.scrollbar-interactive') get scrollbarInteractive() {
    return this.isHovering || this.isDragging;
  }

  // Привязка слушателей событий напрямую к хост-элементу не всегда надежна для mouseleave/enter,
  // так как события могут всплывать от дочерних элементов. Используем Renderer2.
  private unlistenMouseEnter!: () => void;
  private unlistenMouseLeave!: () => void;

  private resizeObserver!: ResizeObserver;
  private mutationObserver!: MutationObserver;

  // Слушатели для перетаскивания (глобальные, т.к. мышь может выйти за пределы элемента)
  private boundOnMouseMove = this.onMouseMove.bind(this);
  private boundOnMouseUp = this.onMouseUp.bind(this);

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    if (changes['autoHide']) {
      this.isVisible = !this.autoHide;
      this.updateVisibilityState(); // Обновить видимость сразу
      this.cdRef.markForCheck(); // Пометить для проверки изменений
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    const scrollableElement = this.scrollableContentRef.nativeElement;
    const hostElement = this.elRef.nativeElement;

    // Используем NgZone.runOutsideAngular для событий, которые могут часто срабатывать,
    // чтобы не запускать постоянно обнаружение изменений Angular.
    this.zone.runOutsideAngular(() => {
      scrollableElement.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

      // Обработчики для autoHide
      this.unlistenMouseEnter = this.renderer.listen(hostElement, 'mouseenter', this.onHostMouseEnter.bind(this));
      this.unlistenMouseLeave = this.renderer.listen(hostElement, 'mouseleave', this.onHostMouseLeave.bind(this));

      // Наблюдатели за размерами и контентом
      this.resizeObserver = new ResizeObserver(this.updateScrollbar.bind(this));
      this.resizeObserver.observe(scrollableElement);
      this.resizeObserver.observe(hostElement); // Наблюдаем и за хостом

      this.mutationObserver = new MutationObserver(this.updateScrollbar.bind(this));
      this.mutationObserver.observe(scrollableElement, { childList: true, subtree: true, characterData: true });
    });

    // Первоначальный расчет и установка стилей
    this.updateScrollbar();
    this.applyScrollbarStyles(); // Применяем стили на основе Input
    this.updateVisibilityState(); // Устанавливаем начальную видимость
    this.cdRef.detectChanges(); // Запускаем обнаружение изменений один раз
  }

  ngOnDestroy(): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    // Очистка слушателей и наблюдателей
    const scrollableElement = this.scrollableContentRef?.nativeElement;
    if (scrollableElement) {
      // Удаляем слушатель скролла (если он был добавлен)
      // this.zone не нужен здесь, т.к. мы внутри Angular контекста при уничтожении
      scrollableElement.removeEventListener('scroll', this.onScroll.bind(this));
    }

    if (this.unlistenMouseEnter) this.unlistenMouseEnter();
    if (this.unlistenMouseLeave) this.unlistenMouseLeave();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    // Удаляем глобальные слушатели, если они остались активны
    this.removeDragListeners();
    this.clearHideTimeout(); // Очищаем таймаут скрытия
  }

  // --- Обработчики событий ---

  private onScroll(): void {
    this.updateThumbPosition();
    if (this.autoHide) {
      this.showScrollbarTemporarily();
    }
  }

  private onHostMouseEnter(): void {
    this.isHovering = true;
    if (this.autoHide) {
      this.clearHideTimeout(); // Отменяем скрытие, если оно было запланировано
      this.isVisible = this.hasScroll(); // Показываем только если есть скролл
      this.updateVisibilityState();
    }
    this.cdRef.markForCheck();
  }

  private onHostMouseLeave(): void {
    this.isHovering = false;
    if (this.autoHide && !this.isDragging) { // Не скрывать, если идет перетаскивание
      this.hideScrollbarAfterDelay();
    }
    // Нужно запустить change detection вручную
    this.cdRef.markForCheck();
  }

  // --- Логика перетаскивания ---

  onThumbMouseDown(event: MouseEvent): void {
    // Предотвращаем выделение текста при перетаскивании
    event.preventDefault();
    event.stopPropagation(); // Останавливаем всплытие, чтобы не сработали другие клики

    this.isDragging = true;
    this.dragStartY = event.clientY;
    this.dragStartScrollTop = this.scrollableContentRef.nativeElement.scrollTop;

    // Добавляем глобальные слушатели для отслеживания движения мыши вне компонента
    // Делаем это внутри зоны, чтобы обработчики могли обновлять состояние Angular
    this.zone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.boundOnMouseMove, { passive: false }); // passive: false чтобы использовать preventDefault если надо
      document.addEventListener('mouseup', this.boundOnMouseUp, { passive: true });
    });

    // Обновляем состояние (например, класс для hover-эффекта во время перетаскивания)
    this.zone.run(() => this.cdRef.markForCheck());
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    // Предотвращаем стандартное поведение (например, выделение текста)
    event.preventDefault();

    const scrollableElement = this.scrollableContentRef.nativeElement;
    const trackElement = this.scrollTrackRef.nativeElement;

    const deltaY = event.clientY - this.dragStartY;
    const trackHeight = trackElement.clientHeight;
    const contentScrollHeight = scrollableElement.scrollHeight;

    // Преобразуем смещение мыши в смещение скролла
    const scrollDelta = (deltaY / trackHeight) * contentScrollHeight;
    const newScrollTop = this.dragStartScrollTop + scrollDelta;

    // Устанавливаем новое значение scrollTop
    scrollableElement.scrollTop = newScrollTop;

    // Обновление позиции ползунка не требуется явно, т.к. сработает событие 'scroll'
    // Но если 'scroll' не срабатывает мгновенно, можно вызвать updateThumbPosition()
    // this.updateThumbPosition(); // Раскомментировать если есть задержки
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.removeDragListeners();

      // Если мышь все еще над компонентом, не скрываем сразу
      if (this.autoHide && !this.isHovering) {
        this.hideScrollbarAfterDelay();
      }

      this.cdRef.markForCheck();
    }
  }

  private removeDragListeners(): void {
    document.removeEventListener('mousemove', this.boundOnMouseMove);
    document.removeEventListener('mouseup', this.boundOnMouseUp);
  }

  private updateScrollbar(): void {
    console.log('updateScrollbar');

    const scrollableElement = this.scrollableContentRef.nativeElement;
    const thumbElement = this.scrollThumbRef.nativeElement;
    const trackElement = this.scrollTrackRef.nativeElement;

    const clientHeight = scrollableElement.clientHeight;
    const scrollHeight = scrollableElement.scrollHeight;
    const trackHeight = trackElement.clientHeight; // Высота видимой части трека

    // Рассчитываем соотношение видимой области к общей высоте контента
    this.scrollRatio = clientHeight / scrollHeight;

    // Устанавливаем высоту ползунка
    // Минимальная высота ползунка для удобства
    const minThumbHeight = 20; // px
    const thumbHeight = Math.max(trackHeight * this.scrollRatio, minThumbHeight);

    // Обновляем видимость скроллбара (показываем/скрываем трек)
    const shouldBeVisible = this.hasScroll();

    if (!this.autoHide || this.isHovering) {
      this.isVisible = shouldBeVisible;
    } else {
      if (!shouldBeVisible) {
        this.isVisible = false;
      }
    }

    if (shouldBeVisible) {
      thumbElement.style.height = `${thumbHeight}px`;
      // Обновляем позицию ползунка
      this.updateThumbPosition();
    }

    this.updateVisibilityState();
    this.cdRef.markForCheck();
  }

  private updateThumbPosition(): void {
    const scrollableElement = this.scrollableContentRef.nativeElement;
    const thumbElement = this.scrollThumbRef.nativeElement;
    const trackElement = this.scrollTrackRef.nativeElement;

    const scrollTop = scrollableElement.scrollTop;
    const scrollHeight = scrollableElement.scrollHeight;
    const clientHeight = scrollableElement.clientHeight;
    const trackHeight = trackElement.clientHeight;
    const thumbHeight = thumbElement.offsetHeight; // Используем реальную высоту ползунка

    // Максимальная позиция scrollTop
    const maxScrollTop = scrollHeight - clientHeight;
    // Максимальная позиция ползунка внутри трека
    const maxThumbTop = trackHeight - thumbHeight;

    // Рассчитываем позицию ползунка пропорционально
    // Проверяем maxScrollTop > 0 чтобы избежать деления на ноль если скролла нет
    const thumbTop = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0;

    // Применяем позицию через transform для лучшей производительности
    thumbElement.style.transform = `translateY(${thumbTop}px)`;
  }

  private applyScrollbarStyles(): void {
    const trackElement = this.scrollTrackRef?.nativeElement;
    const thumbElement = this.scrollThumbRef?.nativeElement;

    if (trackElement && thumbElement) {
      // this.renderer.setStyle(trackElement, 'background-color', this.trackColor);
      this.renderer.setStyle(trackElement, 'width', this.scrollbarWidth);
      // this.renderer.setStyle(thumbElement, 'background-color', this.thumbColor);
      this.renderer.setStyle(thumbElement, 'width', this.scrollbarWidth);
    }
  }

  private hasScroll(): boolean {
    const el = this.scrollableContentRef?.nativeElement;
    // Проверяем, есть ли вертикальный скролл (с небольшим запасом в 1px)
    return el ? el.scrollHeight > el.clientHeight + 1 : false;
  }

  // --- Логика AutoHide ---
  private showScrollbarTemporarily(): void {
    if (!this.autoHide || this.isHovering || this.isDragging) return; // Не нужно, если мышь над элементом или идет перетаскивание

    this.clearHideTimeout();
    this.isVisible = this.hasScroll(); // Показываем, только если есть скролл
    this.updateVisibilityState();
    this.hideScrollbarAfterDelay();

    // Уведомляем Angular
    this.zone.run(() => this.cdRef.markForCheck());
  }

  private hideScrollbarAfterDelay(): void {
    this.clearHideTimeout();
    this.zone.runOutsideAngular(() => { // Таймаут лучше выносить из зоны
      this.hideTimeout = setTimeout(() => {
        this.isVisible = false;
        this.updateVisibilityState();
        // Уведомляем Angular после выполнения таймаута
        this.zone.run(() => this.cdRef.markForCheck());
      }, 1500); // Задержка перед скрытием (1.5 секунды)
    });
  }

  private clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private updateVisibilityState(): void {
  }
}
