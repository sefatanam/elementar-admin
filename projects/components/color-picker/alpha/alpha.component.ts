import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, input,
  OnChanges, output,
  Renderer2, SimpleChanges,
  viewChild
} from '@angular/core';
import { BaseComponent } from '../base.component';
import { NgStyle } from '@angular/common';
import { TinyColor } from '@ctrl/tinycolor';

@Component({
  selector: 'emr-alpha',
  exportAs: 'emrAlpha',
  imports: [
    NgStyle
  ],
  templateUrl: './alpha.component.html',
  styleUrl: './alpha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-alpha'
  }
})
export class AlphaComponent extends BaseComponent implements OnChanges {
  private _renderer = inject(Renderer2);
  private _pointer = viewChild.required<ElementRef>('pointer');
  private _pointerBg = viewChild.required<ElementRef>('pointerBg');

  tinyColor = input.required<TinyColor>();

  readonly colorChange = output<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tinyColor'] && changes['tinyColor'].previousValue !== changes['tinyColor'].currentValue) {
      this.changePointerPosition(this.tinyColor().getAlpha());
      this._setPointerBgColor();
    }
  }

  // @ts-ignore
  movePointer({ x, y, height, width }): void {
    const alpha = x / width;
    this.changePointerPosition(alpha);
    const newColor = this.tinyColor().clone().setAlpha(alpha);
    this._renderer.setStyle(this._pointerBg().nativeElement, 'background-color', newColor.toRgbString());
    this.colorChange.emit(newColor);
  }

  get gradient(): string {
    const rgba = this.tinyColor().toRgb();
    const orientation = 'right';
    return `linear-gradient(to ${orientation}, rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0) 0%, rgb(${rgba.r}, ${rgba.g}, ${rgba.b}) 100%)`;
  }

  /**
   * hue value is in range from 0 to 360°
   */
  private changePointerPosition(alpha: number): void {
    const x = alpha * 100;
    const orientation = 'left';
    this._renderer.setStyle(this._pointer().nativeElement, orientation, `${x}%`);
  }

  private _setPointerBgColor() {
    this._renderer.setStyle(
      this._pointerBg().nativeElement, 'background-color', this.tinyColor().toRgbString()
    );
  }
}
