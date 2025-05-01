import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageComponent } from '@meta/page/page.component';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
  imports: [
    FormsModule,
    PageComponent,
    PageTitleDirective,
  ],
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss'
})
export class TypographyComponent {

}
