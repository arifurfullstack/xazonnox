export interface Package {
  _id?: string;
  name?: string;
  type?: string;
  featureLimits?: any;
  routeLimits?: any;
  dataLimits?: any;
  features?: any;
  renewInDay?: number;
  price?: number;
  discountAmount?: number;
  discountType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
