import {VendorPermissions} from "../../enum/vendor-permission.enum";

export interface VendorAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: VendorAuthPayload;
  message?: string;
}

export interface VendorAuthPayload {
  _id: string;
  role: string;
  permissions: VendorPermissions[];
}
