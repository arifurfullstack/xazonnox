
export interface Shop {
  _id?: string;
  websiteName?: string;
  slug?: string;
  pages?: any;
  domain?: string;
  affiliateStatusList?: any;
  subDomain?: string;
  category?: string;
  dateString?: string;
  subCategory?: string;
  themeColor?: string;
  owner?: string;
  fraudCheckDate?: string;
  buildStatus?: string;
  port?: number;
  todayFraudCheckCount?: number;
  isSsr?: boolean;
  users?: any[];
  domainType?: 'sub-domain' | 'domain' | 'domain-http-www' | 'domain-www-http';
}

export interface PreShop {
  _id?: string;
  websiteName?: string;
  phoneNo?: string;
  paymentRefId?: string;
}
