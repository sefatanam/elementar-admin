import {
  booleanAttribute, ChangeDetectionStrategy,
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

  color = input.required<TinyColor>();
  isVertical = input(false, {
    transform: booleanAttribute
  });

  readonly colorChange = output<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color'] && changes['color'].previousValue !== changes['color'].currentValue) {
      this.changePointerPosition(this.color().getAlpha());
      this._setPointerBgColor();
    }
  }

  // @ts-ignore
  movePointer({ x, y, height, width }): void {
    const alpha = this.isVertical() ? y / height : x / width;
    this.changePointerPosition(alpha);
    const newColor = this.color().clone().setAlpha(alpha);
    this._renderer.setStyle(this._pointerBg().nativeElement, 'background-color', newColor.toRgbString());
    this.colorChange.emit(newColor);
  }

  get gradient(): string {
    const rgba = this.color().toRgb();
    const orientation = this.isVertical() ? 'bottom' : 'right';
    return `linear-gradient(to ${orientation}, rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0) 0%, rgb(${rgba.r}, ${rgba.g}, ${rgba.b}) 100%)`;
  }

  /**
   * hue value is in range from 0 to 360°
   */
  private changePointerPosition(alpha: number): void {
    const x = alpha * 100;
    const orientation = this.isVertical() ? 'top' : 'left';
    this._renderer.setStyle(this._pointer().nativeElement, orientation, `${x}%`);
  }

  private _setPointerBgColor() {
    this._renderer.setStyle(
      this._pointerBg().nativeElement, 'background-color', this.color().toRgbString()
    );
  }
}
