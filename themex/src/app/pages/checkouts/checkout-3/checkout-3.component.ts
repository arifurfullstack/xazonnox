import {Component, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormGroup, FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {Coupon} from "../../../interfaces/common/coupon.interface";
import {Cart} from "../../../interfaces/common/cart.interface";
import {CART_MAX_QUANTITY} from "../../../core/utils/app-data";
import {User, UserAddress} from "../../../interfaces/common/user.interface";
import {DeliveryCharge, Setting} from "../../../interfaces/common/setting.interface";
import {Subscription} from "rxjs";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {CartService} from "../../../services/common/cart.service";
import {OrderService} from "../../../services/common/order.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserDataService} from "../../../services/common/user-data.service";
import {UiService} from "../../../services/core/ui.service";
import {ProductPricePipe} from "../../../shared/pipes/product-price.pipe";
import {UserService} from "../../../services/common/user.service";
import {ProductService} from "../../../services/common/product.service";
import {MatDialog} from "@angular/material/dialog";
import {CouponService} from "../../../services/common/coupon.service";
import {GtmService} from "../../../services/core/gtm.service";
import {UtilsService} from "../../../services/core/utils.service";
import {DiscountTypeEnum} from "../../../enum/product.enum";
import {PaymentMethodComponent} from "../components/payment-method/payment-method.component";
import {TitleComponent} from "../../../shared/components/title/title.component";
import {OrderItemCardComponent} from "../../../shared/components/order-item-card/order-item-card.component";
import {
  OrderItemCardMobileComponent
} from "../../../shared/components/order-item-card-mobile/order-item-card-mobile.component";
import {UserOffersComponent} from "../components/user-offers/user-offers.component";
import {OffersComponent} from "../components/offers/offers.component";
import {EmptyDataComponent} from "../../../shared/components/ui/empty-data/empty-data.component";
import {AddressArea3Component} from "./address-area-3/address-area-3.component";
import {DeliveryCharge3Component} from "./delivery-charge-3/delivery-charge-3.component";
import {CurrencyCtrPipe} from '../../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-checkout-3',
  providers: [ProductPricePipe],
  standalone: true,
  imports: [
    PaymentMethodComponent,
    TitleComponent,
    OrderItemCardComponent,
    OrderItemCardMobileComponent,
    ReactiveFormsModule,
    UserOffersComponent,
    OffersComponent,
    EmptyDataComponent,
    RouterLink,
    FormsModule,
    AddressArea3Component,
    DeliveryCharge3Component,
    CurrencyCtrPipe,
  ],
  templateUrl: './checkout-3.component.html',
  styleUrl: './checkout-3.component.scss'
})
export class Checkout3Component implements OnInit, OnDestroy {

  // Data Form
  dataForm?: FormGroup;
  @ViewChild('formElement') formElement: NgForm;
  needRefreshForm: boolean = false;

  isHydrated = false;

  coupon: Coupon = null;
  couponCode: any = null;
  couponDiscount: number = 0;

  // Store Data
  private eventId: string;
  division: string;
  carts: Cart[] = [];
  readonly cartMaxQuantity: number = CART_MAX_QUANTITY;
  selectedCartItem: string = null;
  user: User;
  setting: Setting;
  deliveryCharge: DeliveryCharge;
  deliveryChargeAmount: number = 0;
  shippingAddress: any;
  selectedPaymentProvider: string;
  allPaymentProvider: any;
  note: string;
  userOfferDiscount: any;

  // Loading
  isLoading: boolean = false;
  isCoupon: boolean = false;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly document = inject(DOCUMENT);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly reloadService = inject(ReloadService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);
  private readonly productPricePipe = inject(ProductPricePipe);
  protected readonly userService = inject(UserService);
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly couponService = inject(CouponService);
  private readonly gtmService = inject(GtmService);
  private readonly utilsService = inject(UtilsService);
  private readonly platformId = inject(PLATFORM_ID);


