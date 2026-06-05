export interface Theme {
  _id?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  sourcePath?: string;
  targetPath?: string;
  images?: string[];
  themeCustomOptions?: any[];
  pageCustomOptions?: any[];
  pdf?: string;
  previewLink?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
