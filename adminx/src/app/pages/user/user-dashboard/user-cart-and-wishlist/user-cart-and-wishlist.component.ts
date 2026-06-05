import {Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../../interfaces/common/user.interface";
import {DataTableSelectionBase} from "../../../../mixin/data-table-select-base.mixin";
import {NgForm} from "@angular/forms";
import {Order} from "../../../../interfaces/common/order.interface";
import {Select} from "../../../../interfaces/core/select";
import {DATA_STATUS, ORDER_STATUS} from "../../../../core/utils/app-data";
import {NavBreadcrumb} from "../../../../interfaces/core/nav-breadcrumb.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../../services/core/ui.service";
import {ReloadService} from "../../../../services/core/reload.service";
import {OrderService} from "../../../../services/common/order.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {Pagination} from "../../../../interfaces/core/pagination";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {CartService} from "../../../../services/common/cart.service";
import {WishlistService} from "../../../../services/common/wishlist.service";
import {Cart} from "../../../../interfaces/common/cart.interface";
import {Wishlist} from "../../../../interfaces/common/wishlist.interface";

@Component({
  selector: 'app-user-cart-and-wishlist',
  templateUrl: './user-cart-and-wishlist.component.html',
  styleUrl: './user-cart-and-wishlist.component.scss'
})
export class UserCartAndWishlistComponent extends DataTableSelectionBase(Component) implements OnInit, OnDestroy {

  @Input() userData!: User;


  // Store Data

   carts: any;
 wishlists: any;
  private holdPrevUsers: Order[] = [];
  dataStatus: Select[] = DATA_STATUS;
  orderStatus: Select[] = ORDER_STATUS;
  isGalleryOpen: boolean = false;
  isShowFilter: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;
  todayDate1 = new Date();
  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 3;
  totalDataStore = 0;
  defaultFilter: any;
  // Filter
  activeFilter6 = 0; // Initialize with 'Pending' index
  filter = { orderStatus: 'pending' }; // Default filter set to 'Pending'
  private readonly select: any = {
    name: 1,
    orderId: 1,
    phoneNo: 1,
    city: 1,
    paymentType: 1,
    grandTotal: 1,
    checkoutDate: 1,
    shippingAddress: 1,
    orderStatus: 1,
    paymentStatus: 1,
    orderedItems: 1,
    createdAt: 1,
    deliveryDate: 1,
    preferredDate: 1,
    preferredTime: 1,
    preferredDateString: 1,
    deliveryDateString: 1,
  }

  // Search
  private searchUsers: any[] = [];
  searchQuery = null;

  // Sort
  private sortQuery = {createdAt: -1};

  // Loading Control
  isLoading: boolean = true;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Active Data Store
  activeSortName: string = null;
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  // activeFilter6: number = null;


  // Nav Data Breadcrumb
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Order', url: null},
  ];

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;
  private subGalleryImageView: Subscription;

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);

  private readonly clipboard = inject(Clipboard);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);


  ngOnInit() {



    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      if (this.userData) {
        this.getCartByShopByUserId();
        this.getWishlistByShopByUserId();
      }
    });


    // Gallery Image View handle
    this.subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });

    if (this.userData) {
      this.getCartByShopByUserId();
      this.getWishlistByShopByUserId();
    }

  }




  /**
   * HTTP REQ HANDLE
   * getCartByShopByUserId()
   */


  private getCartByShopByUserId() {
    this.subDataGetAll = this.cartService.getCartByShopByUserId(this.userData?._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.carts = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private getWishlistByShopByUserId() {
    this.subDataGetAll = this.wishlistService.getWishlistByShopByUserId(this.userData?._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.wishlists = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Gallery Image View
   * openGallery()
   * closeGallery()
   * copyToClipboard()
   */
  openGallery(event: any, images: string[], index?: number): void {
    event.stopPropagation();

    if (index) {
      this.selectedImageIndex = index;
    }
    this.galleryImages = images;
    this.isGalleryOpen = true;
    this.router.navigate([], {queryParams: {'gallery-image-view': true}, queryParamsHandling: 'merge'}).then();
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    this.router.navigate([], {queryParams: {'gallery-image-view': null}, queryParamsHandling: 'merge'}).then();
  }

  copyToClipboard($event: any, text: any): void {
    $event.stopPropagation();
    this.clipboard.copy(text);
    this.uiService.message('Text copied successfully.', 'success');
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subActivateRoute?.unsubscribe();
    this.subReload?.unsubscribe();
    this.subSearch?.unsubscribe();
    this.subDataGetAll?.unsubscribe();
    this.subDataDeleteMulti?.unsubscribe();
    this.subDataUpdateMulti?.unsubscribe();
    this.subGalleryImageView?.unsubscribe();
  }
}
