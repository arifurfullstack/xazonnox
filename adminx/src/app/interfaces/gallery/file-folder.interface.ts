import { Vendor } from "../vendor/vendor";

export interface FileFolder {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  slug?: string;
  vendor?: string | Vendor;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
