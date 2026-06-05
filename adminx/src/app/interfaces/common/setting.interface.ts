import {Shop} from "./shop.interface";

export interface Setting {
  deliveryOptionType: any;
  advancePayment: any;
  _id?: string;
  shop?: Shop;
  smsMethods?: any[];
  smsSendingOption?: any;
  courierMethods?: any[];
  deliveryCharges?: any[];
  paymentMethods?: any[];
  socialLogins?: any[];
  offers?: any[];
  chats?: any[];
  currency?: any[];
  incompleteOrder?: any;
  affiliate?: any;
  invoiceSetting?: any;
  blog?: any;
  country?: any;
  googleLogin?: any;
  googleSearchConsoleToken?: any;
  facebookLogin?: any;
  domains?: any;
  facebookPixel?: any;
  googleTagManager?: any;
  googleAnalytics?: any;
  analytics?: any;
  facebookCatalog?: any;
  orderSetting?: any;
  productSetting?: any;
  isCashOnDeliveryOff?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
