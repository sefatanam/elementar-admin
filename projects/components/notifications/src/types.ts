export interface Notification {
  actor: any,
  type: string;
  createdAt: string;
  isUnread?: boolean;
  [propName: string]: any;
}
