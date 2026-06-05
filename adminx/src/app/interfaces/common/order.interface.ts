import { Brand } from './brand.interface';
import {User} from './user.interface';
import {Product} from './product.interface';
import {Area} from './area.interface';
import { Division } from './division.interface';

export interface Order {
  courierData?: any;
  paidAmount: any;
  _id?: string;
  orderId?: string;
  discountTypes?: DiscountType[];
  name?: string;
  phoneNo?: string;
  previousOrderCount?: any;
  customerNotes?: any;
  transactionAmount?: any;
  email?: string;
  division?:any;
  clientNotes?:any;
  zone?:any;
  deleteDateString?:any;
  city?: string;
  district?: any;
  thana?: any;
  shippingAddress?: string;
  paymentType?: string;
  providerName?: string;
  orderedFrom?: string;
  providerType?: string;
  paymentTransactionId?: string;
  advancePaymentStatus?: string;
  customerPaymentNo?: string;
  orderedItems?: OrderedItem[];
  totalSave?: number;
  rewardPrice?: number;
  additionalDiscount?: number;
  subTotal?: number;
  deliveryChargeAmount?: number;
  deliveryCharge?: number;
  discount?: number;
  productDiscount?: number;
  advancePayment?: number;
  coupon?: string;
  couponDiscount?: number;
  grandTotal: number;
  checkoutDate: string;
  deliveryDate?: any;
  orderStatus?: string;
  paymentStatus?: string;
  hasOrderTimeline?: boolean;
  processingDate?: Date;
  shippingDate?: Date;
  deliveringDate?: Date;
  user?: User;
  orderTimeline?: OrderTimeline;
  preferredDate?: Date;
  preferredTime?: string;
  orderType?: string;
  orderFrom?: string;
  userIpAddress?: string;
  preferredDateString?: string;
  note?: string;
  area?: string | Area | any;
  prescription?: string;
  prescriptionImages?: string;
  prescriptionType?: boolean;
  requestMedicine?: boolean;
  requestMedicineType?: boolean;
  // Deliveryman interface
  deliveryNote?: string;
  deliverTime?: string;
  deliverDate?: string;
  deliveryAssignStatus?: string;
  deliveryCode?: string;
  priority?: string;
  status?: any;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}

export interface OrderedItem {
  _id: string | Product;
  name: string;
  slug: string;
  phoneModel: string;
  product: string;
  milligram:string;
  image: string;
  category: any;
  subCategory: any;
  publisher: any;
  purchaseType: any;
  brand: Brand;
  salePrice?: number;
  discountPrice?: number;
  quantity: number;
  selectedQuantity: number;
  orderType: string;
  discountAmount: number;
  discountType: number;
  unit: string;
  variation: any;
  variationData:any;
  unitPrice: any;
  regularPrice: number;
  costPrice: any;
}

export interface OrderTimeline {
  pending?: OrderTimelineType;
  confirmed?: OrderTimelineType;
  processed?: OrderTimelineType;
  shipped?: OrderTimelineType;
  delivered?: OrderTimelineType;
  cancelled?: OrderTimelineType;
  refunded?: OrderTimelineType;
}

export interface DiscountType {
  type: string;
  amount: number;
}

export interface OrderTimelineType {
  success: boolean;
  date?: Date;
  expectedDate?: Date;
}


export interface OrderInvoice {
  _id: string;
  shopLogo: string;
  color: string;
  signatureImage: string;
  shopName: string;
  shopPhoneNo: string;
  shopWhatsappNo: string;
  shopAddress: string;
  shopEmail: string;
  orderId: string;
  invoiceId: string;
  customerId: string;
  name: string;
  phoneNo: string;
  date: string;
  terms: string;
  company?: string;
  reference?: string;
  totalAmount: number;
  totalPaid: number;
  discount?: number;
  totalDue: number;
  items: any[];
  status: string;
  paymentStatus: string;
}

