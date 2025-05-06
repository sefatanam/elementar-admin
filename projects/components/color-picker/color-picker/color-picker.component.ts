import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, computed, effect,
  forwardRef,
  input,
  OnInit, output, signal
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { UltColorPickerChangeFormat } from '../properties';
import { SaturationComponent } from '../saturation/saturation.component';
import { HueComponent } from '../hue/hue.component';
import { AlphaComponent } from '../alpha/alpha.component';
import { TinyColor } from '@ctrl/tinycolor';

@Component({
  selector: 'emr-color-picker',
  exportAs: 'emrColorPicker',
  imports: [
    FormsModule,
    AlphaComponent,
    SaturationComponent,
    HueComponent
  ],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  host: {
    'class': 'emr-color-picker',
    '[class.is-disabled]': '_disabled()',
    '(contextmenu)': '_handleContextMenu($event)'
  }
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
  color = input<string>('');
  disabled = input(false, {
    alias: 'disabled',
    transform: booleanAttribute
  });
  changeFormat = input<UltColorPickerChangeFormat>('hex-alpha');

  readonly colorChange = output<string>();
  readonly rawColorChange = output<TinyColor>();

  private tmpColor!: TinyColor;

  protected _color = signal<TinyColor | null>(null);
  protected _colorFromHue = signal<TinyColor | undefined | null>(null);
  protected _disabled = signal(false);
  protected _tinyColor = computed<TinyColor>(() => {
    return this._color() as TinyColor;
  });
  protected alpha = signal(1);

  constructor() {
    effect(() => {
      // this._setColor(this.color());
    });
    effect(() => {
      this._disabled.set(this.disabled());
    });
  }

  ngOnInit() {
    this._setColor(this.color() || 'red');
    this.tmpColor = this._tinyColor().clone();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(color: string) {
    // this._setColor(color || 'red');
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: BooleanInput) {
    this._disabled.set(coerceBooleanProperty(isDisabled));
  }

  protected onSaturationColorChange(tinyColor: TinyColor) {
    this.tmpColor = tinyColor.clone();
    this.colorChange.emit(this.tmpColor.clone().setAlpha(this.alpha()).toRgbString());
    // this.rawColorChange.emit(tinyColor.clone().setAlpha(this.alpha()));
  }

  protected _handleContextMenu(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onAlphaChange(alpha: number) {
    this.alpha.set(alpha);
    const newColor = this.tmpColor.clone();
    newColor.setAlpha(alpha);
    console.log(newColor);
    this.colorChange.emit(newColor.toRgbString());
  }

  protected onHueColorChange(color: TinyColor) {
    this._colorFromHue.set(color);
  }

  private _setColor(color: string) {
    let tinyColor = new TinyColor(color);
    this._color.set(tinyColor);
  }
}
