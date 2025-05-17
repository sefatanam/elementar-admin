import {
  Component,
  computed,
  signal,
  TemplateRef,
  contentChildren,
  effect,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { SidePanelTabConfig, PanelPosition } from '../side-panel.types';
import { SidePanelTabComponent } from '../side-panel-tab/side-panel-tab.component';

@Component({
  selector: 'emr-side-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  host: {
    '[style.width.px]': 'hostWidth()',
    '[class.panel-open]': 'isOpen()',
    '[class.position-right]': 'isPositionRight()',
  }
})
export class SidePanelComponent {
  position = input<PanelPosition>('right');

  readonly panelContentWidthPx = 300;
  readonly buttonStripWidthPx = 56;

  hostWidth = computed(() => {
    if (this.isOpen()) {
      return this.buttonStripWidthPx + this.panelContentWidthPx;
    }
    return this.buttonStripWidthPx;
  });

  isPositionRight = computed(() => this.position() === 'right');
  tooltipPosition = computed<TooltipPosition>(() => {
    return this.position() === 'left' ? 'right' : 'left';
  });

  private projectedTabsQuery = contentChildren(SidePanelTabComponent);

  internalTabs = signal<SidePanelTabConfig[]>([]);
  isOpen = signal(false);
  activeTabId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const projectedTabs = this.projectedTabsQuery();
      this.internalTabs.set(
        projectedTabs.map(tabComp => ({
          id: tabComp.id(),
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
      } else if (currentActiveId && !tabsArray.find(t => t.id === currentActiveId)) {
        this.activeTabId.set(null);
      }
    });
  }

  selectedTabContent = computed<TemplateRef<any> | null>(() => {
    if (!this.isOpen() || !this.activeTabId()) {
      return null;
    }
    const activeTab = this.internalTabs().find(tab => tab.id === this.activeTabId());
    return activeTab ? activeTab.content : null;
  });

  activeTabLabel = computed<string | null>(() => {
    if (!this.isOpen() || !this.activeTabId()) {
      return null;
    }
    return this.internalTabs().find(tab => tab.id === this.activeTabId())?.label || null;
  });

  toggleTab(tabId: string): void {
    if (!this.isOpen()) {
      this.activeTabId.set(tabId);
      this.isOpen.set(true);
    } else {
      if (this.activeTabId() === tabId) {
        this.isOpen.set(false);
      } else {
        this.activeTabId.set(tabId);
      }
    }
  }

  closePanel(): void {
    this.isOpen.set(false);
  }

  isTemplateRef(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }
}
