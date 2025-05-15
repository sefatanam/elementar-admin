import { Directive } from '@angular/core';

@Directive({
  selector: '[emrComparisonSliderBeforeImage]',
  host: {
    '(dragstart)': 'onDragStart($event)'
  }
})
export class ComparisonSliderBeforeImageDirective {
  protected onDragStart(event: DragEvent) {
    event.preventDefault();
  }
}
