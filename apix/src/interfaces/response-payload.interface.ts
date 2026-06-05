export interface ResponsePayload {
  success: boolean;
  data?: any;
  count?: number;
  message?: string;
  reports?: any;
  filterGroup?: any;
}

export interface ImageUploadResponse {
  name: string;
  size: number;
  url: string;
}

export interface FileUploadResponse {
  extension: string;
  name: string;
  size: number;
  url: string;
}
