export interface OfferPage {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  slug?: string;
  images?: [string];
  priority?: number;
  product?: any;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
