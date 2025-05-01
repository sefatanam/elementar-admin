import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicRadioExampleComponent } from '../_examples/basic-radio-example/basic-radio-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
    selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    BasicRadioExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective
  ],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
