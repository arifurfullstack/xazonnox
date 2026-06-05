import {Tag} from './tag.interface';
import {Variation, VariationOption} from './variation.interface';
import {Vendor} from '../vendor/vendor';
import {Category} from './category.interface';
import {SubCategory} from './sub-category.interface';
import {ChildCategory} from './child-category.interface';

export interface Product {
  _id?: string;
  name: string;
  slug?: string;
  phoneModel?: string;
  description?: string;
  costPrice?: number;
  totalSold?: number;
  addMore?: boolean;
  salePrice: number;
  hasTax?: boolean;
  tax?: number;
  keyWord?: string;
  sku: string;
  productKeyword: string[];
  emiMonth?: number[];
  discountType?: any;
  discountAmount?: number;
  regularPrice?: number;
  images?: string[];
  trackQuantity?: boolean;
  quantity?: number;
  category?: Category;
  subCategory?: SubCategory;
  childCategory?: ChildCategory;
  brand?: CatalogInfo;
  skinType?: CatalogInfo;
  skinConcern?: CatalogInfo;
  tags?: string[] | Tag[];
  specifications?: ProductSpecification[];
  driveLinks?: ProductSpecification[];
  hasVariations?: boolean;
  variationData?: any;
  variations?: Variation[];
  variationsOptions?: VariationOption[];
  status?: string;
  videoUrl?: string;
  unit?: string;
  // Seo
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Point
  earnPoint?: boolean;
  pointType?: number;
  pointValue?: number;
  redeemPoint?: boolean;
  redeemType?: number;
  redeemValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  isVariation?: boolean;
  selectedQty?: number;
  // For Create Order
  orderVariationOption?: VariationOption;
  orderVariation?: string;
  variationOptions?: any;
  variation2Options?: any;
  variationList?: VariationList[];

  // For Offer
  offerDiscountAmount?: number;
  offerDiscountType?: number;
  resetDiscount?: boolean;

  vendor?: any;
  deliveryCharge?: any;
}

interface CatalogInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  name?: string;
  value?: string;
}

export interface VariationList {
  _id?: string;
  name?: string;
  sku?: string;
  image?: string;
  salePrice?: number;
  regularPrice?: number;
  discountType?: number;
  costPrice?: number;
  discountAmount?: number;
  quantity?: number;
  trackQuantity?: number;
}

export interface PriceData {
  _id: string;
  costPrice: number;
  salePrice: number;
  regularPrice: number;
  discountType?: number;
  discountAmount?: number;
  quantity: number;
  soldQuantity?: number;
  unit: string;
  name: string;
}
