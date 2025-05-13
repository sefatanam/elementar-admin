import { Component } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { PlaygroundComponent } from '@meta/playground/playground.component';
import { BasicDrawerExampleComponent } from '../_examples/basic-drawer-example/basic-drawer-example.component';
import {
  DrawerWithoutBackdropExampleComponent
} from '../_examples/drawer-without-backdrop-example/drawer-without-backdrop-example.component';

@Component({
  selector: 'app-overview',
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    PlaygroundComponent,
    BasicDrawerExampleComponent,
    DrawerWithoutBackdropExampleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
