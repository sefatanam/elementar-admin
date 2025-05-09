import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[emrUploadAreaDropState]'
})
export class UploadAreaDropStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
