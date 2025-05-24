import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'emr-notification-actor,[emr-notification-actor]',
  imports: [],
  templateUrl: './notification-actor.component.html',
  styleUrl: './notification-actor.component.scss',
  host: {
    'class': 'emr-notification-actor',
    '[class.as-link]': 'asLink'
  }
})
export class NotificationActorComponent {
  private elementRef = inject(ElementRef);

  protected get asLink() {
    return (this.elementRef.nativeElement as HTMLElement).tagName === 'A';
  }
}
