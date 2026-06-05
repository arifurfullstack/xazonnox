export interface Affiliate {
  _id?: string;
  name?: string;
  registrationType: any;
  usernames?: string[];
  username?: string;
  isPasswordLess?: boolean;
  password?: string;
  phoneNo?: string;
  countryCode?: string;
  fullPhoneNo?: string;
  email?: string;
  gender?: string;
  profileImg?: string;
  role?: string;
  status?: 'active' | 'inactive';
  shops?: any[];
  hasAccess?: boolean;
  registrationAt?: string;
  lastLoggedIn?: Date;
  failedLoginStartTime?: Date;
  failedLoginCount?: number;
}

export interface AffiliateAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredInDays?: string;
  data?: any;
  message?: string;
}

export interface AffiliateJwtPayload {
  _id?: string;
  username: string;
}
