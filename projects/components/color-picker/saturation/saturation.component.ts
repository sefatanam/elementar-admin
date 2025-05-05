import {
  ChangeDetectionStrategy,
  Component, computed,
  ElementRef,
  inject, input,
  output,
  Renderer2,
  SimpleChanges,
  viewChild
} from '@angular/core';
import { BaseComponent } from '../base.component';
import { TinyColor } from '@ctrl/tinycolor';

@Component({
  selector: 'emr-saturation',
  exportAs: 'emrSaturation',
  templateUrl: './saturation.component.html',
  styleUrl: './saturation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-saturation'
  }
})
export class SaturationComponent extends BaseComponent {
  private _renderer = inject(Renderer2);
  readonly pointer = viewChild.required<ElementRef>('pointer');

  tinyColor = input.required<TinyColor>();

  readonly backgroundColor = computed(() => {
    if (!this.tinyColor()) {
      return '';
    }
    const hsl = this.tinyColor().toHsl();
    return `hsl(${hsl.h},${hsl.s * 100}%,50%)`;
  });

  readonly colorChange = output<any>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.backgroundColor());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tinyColor'] && changes['tinyColor'].previousValue !== changes['tinyColor'].currentValue) {
      const hsv = this.tinyColor().toHsv();
      this.changePointerPosition(hsv.s * 100, hsv.v * 100);
      this._setPointerBgColor()
    }
  }

  // @ts-ignore
  movePointer({ x, y, height, width }): void {
    const saturation = (x * 100) / width;
    const bright = -((y * 100) / height) + 100;
    this.changePointerPosition(saturation, bright);
    const hsv = this.tinyColor().toHsv();
    const newColor = new TinyColor(`hsv(${hsv.h}, ${saturation}, ${bright})`).setAlpha(1);
    this._renderer.setStyle(this.pointer().nativeElement, 'backgroundColor', newColor.toRgbString());
    this.colorChange.emit(newColor);
  }

  private changePointerPosition(x: number, y: number): void {
    const pointer = this.pointer();
    this._renderer.setStyle(pointer.nativeElement, 'top', `${100 - y}%`);
    this._renderer.setStyle(pointer.nativeElement, 'left', `${x}%`);
  }

  private _setPointerBgColor() {
    const newColor = this.tinyColor().clone().setAlpha(1);
    this._renderer.setStyle(this.pointer().nativeElement, 'background-color', newColor.toRgbString());
  }
}
