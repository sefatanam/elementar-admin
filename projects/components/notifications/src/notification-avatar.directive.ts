import { Directive } from '@angular/core';

@Directive({
  selector: '[emrNotificationAvatar]',
  exportAs: 'emrNotificationAvatar',
  host: {
    'class': 'emr-notification-avatar'
  }
})
export class NotificationAvatarDirective {
}
