export interface Category {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  slug?: string;
  image?: string;
  images?: [string];
  description?: string;
  priority?: number;
  serial?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  select?: boolean;
  featureStatus?: boolean;
  featureImage?: string;

}
