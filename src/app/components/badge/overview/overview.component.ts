import { Component } from '@angular/core';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicBadgesExampleComponent } from '../_examples/basic-badges-example/basic-badges-example.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';

@Component({
  imports: [
    PlaygroundComponent,
    BasicBadgesExampleComponent,
    PageComponent,
    PageContentDirective,
    PageTitleDirective
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
