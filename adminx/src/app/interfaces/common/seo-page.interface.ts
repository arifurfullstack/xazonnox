export interface SeoPage {
  _id?: string;
  name?: string;
  title?: string;
  type?: string;
  images?: string[];
  seoTitle?: string;
  deleteDateString?: string;
  status?: any;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
