import {VendorRole} from "../vendor/vendor-role";

export interface Vendor {
  _id?: string;
  name?: string;
  // registrationType: 'phone';
  username?: string;
  isPasswordLess?: boolean;
  password?: string;
  phoneNo?: string;
  countryCode?: string;
  fullPhoneNo?: string;
  email?: string;
  gender?: string;
  profileImg?: string;
  role?: any;
  status?: 'active' | 'inactive';
  shops?: any[];
  hasAccess?: boolean;
  registrationAt?: string;
  lastLoggedIn?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  failedLoginStartTime?: Date;
  failedLoginCount?: number;
  select?: boolean;
}

export interface VendorAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredInDays?: string;
  data?: any;
  message?: string;
}

export interface VendorJwtPayload {
  _id?: string;
  username: string;
}
