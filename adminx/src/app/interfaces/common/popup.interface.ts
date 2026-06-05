export interface Popup {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  images?: string[];
  url?: string;
  urlType?: string;
  status?: any;
  type?: string;
  deleteDateString?: string;
  priority?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
