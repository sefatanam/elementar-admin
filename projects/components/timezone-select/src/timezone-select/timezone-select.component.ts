import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { LocalizedTimezone, TimezoneGroup, TimezoneUtils } from '../timezone-utils';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'emr-timezone-select',
  exportAs: 'emrTimezoneSelect',
  imports: [
    MatSelect,
    MatOption,
  ],
  templateUrl: './timezone-select.component.html',
  styleUrl: './timezone-select.component.scss',
  host: {
    'class': 'emr-timezone-select'
  }
})
export class TimezoneSelectComponent implements OnInit {
  protected localeId = inject(LOCALE_ID);
  protected timezoneGroups = signal<TimezoneGroup[]>(
    TimezoneUtils.getLocalizedAll(this.localeId, true)
  );

  ngOnInit() {
    console.log(this.timezoneGroups());
  }

  private getAllIANATimezones(): string[] {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    } else {
      console.warn(
        "Intl.supportedValuesOf('timeZone') is not supported in this environment. " +
        "Consider using a library like 'moment-timezone' for a comprehensive list " +
        "or polyfilling Intl.supportedValuesOf."
      );
      return [];
    }
  }
}
