import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrBreadcrumbItemNameDef]'
})
export class BreadcrumbItemNameDefDirective {
  readonly templateRef = inject(TemplateRef);
}
