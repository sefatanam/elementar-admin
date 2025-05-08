import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input, model,
  OnInit,
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
export class SaturationComponent extends BaseComponent implements OnInit {
  private _renderer = inject(Renderer2);
  readonly pointer = viewChild.required<ElementRef>('pointer');

  tinyColor = model.required<TinyColor>();
  colorFromHue = input<TinyColor | undefined | null>();

  private tmpColor!: TinyColor;
  private pointerColor!: TinyColor;

  readonly colorChange = output<any>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.tmpColor = this.tinyColor();
    this._renderer.setStyle(
      this.elementRef.nativeElement, 'background-color', this.getBackgroundColor(this.tinyColor())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tinyColor']) {
      const prevColor = changes['tinyColor'].previousValue;
      const currentColor = changes['tinyColor'].currentValue;

      if (prevColor?.equals(currentColor)) {
        return;
      }

      this.tmpColor = currentColor.clone();
      const hsv = this.tmpColor.toHsv();
      this._renderer.setStyle(
        this.elementRef.nativeElement, 'background-color', this.getBackgroundColor(this.tmpColor)
      );
      this.changePointerPosition(hsv.s * 100, hsv.v * 100);
      this._setPointerBgColor(this.tmpColor);
    }

    if (changes['colorFromHue']) {
      const prevColor = changes['colorFromHue'].previousValue;
      const currentColor = changes['colorFromHue'].currentValue;

      if (!currentColor || prevColor?.equals(currentColor)) {
        return;
      }

      const oldColorHsv = this.pointerColor ? this.pointerColor.toHsv() : this.tmpColor.toHsv();
      const newColorHsv = currentColor.toHsv();
      const newColor = new TinyColor({
        h: newColorHsv.h,
        s: oldColorHsv.s,
        v: oldColorHsv.v,
        a: 1,
        format: 'hsv'
      });
      this.tmpColor = newColor;
      this._renderer.setStyle(
        this.elementRef.nativeElement, 'background-color', this.getBackgroundColor(changes['colorFromHue'].currentValue)
      );
      this._setPointerBgColor(newColor);
      this.colorChange.emit(newColor);
    }
  }

  // @ts-ignore
  movePointer({ x, y, height, width }): void {
    const saturationX = (x * 100) / width;
    const bright = -((y * 100) / height) + 100;
    this.changePointerPosition(saturationX, bright);
    const hsv = this.tmpColor.toHsv();

    const normalizedX = Math.max(0, Math.min(x / width, 1));
    const normalizedY = Math.max(0, Math.min(y / height, 1));

    const saturation = normalizedX;
    const value = 1 - normalizedY; // Y=0 (верх) это Value=1, Y=height (низ) это Value=0

    // Убедимся, что hue в пределах 0-360
    const validHue = ((hsv.h % 360) + 360) % 360;
    const newColor = new TinyColor({
      h: validHue,
      s: saturation,
      v: value,
      a: 1,
      format: 'hsv'
    });
    this._renderer.setStyle(this.pointer().nativeElement, 'background-color', newColor.toRgbString());
    this.pointerColor = newColor;
    this.colorChange.emit(newColor);
  }

  private getBackgroundColor(tinyColor: TinyColor) {
    const hsl = tinyColor.toHsl();
    return new TinyColor({
      h: hsl.h,
      s: 1,
      l: 0.5,
      a: 1,
      format: 'hsl'
    }).toRgbString();
  }

  private changePointerPosition(x: number, y: number): void {
    const pointer = this.pointer();
    this._renderer.setStyle(pointer.nativeElement, 'top', `${100 - y}%`);
    this._renderer.setStyle(pointer.nativeElement, 'left', `${x}%`);
  }

  private _setPointerBgColor(tinyColor: TinyColor) {
    this._renderer.setStyle(this.pointer().nativeElement, 'background-color', tinyColor.toRgbString());
  }
}
