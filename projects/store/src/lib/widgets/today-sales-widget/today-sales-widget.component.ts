import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'emr-today-sales-widget',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatButton
  ],
  templateUrl: './today-sales-widget.component.html',
  styleUrl: './today-sales-widget.component.scss'
})
export class TodaySalesWidgetComponent {

}
