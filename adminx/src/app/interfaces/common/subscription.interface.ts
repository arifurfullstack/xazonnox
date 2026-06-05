import {Package} from "./package.interface";

export interface Subscriptions {
  _id?: string;
  shop?: string;
  package?: Package;
  starDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