  ngOnInit() {

    // Cart Data
    const subscription = this.reloadService.refreshCart$.subscribe(isRefresh => {
      if (isRefresh) {
        this.getCartsItems();
      }
    });
    this.subscriptions?.push(subscription);
    this.carts = this.cartService.cartItems;
    this.getCartsItems();

    this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam.get('cart')) {
        this.selectedCartItem = qParam.get('cart');
      }
    });

    // Base Data
    if (this.userService.isUser) {
      this.getLoggedInUserData();
    }
  }

  /**
   * Hydrated Manage
   * checkHydrated()
   */

  protected checkHydrated() {
    if (isPlatformBrowser(this.platformId)) {
      this.isHydrated = true;
    }
  }

  /**
   * HTTP Req Handle
   * getLoggedInUserData()
   * getPaymentMethod()
   * getCartsItems()
   * updateCartQty()
   */
  private getLoggedInUserData() {
    const select = 'email name phoneNo';
    const subscription = this.userDataService.getLoggedInUserData(select)
      .subscribe({
        next: (res) => {
          this.user = res.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions?.push(subscription);
  }


  private getCartsItems(refresh?: boolean) {
    if (this.userService.isUser) {
      const subscription = this.cartService.getCartByUser()
        .subscribe({
          next: res => {
            this.carts = res.data;
            this.cartService.updateCartList(this.carts);
          }, error: err => {
            console.log(err)
          }
        });
      this.subscriptions?.push(subscription);
    } else {
      this.getCarsItemFromLocal(refresh);
    }
  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length) {
      const ids: string[] = items.map((m) => m.product as string);
      const select =
        'name slug salePrice regularPrice images quantity category isVariation variationList minimumWholesaleQuantity wholesalePrice';
      const subscription = this.productService.getProductByIds(ids, select)
        .subscribe({
          next: res => {
            const products = res.data;
            if (products && products.length) {
              this.carts = items.map(t1 => ({
                ...t1,
                ...{product: products.find((t2) => t2._id === t1.product)},
              }));
              this.cartService.updateCartList(this.carts);
              // console.log(' this.carts ', this.carts)
            }
          },
          error: error => {
            console.log(error)
          }
        });
      this.subscriptions?.push(subscription);
    } else {
      this.carts = [];
      this.cartService.updateCartList(this.carts);

    }
  }

  private updateCartQty(cartId: string, data: any) {
    const subscription = this.cartService.updateCartQty(cartId, data).subscribe({
      next: res => {
        if (res.success) {
          this.reloadService.needRefreshCart$(true);
        }
      },
      error: err => {
        console.log(err)
      }
    });
    this.subscriptions?.push(subscription);
  }

  private addOrder(data: any) {
    this.isLoading = true;
    const subscription = this.orderService.addOrder(data, this.userService.isUser).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoading = false;
          switch (res.data.providerName) {
            case 'Cash on Delivery': {
              this.uiService.message(res.message, 'success');
              if (!this.userService.isUser) {
                this.cartService.deleteAllCartFromLocal(true);
              }
              this.router.navigate(['/success-order'], {
                queryParams: {orderId: res.data.orderId},
              }).then();
              this.cartService.needRefreshStoredCart$();
              break;
            }
            case 'Bkash': {
              if (res.success && res.data.link) {
                this.document.location.href = res.data.link;
              } else {
                this.uiService.message(res.message, 'wrong');
              }
              break;
            }
            case 'SSl Commerz': {
              if (res.success && res.data.link) {
                this.document.location.href = res.data.link;
              } else {
                this.uiService.message(res.message, 'wrong');
              }
              break;
            }
          }
        } else {
          this.uiService.message(res.message, 'warn');
        }

      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions?.push(subscription);
  }

  private addAdvancePaymentOrderByUser(data: any) {
    this.isLoading = true;
    const subscription = this.orderService.addOrder(data, this.userService.isUser).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoading = false;
          switch (res.data.providerName) {
            case 'Cash on Delivery': {
              this.uiService.message(res.message, 'success');
              if (!this.userService.isUser) {
                this.cartService.deleteAllCartFromLocal(true);
              }
              this.router.navigate(['/success-order'], {
                queryParams: {orderId: res.data.orderId},
              }).then();
              this.cartService.needRefreshStoredCart$();
              break;
            }
            case 'Bkash': {
              if (res.success && res.data.link) {
                this.document.location.href = res.data.link;
              } else {
                this.uiService.message(res.message, 'wrong');
              }
              break;
            }
            case 'SSl Commerz': {
              if (res.success && res.data.link) {
                this.document.location.href = res.data.link;
              } else {
                this.uiService.message(res.message, 'wrong');
              }
              break;
            }
          }
        } else {
          this.uiService.message(res.message, 'warn');
        }

      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions?.push(subscription);
  }


  /**
   * UI Methods
   * onConfirmOrder()
   */
  public onConfirmOrder() {

    if (!this.carts.length) {
      this.uiService.message('Empty Cart! sorry your cart is empty.', "warn");
      this.router.navigate(['/']).then();
      return;
    }

    if (!this.selectedPaymentProvider) {
      this.uiService.message('Please select a payment method', "warn")
      return;
    }

    if (!this.shippingAddress || (this.shippingAddress && !this.shippingAddress.division)) {
      this.needRefreshForm = true;
      this.uiService.message('Please select your address', "warn")
      return;
    }

    const getCartOrProductIds = () => {
      if (this.userService.isUser) {
        return this.carts.map(m => m._id);
      } else {
        return this.carts.map(m => m.product['_id']);
      }
    }

    const cartData = () => {
      if (this.userService.isUser) {
        return [];
      } else {
        return this.carts.map(m => {
          return {
            ...m,
            ...{
              product: m.product['_id']
            }
          }
        })
      }
    }

    const data: any = {
      user: this.user?._id ?? null,
      orderType: this.userService.isUser ? 'user' : 'anonymous',
      carts: getCartOrProductIds(),
      cartData: cartData(),
      name: this.shippingAddress.name,
      phoneNo: this.shippingAddress.phoneNo,
      shippingAddress: this.shippingAddress.shippingAddress,
      division: this.shippingAddress.division,
      area: this.shippingAddress.area,
      zone: this.shippingAddress.zone,
      addressType: this.shippingAddress?.addressType,
      email: this.user?.email ?? null,
      providerName: this.selectedPaymentProvider,
      note: this.note,
      deliveryType: this.deliveryCharge?.type,
      userOffer: this.userOfferDiscount?.offerType,
      needSaveAddress: true,
      coupon: this.coupon ? this.coupon?._id : null,
    }


    if (this.deliveryCharge?.isAdvancePayment && this.deliveryCharge?.type !== 'free' && this.selectedPaymentProvider === 'Cash on Delivery') {
      // Advance Payment Popup
      this.openPopupDialog(data)
    } else {

      this.addOrder(data);
    }

    // Event & Data Layer
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initiateCheckoutEvent();
      }, 100)
    }

  }


  /**
   * ON Change Methods
   * onChangeAddress()
   * onChangeDeliveryCharge()
   * onChangePaymentMethod()
   * onChangeUserDiscount()
   */
  onChangeAddress(event: UserAddress) {
    this.shippingAddress = event;
    this.division = this.shippingAddress.division;
  }

  onChangeDeliveryCharge(event: DeliveryCharge) {
    this.deliveryCharge = event;
    this.deliveryChargeAmount = event.deliveryCharge ?? 0;
  }

  onChangePaymentMethod(event: any) {
    this.selectedPaymentProvider = event;
  }

  allPaymentMethod(event: any) {
    this.allPaymentProvider = event;
  }

  onChangeUserDiscount(event: any) {
    this.userOfferDiscount = event;
  }

  /**
   * Cart Methods
   * onIncrementQty()
   * onDecrementQty()
   */
  onIncrementQty(cartId: string, index: number) {
    if (this.userService.isUser) {
      if (this.carts[index].selectedQty === this.cartMaxQuantity) {
        this.uiService.message(`Maximum product quantity is ${this.cartMaxQuantity}`, 'warn');
      } else {
        this.carts[index].selectedQty += 1;
        this.updateCartQty(cartId, {selectedQty: 1, type: 'increment'});
      }
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data && data[index].selectedQty !== this.cartMaxQuantity) {
        data[index].selectedQty += 1;
        this.carts[index].selectedQty += 1;
        this.cartService.updateCartItemFromLocalStorage(data);
      }
    }
  }

  onDecrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.isUser) {
      if (sQty === 1) {
        this.uiService.message('Minimum quantity is 1', 'warn');
      } else {
        this.carts[index].selectedQty -= 1;
        this.updateCartQty(cartId, {selectedQty: 1, type: 'decrement'});
      }
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data && data[index].selectedQty !== 1) {
        data[index].selectedQty -= 1;
        this.carts[index].selectedQty -= 1;
        this.cartService.updateCartItemFromLocalStorage(data);
      }
    }
  }

  /**
   * Calculation
   * cartRegularSubTotal()
   * cartSaleSubTotal()
   * cartDiscountAmount()
   */

  get cartRegularSubTotal(): number {
    return this.carts.map(item => {
      return this.productPricePipe.transform(
        item.product,
        'regularPrice',
        item.variation?._id,
        item.selectedQty
      ) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartSaleSubTotal(): number {
    return this.carts.map(item => {
      return this.productPricePipe.transform(
        item.product,
        'salePrice',
        item.variation?._id,
        item.selectedQty,
        item?.isWholesale
      ) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartDiscountAmount(): number {
    return this.carts.map(item => {
      return this.productPricePipe.transform(
        item.product,
        'discountAmount',
        item.variation?._id,
        item.selectedQty,
        item?.isWholesale
      ) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get grandTotal(): number {
    return this.cartSaleSubTotal + (this.deliveryChargeAmount ?? 0) - (this.userOfferDiscount?.amount ?? 0) - (this.couponDiscount ?? 0);
  }


  /**
   * Dialog View
   * openPopupDialog()
   */
  openPopupDialog(orderData: any) {
    // const dialogRef = this.dialog.open(AdvancePaymentComponent, {
    //   data: {
    //     deliveryCharge: this.deliveryCharge?.deliveryCharge,
    //     paymentMethods: this.allPaymentProvider?.paymentMethods
    //   },
    //   maxWidth: '500px',
    //   width: '100%',
    //   maxHeight: "500px",
    //   panelClass: ['dialog', 'offer-dialog']
    // });
    // const subscription = dialogRef.afterClosed().subscribe((dialogResult) => {
    //   if (dialogResult) {
    //     const mData = {
    //       ...orderData,
    //       ...{
    //         providerName: dialogResult?.selectedProvider,
    //         isAdvancePayment: true
    //       }
    //     }
    //
    //     this.addAdvancePaymentOrderByUser(mData)
    //   }
    //
    // });
    // this.subscriptions?.push(subscription);
  }

  /**
   * COUPON HANDLE
   * checkCouponAvailability()
   * calculateCouponDiscount()
   * onRemoveCoupon()
   */

  public checkCouponAvailability() {
    if (!this.couponCode?.trim()) {
      this.uiService.message('Please enter your vouchers code.', "warn");
      return;
    }

    const subscription = this.couponService
      .checkCouponAvailability({
        couponCode: this.couponCode,
        subTotal: this.cartSaleSubTotal,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.coupon = res.data;
            if (this.coupon) {
              this.calculateCouponDiscount();
            }
          } else {
            this.uiService.message(res.message, "warn");
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions?.push(subscription);
  }

  private calculateCouponDiscount() {
    if (this.coupon.discountType === DiscountTypeEnum.PERCENTAGE) {
      this.couponDiscount = Math.floor(
        (this.coupon.discountAmount / 100) * this.cartSaleSubTotal
      );
    } else {
      this.couponDiscount = Math.floor(this.coupon.discountAmount);
    }
  }


  onRemoveCoupon() {
    this.couponDiscount = 0
    this.couponCode = null;
    this.coupon = null;

  }


  /**
   * Utils
   * generateEventId()
   */
  private generateEventId() {
    this.eventId = this.utilsService.generateEventId();
  }

  private initiateCheckoutEvent(): void {

    // Generate Event Id
    this.generateEventId();
    const trackData: any = {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(Date.now() / 1000),
      event_id: this.eventId,
      action_source: 'website',
      event_source_url: location.href,
      custom_data: {
        content_ids: this.carts.map(m => m.product['_id']),
        value: this.grandTotal,
        num_items: this.carts.length,
        currency: "BDT",
      },
      user_data: {
        em: this.userService.getUserEmail() ?? 'null',
        ph: this.userService.getUserPhoneNo() ?? 'null',
      }

    };

    // Browser: Facebook Pixel
    if (!this.gtmService.isManageFbPixelByTagManager) {
      this.gtmService.trackByFacebookPixel('InitiateCheckout', {
        event_id: this.eventId,
        content_ids: this.carts.map(m => m.product['_id']),
        num_items: this.carts.length,
        value: this.grandTotal,
        currency: 'BDT'
      })
    }


    //  Browser: Tag Manager
    if (this.gtmService.isManageFbPixelByTagManager) {
      this.gtmService.pushToDataLayer({
        event: 'InitiateCheckout',
        event_id: this.eventId,
        page_url: window.location.href,
        ecommerce: {
          checkout: {
            actionField: {
              num_items: this.carts.length
            },
            detail: this.carts.map(m => {
              return {
                id: m.product['_id'],
                name: m.product['name'],
                category: m.product['category']['name'],
                price: m.product['salePrice'],
                quantity: m.selectedQty,
              }
            })
          }
        }
      });
    }

    // Server
    const subscription = this.gtmService.trackInitiateCheckout(trackData).subscribe({
      next: () => {
      },
      error: () => {
      },
    });
    this.subscriptions.push(subscription);

  }


  onSelectCouponOpen() {
    this.isCoupon = true;
  }

  onSelectCouponClose() {
    this.isCoupon = false;
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }


}
