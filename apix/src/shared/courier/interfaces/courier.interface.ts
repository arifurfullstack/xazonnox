export interface CourierApiConfig {
  providerName: string;
  apiKey: string;
  secretKey: string;
  username?: string;
  password?: string;
  specialInstruction?: any;
  storeId?: any;
}

export interface SteadfastCourierPayload {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
}
