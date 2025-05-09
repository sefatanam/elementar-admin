import { Component } from '@angular/core';
import { TimezoneSelectComponent } from '@elementar-ui/components/timezone-select';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-basic-timezone-select-example',
  imports: [
    TimezoneSelectComponent,
    MatFormField,
    MatLabel
  ],
  templateUrl: './basic-timezone-select-example.component.html',
  styleUrl: './basic-timezone-select-example.component.scss'
})
export class BasicTimezoneSelectExampleComponent {

}
