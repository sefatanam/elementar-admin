import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'password-strength',
    loadChildren: () => import('./password-strength/password-strength.module').then(m => m.PasswordStrengthModule)
  },
  {
    path: 'autocomplete',
    loadChildren: () => import('./autocomplete/autocomplete.module').then(m => m.AutocompleteModule)
  },
  {
    path: 'buttons',
    loadChildren: () => import('./buttons/buttons.module').then(m => m.ButtonsModule)
  },
  {
    path: 'input',
    loadChildren: () => import('./input/input.module').then(m => m.InputModule)
  },
  {
    path: 'phone-input',
    loadChildren: () => import('./phone-input/phone-input.module').then(m => m.PhoneInputModule)
  },
  {
    path: 'slide-toggle',
    loadChildren: () => import('./slide-toggle/slide-toggle.module').then(m => m.SlideToggleModule)
  },
  {
    path: 'checkbox',
    loadChildren: () => import('./checkbox/checkbox.module').then(m => m.CheckboxModule)
  },
  {
    path: 'radio',
    loadChildren: () => import('./radio/radio.module').then(m => m.RadioModule)
  },
  {
    path: 'select',
    loadChildren: () => import('./select/select.module').then(m => m.SelectModule)
  },
  {
    path: 'segmented',
    loadChildren: () => import('./segmented/segmented.module').then(m => m.SegmentedModule)
  },
  {
    path: 'pin-input',
    loadChildren: () => import('./pin-input/pin-input.module').then(m => m.PinInputModule)
  },
  {
    path: 'button-toggle',
    loadChildren: () => import('./button-toggle/button-toggle.module').then(m => m.ButtonToggleModule)
  },
  {
    path: 'number-input',
    loadChildren: () => import('./number-input/number-input.module').then(m => m.NumberInputModule)
  },
  {
    path: 'country-select',
    loadChildren: () => import('./country-select/country-select.module').then(m => m.CountrySelectModule)
  },
  {
    path: 'timezone-select',
    loadChildren: () => import('./timezone-select/timezone-select.module').then(m => m.TimezoneSelectModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
