export interface User {
  phoneNo: any;
  _id?: string;
  shop?: string;
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  image?: string;
  images?: string[];
  password?: string;
  countryCode?: string;
  gender?: string;
  profileImg?: string;
  joinDate?: string;
  hasAccess?: boolean;
  registrationType: 'default' | 'phone' | 'email' | 'facebook' | 'google';
  status: string;
  success: boolean;
  isPasswordLess?: boolean;
  select?: boolean;
  priority?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredInDays?: string;
  data?: any;
  shops?: any[];
  message?: string;
  role?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
  shop: string;
}
