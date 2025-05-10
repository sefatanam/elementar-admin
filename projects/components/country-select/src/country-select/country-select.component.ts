import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  forwardRef,
  inject,
  signal,
  computed,
  effect,
  model,
  input,
  InputSignal,
  ModelSignal,
  DestroyRef, viewChild, Renderer2,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectChange, MatSelectTrigger } from '@angular/material/select';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { toSignal } from '@angular/core/rxjs-interop';
import { Country } from '../country.interface';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'emr-country-select',
  exportAs: 'emrCountrySelect',
  templateUrl: './country-select.component.html',
  styleUrl: './country-select.component.scss',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => CountrySelectComponent),
    },
  ],
  host: {
    'class': 'emr-country-select',
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  imports: [
    MatOption,
    MatIcon,
    MatIconButton,
    MatSelect,
    MatSelectTrigger,
    ReactiveFormsModule
  ]
})
export class CountrySelectComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string | null>
{
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);

  static nextId = 0;
  id = `emr-country-select-${CountrySelectComponent.nextId++}`;

  readonly stateChanges = new Subject<void>();
  controlType = 'emr-country-select';
  autofilled?: boolean;

  private readonly _valueSignal = signal<string | null>(null);
  private readonly _focusedSignal = signal(false);
  private _touched = false;

  protected placeholderInputSignal: InputSignal<string> = input<string>('', { alias: 'placeholder' });
  protected isRequiredSignal: ModelSignal<boolean> = model(false, { alias: 'required' });
  protected isDisabledSignal: ModelSignal<boolean> = model(false, { alias: 'disabled' });

  readonly searchCtrl = new FormControl('');
  private readonly searchText = toSignal(this.searchCtrl.valueChanges.pipe(startWith('')), { initialValue: '' });

  readonly internalCountries: Country[] = [
    { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
    { code: 'AX', name: 'Åland Islands', flag: '🇦🇽' },
    { code: 'AL', name: 'Albania', flag: '🇦🇱' },
    { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
    { code: 'AS', name: 'American Samoa', flag: '🇦🇸' },
    { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
    { code: 'AO', name: 'Angola', flag: '🇦🇴' },
    { code: 'AI', name: 'Anguilla', flag: '🇦🇮' },
    { code: 'AQ', name: 'Antarctica', flag: '🇦🇶' },
    { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
    { code: 'AW', name: 'Aruba', flag: '🇦🇼' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
    { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
    { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
    { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
    { code: 'BM', name: 'Bermuda', flag: '🇧🇲' },
    { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
    { code: 'BO', name: 'Bolivia (Plurinational State of)', flag: '🇧🇴' },
    { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba', flag: '🇧🇶' },
    { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
    { code: 'BV', name: 'Bouvet Island', flag: '🇧🇻' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'IO', name: 'British Indian Ocean Territory', flag: '🇮🇴' },
    { code: 'BN', name: 'Brunei Darussalam', flag: '🇧🇳' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
    { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
    { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
    { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾' },
    { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
    { code: 'TD', name: 'Chad', flag: '🇹🇩' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'CX', name: 'Christmas Island', flag: '🇨🇽' },
    { code: 'CC', name: 'Cocos (Keeling) Islands', flag: '🇨🇨' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
    { code: 'CG', name: 'Congo', flag: '🇨🇬' },
    { code: 'CD', name: 'Congo (Democratic Republic of the)', flag: '🇨🇩' },
    { code: 'CK', name: 'Cook Islands', flag: '🇨🇰' },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
    { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
    { code: 'CW', name: 'Curaçao', flag: '🇨🇼' },
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
    { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
    { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
    { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
    { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
    { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
    { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)', flag: '🇫🇰' },
    { code: 'FO', name: 'Faroe Islands', flag: '🇫🇴' },
    { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'GF', name: 'French Guiana', flag: '🇬🇫' },
    { code: 'PF', name: 'French Polynesia', flag: '🇵🇫' },
    { code: 'TF', name: 'French Southern Territories', flag: '🇹🇫' },
    { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
    { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
    { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    { code: 'GI', name: 'Gibraltar', flag: '🇬🇮' },
    { code: 'GR', name: 'Greece', flag: '🇬🇷' },
    { code: 'GL', name: 'Greenland', flag: '🇬🇱' },
    { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
    { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵' },
    { code: 'GU', name: 'Guam', flag: '🇬🇺' },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
    { code: 'GG', name: 'Guernsey', flag: '🇬🇬' },
    { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
    { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
    { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
    { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
    { code: 'HM', name: 'Heard Island and McDonald Islands', flag: '🇭🇲' },
    { code: 'VA', name: 'Holy See', flag: '🇻🇦' },
    { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
    { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'IR', name: 'Iran (Islamic Republic of)', flag: '🇮🇷' },
    { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'IM', name: 'Isle of Man', flag: '🇮🇲' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'JE', name: 'Jersey', flag: '🇯🇪' },
    { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
    { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
    { code: 'KP', name: 'Korea (Democratic People\'s Republic of)', flag: '🇰🇵' },
    { code: 'KR', name: 'Korea (Republic of)', flag: '🇰🇷' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
    { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: 'LA', name: 'Lao People\'s Democratic Republic', flag: '🇱🇦' },
    { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
    { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
    { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
    { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
    { code: 'LY', name: 'Libya', flag: '🇱🇾' },
    { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
    { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
    { code: 'MO', name: 'Macao', flag: '🇲🇴' },
    { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
    { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'MT', name: 'Malta', flag: '🇲🇹' },
    { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
    { code: 'MQ', name: 'Martinique', flag: '🇲🇶' },
    { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
    { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'FM', name: 'Micronesia (Federated States of)', flag: '🇫🇲' },
    { code: 'MD', name: 'Moldova (Republic of)', flag: '🇲🇩' },
    { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
    { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
    { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
    { code: 'MS', name: 'Montserrat', flag: '🇲🇸' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
    { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
    { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
    { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
    { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'NC', name: 'New Caledonia', flag: '🇳🇨' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
    { code: 'NE', name: 'Niger', flag: '🇳🇪' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'NU', name: 'Niue', flag: '🇳🇺' },
    { code: 'NF', name: 'Norfolk Island', flag: '🇳🇫' },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
    { code: 'MP', name: 'Northern Mariana Islands', flag: '🇲🇵' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'PW', name: 'Palau', flag: '🇵🇼' },
    { code: 'PS', name: 'Palestine, State of', flag: '🇵🇸' },
    { code: 'PA', name: 'Panama', flag: '🇵🇦' },
    { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'PN', name: 'Pitcairn', flag: '🇵🇳' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
    { code: 'RE', name: 'Réunion', flag: '🇷🇪' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'RU', name: 'Russian Federation', flag: '🇷🇺' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'BL', name: 'Saint Barthélemy', flag: '🇧🇱' },
    { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha', flag: '🇸🇭' },
    { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
    { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
    { code: 'MF', name: 'Saint Martin (French part)', flag: '🇲🇫' },
    { code: 'PM', name: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
    { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
    { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
    { code: 'ST', name: 'Sao Tome and Principe', flag: '🇸🇹' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
    { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
    { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'SX', name: 'Sint Maarten (Dutch part)', flag: '🇸🇽' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
    { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands', flag: '🇬🇸' },
    { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
    { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen', flag: '🇸🇯' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'SY', name: 'Syrian Arab Republic', flag: '🇸🇾' },
    { code: 'TW', name: 'Taiwan, Province of China', flag: '🇹🇼' },
    { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
    { code: 'TZ', name: 'Tanzania, United Republic of', flag: '🇹🇿' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
    { code: 'TG', name: 'Togo', flag: '🇹🇬' },
    { code: 'TK', name: 'Tokelau', flag: '🇹🇰' },
    { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
    { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
    { code: 'TC', name: 'Turks and Caicos Islands', flag: '🇹🇨' },
    { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'GB', name: 'United Kingdom of Great Britain and Northern Ireland', flag: '🇬🇧' },
    { code: 'US', name: 'United States of America', flag: '🇺🇸' },
    { code: 'UM', name: 'United States Minor Outlying Islands', flag: '🇺🇲' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
    { code: 'VE', name: 'Venezuela (Bolivarian Republic of)', flag: '🇻🇪' },
    { code: 'VN', name: 'Viet Nam', flag: '🇻🇳' },
    { code: 'VG', name: 'Virgin Islands (British)', flag: '🇻🇬' },
    { code: 'VI', name: 'Virgin Islands (U.S.)', flag: '🇻🇮' },
    { code: 'WF', name: 'Wallis and Futuna', flag: '🇼🇫' },
    { code: 'EH', name: 'Western Sahara', flag: '🇪🇭' },
    { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
    { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  ];

  readonly filteredCountries = computed(() => this._filterCountries(this.searchText()));
  readonly selectedCountryDisplay = computed(() => {
    return this.internalCountries.find(c => c.code === this._valueSignal());
  });

  readonly matSelect = viewChild.required<MatSelect>('matSelect');
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private readonly fm = inject(FocusMonitor);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private onChangeFn: (value: string | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.destroyRef.onDestroy(() => {
      this.fm.stopMonitoring(this.elRef.nativeElement);
      this.stateChanges.complete();
    });

    effect(() => {
      this.onChangeFn(this._valueSignal());
    });

    effect(() => {
      this._valueSignal();
      this._focusedSignal();
      this.isRequiredSignal();
      this.isDisabledSignal();
      this.placeholderInputSignal();
      this.ngControl?.control?.status;
      this.stateChanges.next();
    });

    effect(() => {
      if (this.isDisabledSignal()) {
        this.searchCtrl.disable({ emitEvent: false });
      } else {
        this.searchCtrl.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    if (this.ngControl?.control) {
      const control = this.ngControl.control;

      if (control.validator) {
        const validator = control.validator({} as any);
        if (validator && validator['required']) {
          this.isRequiredSignal.set(true);
        }
      }

      this.isDisabledSignal.set(control.disabled);
    }

    const formFieldElement = this._elementRef.nativeElement.closest('.mat-mdc-form-field');

    if (formFieldElement) {
      this._renderer.addClass(formFieldElement, 'mat-mdc-form-field-type-mat-select');
    }
  }

  ngOnDestroy(): void {
  }

  get value(): string | null {
    return this._valueSignal();
  }
  set value(val: string | null) {
    this._valueSignal.set(val);
  }

  get focused(): boolean {
    return this._focusedSignal();
  }

  get placeholder(): string {
    return this.placeholderInputSignal();
  }
  set placeholder(plh: string) {
    this.stateChanges.next();
  }

  get required(): boolean {
    return this.isRequiredSignal();
  }
  set required(req: boolean) {
    this.isRequiredSignal.set(coerceBooleanProperty(req));
  }

  get disabled(): boolean {
    return this.isDisabledSignal();
  }
  set disabled(dis: boolean) {
    this.isDisabledSignal.set(coerceBooleanProperty(dis));
  }

  get empty(): boolean {
    return !this._valueSignal();
  }

  get shouldLabelFloat(): boolean {
    return this._focusedSignal() || !this.empty;
  }

  get errorState(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this._touched));
  }

  get touched(): boolean {
    return this._touched;
  }

  setDescribedByIds(ids: string[]): void {
    const controlElement = this.elRef.nativeElement.querySelector('.select-trigger');

    if (controlElement) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick(): void {
    if (this.disabled) {
      return;
    }

    this._focusedSignal.set(true);
    this.matSelect().onContainerClick();
  }

  writeValue(value: string | null): void {
    this._valueSignal.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = () => {
      this._touched = true;
      fn();
      this.stateChanges.next();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _filterCountries(searchText: string | null): Country[] {
    const filterValue = (searchText || '').toLowerCase();
    if (!filterValue) {
      return [...this.internalCountries];
    }
    return this.internalCountries.filter((country) =>
      country.name.toLowerCase().includes(filterValue) ||
      country.code.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChange(event: MatSelectChange): void {
    this.value = event.value;
    this.onTouchedFn();
  }

  clearSearch(event: MouseEvent): void {
    event.stopPropagation();
    this.searchCtrl.setValue('');
    this.searchInput().nativeElement.focus();
  }

  onSelectOpened(): void {
    setTimeout(() => {
      this.searchInput().nativeElement.focus();
    });
  }

  onSelectClosed(): void {
    this._focusedSignal.set(false);
    this.searchCtrl.setValue('');

    if (!this._touched) {
      this.onTouchedFn();
    }
  }
}
