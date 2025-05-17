import {
  Component,
  computed,
  signal,
  TemplateRef,
  contentChildren,
  effect,
  input, output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { SidePanelTabConfig, PanelPosition } from '../side-panel.types';
import { SidePanelTabComponent } from '../side-panel-tab/side-panel-tab.component';

@Component({
  selector: 'emr-side-panel',
  exportAs: 'emrSidePanel',
  imports: [
    CommonModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  host: {
    'class': 'emr-side-panel',
    '[class.panel-open]': 'isOpen()',
    '[class.position-right]': 'isPositionRight()',
  }
})
export class SidePanelComponent {
  position = input<PanelPosition>('right');

  isPositionRight = computed(() => this.position() === 'right');
  tooltipPosition = computed<TooltipPosition>(() => {
    return this.position() === 'left' ? 'right' : 'left';
  });
  private projectedTabsQuery = contentChildren(SidePanelTabComponent);
  protected internalTabs = signal<SidePanelTabConfig[]>([]);
  activeTabId = signal<string | null>(null);
  isOpen = signal(false);

  readonly opened = output<void>();
  readonly closed = output<void>();

  selectedTabContent = computed<TemplateRef<any> | null>(() => {
    if (!this.isOpen() || !this.activeTabId()) {
      return null;
    }
    const activeTab = this.internalTabs().find(tab => tab.tabId === this.activeTabId());
    return activeTab ? activeTab.content : null;
  });

  constructor() {
    effect(() => {
      const projectedTabs = this.projectedTabsQuery();
      this.internalTabs.set(
        projectedTabs.map(tabComp => ({
          tabId: tabComp.tabId(),
          label: tabComp.label(),
          icon: tabComp.icon(),
          content: tabComp.content,
        }))
      );
      const currentActiveId = this.activeTabId();
      const tabsArray = this.internalTabs();

      if (tabsArray.length === 0 && this.isOpen()) {
        this.isOpen.set(false);
        this.activeTabId.set(null);
      } else if (currentActiveId && !tabsArray.find(t => t.tabId === currentActiveId)) {
        this.activeTabId.set(null);
      }
    });
  }

  toggleTab(tabId: string): void {
    if (!this.isOpen()) {
      this.activeTabId.set(tabId);
      this.isOpen.set(true);
      this.opened.emit();
    } else {
      if (this.activeTabId() === tabId) {
        this.close();
      } else {
        this.activeTabId.set(tabId);
      }
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  protected isTemplateRef(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }
}
