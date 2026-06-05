export interface ShopInformation {
  _id?: string;
  shortDescription?: string;
  siteLogo?: string;
  fabIcon?: string;
  isShow?: boolean;
  poweredby?: string;
  logoPrimary?: string;
  websiteName?: string;
  whatsappNumber?: string;
  addresses: ShopObject[];
  emails?: ShopObject[];
  phones: ShopObject[];
  downloadUrls: ShopObject[];
  socialLinks: ShopObject[];
  navLogo?: string;
  footerLogo?: string;
  categoryPdfFile?: string;
  othersLogo?: string;
  brandingText?: [null];
  showBranding?: boolean;
}

export interface ShopObject {
  type: number;
  value: string;
}
