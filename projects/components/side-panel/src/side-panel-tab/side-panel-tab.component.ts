import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'emr-side-panel-tab',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-template #contentTemplate><ng-content></ng-content></ng-template>`,
  styles: [':host { display: none; }']
})
export class SidePanelTabComponent {
  id = input.required<string>();
  label = input.required<string>();
  icon = input<string | TemplateRef<any> | undefined>();

  @ViewChild('contentTemplate', { read: TemplateRef, static: true })
  content!: TemplateRef<any>;
}
