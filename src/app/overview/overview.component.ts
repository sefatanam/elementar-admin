import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';

@Component({
  imports: [
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardFooter
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
