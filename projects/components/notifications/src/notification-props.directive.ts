import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[emrNotificationProps]',
  exportAs: 'emrNotificationProps',
  standalone: true,
  host: {
    'class': 'emr-notification-props',
    '[class.is-unread]': 'isUnread()',
  }
})
export class NotificationPropsDirective {
  isUnread = input(false, {
    transform: booleanAttribute
  });
}
