import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Order} from "../../../interfaces/common/order.interface";
import {Select} from "../../../interfaces/core/select";
import {ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPES, TABLE_TAB_ORDER_DATA} from "../../../core/utils/app-data";
import {debounceTime, distinctUntilChanged, map, filter,Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {OrderService} from "../../../services/common/order.service";
import {VendorService} from "../../../services/vendor/vendor.service";
import {DatePipe} from "@angular/common";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {
  TableDetailsDialogComponent
} from "../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";

@Component({
  selector: 'app-all-incomplete-order',
  templateUrl: './all-incomplete-order.component.html',
  styleUrl: './all-incomplete-order.component.scss',
  providers: [DatePipe]
})
export class AllIncompleteOrderComponent extends DataTableSelectionBase(Component) implements AfterViewInit, OnDestroy, OnInit {

  // Decorator
  @ViewChild('searchForm', {static: true}) private searchForm: NgForm;

  // Store Data
  override allTableData: Order[] = [];
  protected orderStatus: Select[] = ORDER_STATUS;
  protected paymentType: Select[] = PAYMENT_TYPES;
  protected paymentStatus: Select[] = PAYMENT_STATUS;
  protected tableTabData: Select[] = TABLE_TAB_ORDER_DATA;
  protected selectedTab: string = 'All Data';
  protected adminRole:any;

  // Gallery View
  protected isGalleryOpen: boolean = false;
  protected galleryImages: string[] = [];
  protected selectedImageIndex: number = 0;

  // Pagination
  protected currentPage = 1;
  protected totalData = 0;
  protected dataPerPage = 10;

  // Date Filter
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Filter
  filter: any = null;
  selectedTabTrash: any = null;
  defaultFilter: any = null;
  searchQuery = null;
  private sortQuery = {createdAt: -1};
  private readonly select: any = {
    name: 1,
    orderId: 1,
    phoneNo: 1,
    city: 1,
    paymentType: 1,
    grandTotal: 1,
    deleteDateString: 1,
    checkoutDate: 1,
    orderStatus: 1,
    paymentStatus: 1,
    deliveryDate: 1,
    orderedItems: 1,
    preferredDate: 1,
    preferredTime: 1,
    preferredDateString: 1,
    deliveryDateString: 1,
    user: 1,
    createdAt: 1,
    status: 1,
    priority: 1,
    providerName: 1,
    advancePayment: 1,
  }

  // Loading
  isLoading: boolean = true;

  // Active Data Store
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter3: number = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly clipboard = inject(Clipboard);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly orderService = inject(OrderService);
  private readonly vendorService = inject(VendorService);
  private readonly datePipe = inject(DatePipe);


  ngOnInit() {
    this.adminRole = this.vendorService.getUserRole();
    // Reload Data
    const subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllIncompleteOrders();
    });
    this.subscriptions.push(subReload);

    // Get Data from Param
    const subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      if (qParam && qParam.get('search')) {
        this.searchQuery = qParam.get('search');
      }

      this.getAllIncompleteOrders();
    });
    this.subscriptions.push(subActivateRoute);

    const subQueryParam = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.selectedTab = qParam.get('orderType');
    });
    this.subscriptions?.push(subQueryParam);


    // Base Data
    this.setPageData();
    this.getAllIncompleteOrders();
    this.initImageGalleryView();
  }


  ngAfterViewInit(): void {

    const formValue = this.searchForm.valueChanges;
    const subSearch = formValue.pipe(
      map((t: any) => t['searchTerm']),
      filter(() => this.searchForm.valid),
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((searchTerm: string) => {
      if (searchTerm) {
        // Update query params with the new search term
        this.router.navigate([], {
          queryParams: {search: searchTerm},
          queryParamsHandling: 'merge'
        }).then();
      } else {
        // Remove search query param when input is empty
        this.router.navigate([], {
          queryParams: {search: null},
          queryParamsHandling: 'merge'
        }).then();
      }
    });

    this.subscriptions.push(subSearch);
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );
      this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
      // Re fetch Data
      this.getAllIncompleteOrders();
    }
  }

  get dateFilterTitle() {
    if (this.dataFormDateRange.get('start').value && this.dataFormDateRange.get('end').value) {
      const startDate = this.datePipe.transform(this.dataFormDateRange.get('start').value, 'mediumDate');
      const endDate = this.datePipe.transform(this.dataFormDateRange.get('end').value, 'mediumDate');
      if (startDate === endDate) {
        return endDate;
      } else {
        return startDate + '-' + endDate;
      }
    } else {
      return 'Filter in Date'
    }
  }

  /**
   * Base Init Methods
   * initImageGalleryView()
   */
  private initImageGalleryView() {
    const subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });
    this.subscriptions.push(subGalleryImageView);
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Order');
    this.pageDataService.setPageData({
      title: 'Order',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Order', url: 'https://www.youtube.com/embed/kd2YjeLYohE'},
      ]
    })
  }


  /**
   * Handle Tab
   * onTabChange()
   */
  onTabChange(data: string) {
    this.selectedTab = data;
    if (data === 'all') {
      this.filter = null;
    }
    else if(data === 'trash') {
      this.filter = {status: 'trash'}
    }
    else {
      this.filter = {orderStatus: data}
    }
    this.onClearSelection();
    // this.onClearDataQuery(this.filter);
    // Re fetch Data
    this.reFetchData();
  }

  getOrderedItemsImages(orderData: any): string[] {
    return orderData?.orderedItems?.map((item: any) => item?.image);
  }

  displayImages(data: any){
    const images = this.getOrderedItemsImages(data);
    return images;
  }
  /**
   * HTTP REQ HANDLE
   * getAllIncompleteOrders()
   * updateMultipleOrderById()
   * deleteMultipleIncompleteOrderById()
   */

  private getAllIncompleteOrders() {

    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {
        ...this.filter,
        ...(this.filter?.status ? {} : {status: {$ne: 'trash'}})
      },
      select: this.select,
      sort: this.sortQuery
    }

    const subscription = this.orderService.getAllIncompleteOrders(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.allTableData = res.data;
          // console.log("this.allTableData order", this.allTableData);
          this.totalData = res.count ?? 0;
          if (this.allTableData && this.allTableData.length) {
            this.allTableData.forEach((m, i) => {
              const index = this.selectedIds.findIndex(f => f === m._id);
              this.allTableData[i].select = index !== -1;
            });
            this.checkSelectionData();
          }
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }


  private updateMultipleOrderById(data: any) {
    const subscription = this.orderService.updateMultipleOrderById(this.selectedIds, data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.checkAndUpdateSelect();
            this.reloadService.needRefreshData$();
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'wrong')
          }
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private deleteMultipleIncompleteOrderById() {
    const subscription = this.orderService.deleteMultipleIncompleteOrderById(this.selectedIds)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
            this.checkAndUpdateSelect();
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}}).then();
            } else {
              this.reloadService.needRefreshData$();
            }
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private deleteMultipleOrdersById() {
    const subscription = this.orderService.deleteMultipleOrdersById(this.selectedIds)
      .subscribe({
        next: res => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
            this.checkAndUpdateSelect();
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}}).then();
            } else {
              this.reloadService.needRefreshData$();
            }
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private deleteAllTrashByShop() {
    const subscription = this.orderService.deleteAllTrashByShop()
      .subscribe({
        next: res => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.checkAndUpdateSelect();
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}}).then();
            } else {
              this.reloadService.needRefreshData$();
              // this.filter = {status: 'trash'}
            }
            this.selectedTab = 'all';
            this.filter = null;
          } else {
            this.uiService.message(res.message, 'warn')
          }
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  /**
   * Filter & Sort Methods
   * reFetchData()
   * sortData()
   * filterData()
   * onClearDataQuery()
   * onClearSearch()
   * isFilterChange()
   */

  private reFetchData() {
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}}).then();
    } else {
      this.getAllIncompleteOrders();
    }
  }

  sortData(query: any, type: number) {
    console.log("query, type", query, type);
    if (this.activeSort === type) {
      this.sortQuery = {createdAt: -1};
      this.activeSort = null;
    } else {
      this.sortQuery = query;
      this.activeSort = type;
    }
    this.getAllIncompleteOrders();
  }

  filterData(value: any, type: any, index: number,) {
    switch (type) {
      case 'payment-type': {
        if (value) {
          this.filter = {...this.filter, ...{'paymentType': value}};
          this.activeFilter1 = index;
        } else {
          delete this.filter['paymentType'];
          this.activeFilter1 = null;
        }

        break;
      }
      case 'payment-status': {
        if (value) {
          this.filter = {...this.filter, ...{'paymentStatus': value}};
          this.activeFilter2 = index;
        } else {
          delete this.filter['paymentStatus'];
          this.activeFilter2 = null;
        }

        break;
      }
      case 'order-status': {
        if (value) {
          this.filter = {...this.filter, ...{'orderStatus': value}};
          this.activeFilter3 = index;
        } else {
          delete this.filter['orderStatus'];
          this.activeFilter3 = null;
        }

        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.reFetchData();
  }


  onClearDataQuery(filter?: any) {
    this.selectedTab = 'All Data'
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter3 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = filter ?? null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    this.reFetchData();
  }

  onClearSearch() {
    this.searchForm.reset();
    this.searchQuery = null;
    this.router.navigate([], {queryParams: {search: null}}).then();
  }

  get isFilterChange(): boolean {
    if (!this.filter) {
      return false;
    } else {
      return !this.utilsService.checkObjectDeepEqual(this.defaultFilter ?? {}, this.filter ?? {}, 'status');
    }
  }


  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openDetailsDialog()
   */
  public openConfirmDialog(type: string, data?: any) {
    if (type === 'delete') {
      if(this.selectedTab !== 'trash') {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?'
          }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.deleteMultipleIncompleteOrderById();
          }
        });
      }else{
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?'
          }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.deleteMultipleOrdersById();
          }
        });
      }
    } else if (type === 'edit') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Edit',
          message: 'Are you sure you want edit this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.updateMultipleOrderById(data);
        }
      });
    }
    else if (type === 'trash') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Edit',
          message: 'Are you sure you want clean this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.deleteAllTrashByShop();
        }
      });
    }
  }

  openDetailsDialog(_id: string): void {
    const fData = this.allTableData.find(f => f._id === _id);
    this.dialog.open(TableDetailsDialogComponent, {
      data: fData,
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh'
    });
  }

  /**
   * PAGINATION CHANGE
   * onPageChanged()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}}).then();
  }

  /**
   * Gallery Image View
   * openGallery()
   * closeGallery()
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


  /**
   * Ui Essential
   * getStatusClass()
   * copyToClipboard()
   */
  getStatusClass(status: string) {
    if (status === 'publish') {
      return 'capsule-green';
    } else if (status === 'draft') {
      return 'capsule-orange';
    } else {
      return 'capsule-red';
    }
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
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
