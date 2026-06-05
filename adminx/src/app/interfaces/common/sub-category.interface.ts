import {Category} from './category.interface';

export interface SubCategory {
  _id?: string;
  readOnly?: boolean;
  category?: Category;
  categoryInfo?: Category;
  name?: string;
  slug?: string;
  deleteDateString?: string;
  images?: [string];
  priority?: number;
  categoryProducts?: number;
  status?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
