import { Component } from '@angular/core';
import {
  LayoutAsideComponent,
  LayoutBodyComponent,
  LayoutComponent,
  LayoutHeaderComponent
} from '@elementar-ui/components/layout';
import { SidePanelComponent } from '@elementar-ui/components/side-panel';
import { SidePanelTabComponent } from '@elementar-ui/components/side-panel/src/side-panel-tab/side-panel-tab.component';

@Component({
  selector: 'app-basic-side-panel-example',
  imports: [
    LayoutComponent,
    LayoutHeaderComponent,
    LayoutBodyComponent,
    LayoutAsideComponent,
    SidePanelComponent,
    SidePanelTabComponent
  ],
  templateUrl: './basic-side-panel-example.component.html',
  styleUrl: './basic-side-panel-example.component.scss'
})
export class BasicSidePanelExampleComponent {

}
