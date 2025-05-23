import { Component } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import {
  BasicNotificationsExampleComponent
} from '../_examples/basic-notifications-example/basic-notifications-example.component';

@Component({
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    PlaygroundComponent,
    BasicNotificationsExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
