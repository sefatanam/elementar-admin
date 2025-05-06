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
    if (changes['tinyColor'] && changes['tinyColor'].previousValue !== changes['tinyColor'].currentValue) {
      this.tmpColor = changes['tinyColor'].currentValue;
      const hsv = this.tmpColor.toHsv();
      this.changePointerPosition(hsv.s * 100, hsv.v * 100);
      this._setPointerBgColor(this.tmpColor);
    }

    if (changes['colorFromHue'] && changes['colorFromHue'].previousValue !== changes['colorFromHue'].currentValue) {
      if (!changes['colorFromHue'].currentValue || !this.tinyColor()) {
        return;
      }

      const oldColorHsv = this.tmpColor.toHsv();
      const newColorHsv = changes['colorFromHue'].currentValue.toHsv();
      const newColor = new TinyColor({
        h: newColorHsv.h,
        s: oldColorHsv.s,
        v: oldColorHsv.v,
        a: 1,
        format: 'hsv'
      });
      this.tmpColor = newColor;
      this._renderer.setStyle(
        this.elementRef.nativeElement, 'background-color', this.getBackgroundColor(newColor)
      );
      this._setPointerBgColor(newColor);
      this.colorChange.emit(newColor);
    }
  }

  // @ts-ignore
  movePointer({ x, y, height, width }): void {
    const saturation = (x * 100) / width;
    const bright = -((y * 100) / height) + 100;
    this.changePointerPosition(saturation, bright);
    const hsv = this.tmpColor.toHsv();
    const newColor = new TinyColor({
      h: hsv.h,
      s: saturation > 0 ? saturation : 0.01,
      v: bright > 0 ? bright : 0.01,
      a: 1,
      format: 'hsv'
    });
    this._renderer.setStyle(this.pointer().nativeElement, 'background-color', newColor.toRgbString());
    this.tmpColor = newColor;
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
