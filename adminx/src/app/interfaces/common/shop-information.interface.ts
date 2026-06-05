import { Vendor } from "./vendor.interface";


export interface ShopInformation {
  readOnly?: boolean;
  _id?: string;
  siteName?: string;
  images?: string;
  logoPrimary?: string;
  websiteName?: string;
  shopPhoneNo?: string;
  shortDescription?: string;
  downloadAppDescription?: string;
  siteLogo?: string;
  fabIcon?: string;
  whatsappNumber?: string;
  addresses: ShopObject[];
  emails?: ShopObject[];
  phones: ShopObject[];
  downloadUrls: ShopObject[];
  socialLinks: ShopObject[];
  navLogo?: string;
  footerLogo?: string;
  othersLogo?: string;
  admin?: string | Vendor;
}

export interface ShopObject {
  type: number;
  value: string;
}
