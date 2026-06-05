export interface Notification {
  _id?: string;
  name?: string;
  isRead?: boolean;
  url?: string;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
