export interface BlogComment {
  _id?: string;
  name?: string;
  title?: string;
  images?: string[];
  url?: string;
  urlType?: string;
  blog?: any;
  review?: any;
  reviewDate?: any;
  user?: any;
  showHome?: boolean;
  type?: string;
  priority?: string;
  deleteDateString?: string;
  status?: any;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
