import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject, OnInit,
  signal,
} from '@angular/core';
import { SIDEBAR_NAVIGATION, SIDEBAR_NAVIGATION_GROUP } from '../types';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { SidebarNavGroupComponent } from '../sidebar-nav-group/sidebar-nav-group.component';
import { SidebarNavItemComponent } from '../sidebar-nav-item/sidebar-nav-item.component';
import { SidebarNavStore } from '../sidebar.store';

@Component({
  selector: 'emr-sidebar-nav-group-menu',
  exportAs: 'emrSidebarNavGroupMenu',
  templateUrl: './sidebar-nav-group-menu.component.html',
  styleUrl: './sidebar-nav-group-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-sidebar-nav-group-menu',
    '[class.is-active]': 'active'
  }
})
export class SidebarNavGroupMenuComponent implements AfterContentInit, OnInit {
  readonly navigation = inject<SidebarNavComponent>(SIDEBAR_NAVIGATION);
  private _group = inject<SidebarNavGroupComponent>(SIDEBAR_NAVIGATION_GROUP);
  private _navStore = inject(SidebarNavStore);

  readonly _items = contentChildren(SidebarNavItemComponent, { descendants: true });

  key = signal<any>(this._group._groupId);

  get active(): boolean {
    return this._navStore.isGroupActive(this.key());
  }

  ngOnInit() {
    this.navigation
      .itemClicked
      .subscribe(() => {
        const isGroupActive = this._items().filter(
          itemComponent => itemComponent.active
        ).length > 0;

        if (!isGroupActive && this._group._groupId === this._navStore.activeGroupKey()) {
          this._navStore.setGroupActiveKey(null);
        }
      });
  }

  ngAfterContentInit() {
    const isGroupActive = this._items().filter(
      itemComponent => itemComponent.active
    ).length > 0;

    if (isGroupActive) {
      this._navStore.setGroupActiveKey(this.key());
    }
  }
}
