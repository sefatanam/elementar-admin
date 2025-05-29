import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrBreadcrumbItemTitleDef]'
})
export class BreadcrumbItemTitleDefDirective {
  readonly templateRef = inject(TemplateRef);
}
