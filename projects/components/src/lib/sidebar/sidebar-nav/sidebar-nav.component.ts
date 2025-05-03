import {
  AfterContentInit,
  afterNextRender, booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ElementRef, forwardRef,
  inject,
  input,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  SidebarNavItemComponent
} from '../sidebar-nav-item/sidebar-nav-item.component';
import { SIDEBAR_NAVIGATION } from '../types';
import { SidebarNavStore } from '../sidebar.store';
import { SidebarNavGroupComponent } from '../sidebar-nav-group/sidebar-nav-group.component';

@Component({
  selector: 'emr-sidebar-nav',
  exportAs: 'emrSidebarNav',
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SIDEBAR_NAVIGATION,
      useExisting: forwardRef(() => SidebarNavComponent),
    },
    SidebarNavStore
  ],
  host: {
    'class': 'emr-sidebar-nav',
  },
})
export class SidebarNavComponent implements AfterContentInit {
  private _elementRef = inject(ElementRef);
  private _navStore = inject(SidebarNavStore);

  readonly _items = contentChildren(SidebarNavItemComponent, { descendants: true });
  readonly _groups = contentChildren(SidebarNavGroupComponent, { descendants: true });

  activeKey = input();
  autoScrollToActiveItem = input(false, {
    transform: booleanAttribute
  });

  readonly itemClicked = output<any>();

  constructor() {
    // scroll to the active item if it is not visible in the viewport
    afterNextRender(() => {
      if (this.autoScrollToActiveItem()) {
        this._scrollToActiveItem();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeKey']) {
      this._navStore.setItemActiveKey(changes['activeKey'].currentValue);
      this._groups().forEach((group: SidebarNavGroupComponent) => {
        if (group.hasActiveItem()) {
          this._navStore.setGroupActiveKey(group._groupId);
          requestAnimationFrame(() => {
            this._scrollToActiveItem();
          });
        }
      });
    }
  }

  ngAfterContentInit() {
  }

  private _hasScroll(element: HTMLElement): boolean {
    if (!element.getBoundingClientRect) {
      return false;
    }

    return Math.ceil(element.scrollHeight) > Math.ceil(element.getBoundingClientRect().height);
  }

  private _isScrolledIntoView(element: HTMLElement, parent: HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return (elementRect.top >= 0) && (elementRect.bottom <= parentRect.height);
  }

  private _scrollToActiveItem(): void {
    this._items().forEach((item: SidebarNavItemComponent) => {
      if (item.active) {
        let scrollContainer = this._elementRef.nativeElement.closest('.scrollable-content');
        const itemElement = item._hostElement.nativeElement as HTMLElement;

        if (this._hasScroll(scrollContainer)) {
          if (!this._isScrolledIntoView(itemElement, scrollContainer)) {
            const parentRect = scrollContainer.getBoundingClientRect();
            const elementRect = itemElement.getBoundingClientRect();
            scrollContainer.scrollTop = elementRect.top - parentRect.height / 2;
          }
        }
      }
    });
  }
}
