import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'emr-notification',
  exportAs: 'emrNotification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  host: {
    'class': 'emr-notification',
    '[class.is-unread]': 'isUnread()'
  }
})
export class NotificationComponent {
  isUnread = input(false, {
    transform: booleanAttribute
  });
}
