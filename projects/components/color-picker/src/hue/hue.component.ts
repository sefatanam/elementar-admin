import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  inject, input,
  OnChanges, output,
  Renderer2, SimpleChanges,
  viewChild
} from '@angular/core';
import { BaseComponent } from '../base.component';
import { TinyColor } from '@ctrl/tinycolor';

@Component({
  selector: 'emr-hue',
  exportAs: 'emrHue',
  templateUrl: './hue.component.html',
  styleUrl: './hue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-hue',
  }
})
export class HueComponent extends BaseComponent implements OnChanges {
  private cdr = inject(ChangeDetectorRef);
  private _renderer = inject(Renderer2);
  readonly pointer = viewChild.required<ElementRef>('pointer');

  tinyColor = input.required<TinyColor>();

  readonly colorChange = output<TinyColor>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['tinyColor'] && changes['tinyColor'].previousValue !== changes['tinyColor'].currentValue) {
      this.changePointerPosition(changes['tinyColor'].currentValue);
      this._setPointerBgColor(changes['tinyColor'].currentValue);
    }
  }

  // @ts-ignore
  public movePointer({ x, y, height, width }): void {
    let h = (x / width) * 360;

    if (h >= 360) {
      h = 359;
    }

    const newColor = new TinyColor(`hsv(${h}, 100%, 100%)`).setAlpha(1);
    this.changePointerPosition(newColor);
    this._renderer.setStyle(this.pointer().nativeElement, 'background-color', newColor.toRgbString());
    this.colorChange.emit(newColor);
  }

  /**
   * hue value is in range from 0 to 360°
   */
  private changePointerPosition(tinyColor: TinyColor): void {
    const x = tinyColor.toHsl().h / 360 * 100;
    this._renderer.setStyle(this.pointer().nativeElement, 'left', `${x}%`);
  }

  private _setPointerBgColor(tinyColor: TinyColor) {
    const hsv = tinyColor.toHsv();
    const newColor = new TinyColor(`hsv(${hsv.h}, 100%, 100%)`).setAlpha(1);
    this._renderer.setStyle(this.pointer().nativeElement, 'background-color', newColor.toRgbString());
  }
}
