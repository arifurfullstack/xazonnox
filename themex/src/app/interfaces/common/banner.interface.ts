export interface Banner {
  _id?: string;
  name?: string;
  images?: string[];
  url?: string;
  type?: string;
  urlType?: string;
  bannerType?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
