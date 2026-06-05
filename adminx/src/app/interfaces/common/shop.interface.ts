export interface Shop {
  _id?: string;
  name?: string;
  slug?: string;
  websiteName?: string;
  domain?: string;
  subDomain?: string;
  category?: string;
  subCategory?: string;
  customerNotes?: any;
  theme?: string;
  dateString?: string;
  owner?: any;
  users?: any;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
