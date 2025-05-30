import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  TemplateRef
} from '@angular/core';
import { Breadcrumb } from '../types';
import { RouterLink } from '@angular/router';
import { BreadcrumbItemComponent } from '../breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbSeparatorComponent } from '../breadcrumb-separator/breadcrumb-separator.component';
import { BreadcrumbTitleComponent } from '../breadcrumb-title/breadcrumb-title.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { BreadcrumbsStore } from '../breadcrumbs.store';
import { BreadcrumbItemIconDefDirective } from '../breadcrumb-item-icon-def.directive';
import { BreadcrumbItemIconDirective } from '../breadcrumb-item-icon.directive';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import {
  BreadcrumbItemNameDefDirective
} from '../breadcrumb-item-name-def.directive';
import {
  BreadcrumbItemTitleDefDirective
} from '../breadcrumb-item-title-def.directive';

@Component({
  selector: 'emr-breadcrumbs-global',
  exportAs: 'emrBreadcrumbsGlobal',
  imports: [
    BreadcrumbItemComponent,
    BreadcrumbSeparatorComponent,
    BreadcrumbTitleComponent,
    BreadcrumbsComponent,
    RouterLink,
    BreadcrumbItemIconDirective,
    MatIcon,
    NgTemplateOutlet
  ],
  templateUrl: './breadcrumbs-global.component.html',
  styleUrl: './breadcrumbs-global.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-breadcrumbs-global',
    ngSkipHydration: 'true'
  }
})
export class BreadcrumbsGlobalComponent {
  private _breadcrumbsStore = inject(BreadcrumbsStore);
  protected itemIconDef = contentChild(BreadcrumbItemIconDefDirective);
  protected itemNameDef = contentChild(BreadcrumbItemNameDefDirective);
  protected itemTitleDef = contentChild(BreadcrumbItemTitleDefDirective);

  breadcrumbs = computed<Breadcrumb[]>(() => {
    return this._breadcrumbsStore.breadcrumbs();
  });
  lastItemAsLink = input(false, {
    transform: booleanAttribute
  });
  separator = input('/');

  get iconTemplateRef(): TemplateRef<any> {
    return this.itemIconDef()?.templateRef as TemplateRef<any>;
  }

  get titleTemplateRef(): TemplateRef<any> {
    return this.itemTitleDef()?.templateRef as TemplateRef<any>;
  }

  get nameTemplateRef(): TemplateRef<any> {
    return this.itemNameDef()?.templateRef as TemplateRef<any>;
  }
}
