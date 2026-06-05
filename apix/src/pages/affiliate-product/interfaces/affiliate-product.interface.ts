export interface AffiliateProduct {
  name: string;
  slug: string;
  image?: string;
  pageName?: string;
  seoDescription?: string;
  keyWord?: string;
}

export interface AffiliateSaleReport {
  refferId: string;
  affiliateProductId: string;
  shopId: string;
  amount?: number;
  dateString?: string;
}



