import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicDialogExampleComponent } from '../_examples/basic-dialog-example/basic-dialog-example.component';
import {
  DialogScrollableContentExampleComponent
} from '../_examples/dialog-scrollable-content-example/dialog-scrollable-content-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
  selector: 'app-overview',
  imports: [
    PlaygroundComponent,
    BasicDialogExampleComponent,
    DialogScrollableContentExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
