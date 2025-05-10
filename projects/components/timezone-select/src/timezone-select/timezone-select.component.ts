import {
  booleanAttribute, ChangeDetectionStrategy,
  Component, computed, effect, ElementRef,
  forwardRef,
  inject,
  input,
  LOCALE_ID, model,
  OnInit,
  signal, untracked
} from '@angular/core';
import { TimezoneGroup, TimezoneUtils } from '../timezone-utils';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  AbstractControl,
  ControlValueAccessor, FormGroupDirective, FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl, NgForm
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

let nextId = 0;


@Component({
  selector: 'emr-timezone-select',
  exportAs: 'emrTimezoneSelect',
  imports: [
    MatSelect,
    MatOption,
    FormsModule,
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TimezoneSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timezone-select.component.html',
  styleUrl: './timezone-select.component.scss',
  host: {
    'class': 'emr-timezone-select'
  }
})
// @ts-ignore
export class TimezoneSelectComponent implements OnInit, MatFormFieldControl<any>, ControlValueAccessor {
  protected localeId = inject(LOCALE_ID);
  private _parentForm = inject(NgForm, {
    optional: true,
  });
  private _parentFormGroup = inject(FormGroupDirective, {
    optional: true,
  });
  protected timezoneGroups = signal<TimezoneGroup[]>(
    TimezoneUtils.getLocalizedAll(this.localeId, true)
  );
  ngControl = inject(NgControl, { optional: true, self: true });
  readonly stateChanges = new Subject<void>();
  readonly touched = signal(false);

  readonly controlType = 'emr-timezone-select';
  readonly id = `emr-timezone-select-${nextId++}`;
  readonly _userAriaDescribedBy = input<string>('', { alias: 'aria-describedby' });
  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly _value = model<string | null>(null, { alias: 'value' });
  onChange = (_: any) => {};
  onTouched = () => {};

  private readonly _focused = signal(false);
  private readonly _disabledByCva = signal(false);
  private readonly _disabled = computed(() => this._disabledByInput() || this._disabledByCva());
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  get focused(): boolean {
    return this._focused();
  }

  get empty() {
    return this._value()?.trim() === '';
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get userAriaDescribedBy() {
    return this._userAriaDescribedBy();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    return this._required();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get value(): string | null {
    return this._value();
  }

  get errorState(): boolean {
    // @ts-ignore
    return this.ngControl?.invalid && this.touched();
  }

  constructor() {
    if (this.ngControl != null) {
      // @ts-ignore
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      // Read signals to trigger effect.
      this._placeholder();
      this._required();
      this._disabled();
      this._focused();
      // Propagate state changes.
      untracked(() => this.stateChanges.next());
    });
  }

  ngOnInit() {
    // console.log(this.timezoneGroups());
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn() {
    if (!this._focused()) {
      this._focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched.set(true);
      this._focused.set(false);
      this.onTouched();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    // const controlElement = this._elementRef.nativeElement.querySelector(
    //   '.example-tel-input-container',
    // )!;
    // controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    // if (this.parts.controls.subscriber.valid) {
    //   this._focusMonitor.focusVia(this.subscriberInput(), 'program');
    // } else if (this.parts.controls.exchange.valid) {
    //   this._focusMonitor.focusVia(this.subscriberInput(), 'program');
    // } else if (this.parts.controls.area.valid) {
    //   this._focusMonitor.focusVia(this.exchangeInput(), 'program');
    // } else {
    //   this._focusMonitor.focusVia(this.areaInput(), 'program');
    // }
  }

  writeValue(timezone: string | null): void {
    this._updateValue(timezone);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  private _updateValue(value: string | null) {
    const current = this._value();

    if (current === value) {
      return;
    }

    this._value.set(value);
  }
}
