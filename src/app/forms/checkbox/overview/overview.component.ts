import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import {
  BasicCheckboxesExampleComponent
} from '../_examples/basic-checkboxes-example/basic-checkboxes-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
    selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    BasicCheckboxesExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective
  ],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
