import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Order} from "../../../interfaces/common/order.interface";
import {Select} from "../../../interfaces/core/select";
import {ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPES, TABLE_TAB_ORDER_DATA} from "../../../core/utils/app-data";
import {debounceTime, distinctUntilChanged, filter, map, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {OrderService} from "../../../services/common/order.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {
  TableDetailsDialogComponent
} from "../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {VendorService} from "../../../services/vendor/vendor.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";
import {NoteDialogComponent} from "../../../shared/dialog-view/note-dialog/note-dialog.component";
import {
  CourierSelectionDialogComponent
} from "../../../shared/dialog-view/courier-selection-dialog/courier-selection-dialog.component";
import {SettingService} from "../../../services/common/setting.service";
import {CountryService} from "../../../services/core/country.service";

@Component({
  selector: 'app-all-order',
  templateUrl: './all-order.component.html',
  styleUrl: './all-order.component.scss',
  providers: [DatePipe]
})
export class AllOrderComponent extends DataTableSelectionBase(Component) implements AfterViewInit, OnDestroy, OnInit {

  // Decorator
  @ViewChild('searchForm', {static: true}) private searchForm: NgForm;

  // Store Data
  override allTableData: Order[] = [];
  protected orderStatus: Select[] = ORDER_STATUS;
  protected paymentType: Select[] = PAYMENT_TYPES;
  protected paymentStatus: Select[] = PAYMENT_STATUS;
  protected tableTabData: Select[] = TABLE_TAB_ORDER_DATA;
  protected selectedTab: string = this.tableTabData[0].value;
  protected adminRole:any;
  public invoiceSetting:any;



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

  dataFormDateRangeCourier = new FormGroup({
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
    customerNotes: 1,
    paymentStatus: 1,
    deliveryDate: 1,
    orderedItems: 1,
    orderTimeline: 1,
    preferredDate: 1,
    preferredTime: 1,
    preferredDateString: 1,
    deliveryDateString: 1,
    user: 1,
    orderedFrom: 1,
    createdAt: 1,
    status: 1,
    priority: 1,
    providerName: 1,
    advancePayment: 1,
    courierData: 1,
    previousOrderCount: 1,
  }

  orderSetting: any;
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
  private readonly settingService = inject(SettingService);


  ngOnInit() {

    this.adminRole = this.vendorService.getUserRole();
    // Reload Data
    const subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllOrders();
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

      if(qParam.get('orderType')){
        this.selectedTab = qParam.get('orderType');
        this.filter = {orderStatus: this.selectedTab};
      }

      // Use startDate and endDate from query params if present
      const startDateParam = qParam.get('startDate');
      const endDateParam = qParam.get('endDate');

      if (startDateParam && endDateParam) {
        const startDate = startDateParam || this.utilsService.getDateString(new Date());
        const endDate = endDateParam || this.utilsService.getDateString(new Date());

        // Parse to Date object and adjust the time
        const gteDate = new Date(startDate);
        const lteDate = new Date(endDate);
        gteDate.setHours(0, 0, 0, 0);
        lteDate.setHours(23, 59, 59, 999);

        const orderType = qParam.get('orderType');
        // Apply the adjusted filter
        let dateField = '';
        switch (orderType) {
          case 'cancelled':
          case 'delivered':
          case 'shipped':
          case 'pending':
          case 'returned':
          case 'refunded':
            dateField = `orderTimeline.${orderType}.date`;
            this.filter = {
              [dateField]: { $gte: gteDate, $lte: lteDate },
              orderStatus: orderType,
            };
            break;

          case 'confirmed':
            this.filter = {
              'orderTimeline.confirmed.date': { $gte: startDate, $lte: endDate },
              orderStatus: orderType,
            };
            break;

          default:
            this.filter = {
              checkoutDate: { $gte: gteDate, $lte: lteDate },
            };
            break;
        }
      }

      if (qParam.get('courier')) {
        const startDate = startDateParam || this.utilsService.getDateString(new Date());
        const endDate = endDateParam || this.utilsService.getDateString(new Date());
        this.filter = {
          'courierData.createdAt': { $gte: startDate, $lte: endDate },
          orderStatus: { $ne: 'cancelled' }
        };
      }


      // If only date params are present (no checkoutDate/courier/orderType), filter by checkoutDate
      if (startDateParam && endDateParam && !qParam.get('checkoutDate') && !qParam.get('courier') && !qParam.get('orderType')) {
        this.filter = {checkoutDate: {$gte: startDateParam, $lte: endDateParam}};
      }

      this.getAllOrders();
    });
    this.subscriptions.push(subActivateRoute);

    // Base Data
    this.setPageData();
    this.getAllOrders();
    this.initImageGalleryView();
    this.getSetting();
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
      this.getAllOrders();
    }
  }

  endChangeRegDateRangeCourier(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRangeCourier.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRangeCourier.value.end
      );
      this.filter = {'courierData.createdAt': {$gte: startDate, $lte: endDate}};
      // Re fetch Data
      this.getAllOrders();
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
   * getAllOrders()
   * updateMultipleOrderById()
   * deleteMultipleOrderById()
   */

  private getAllOrders() {

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

    const subscription = this.orderService.getAllOrders(filterData, this.searchQuery)
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

  private getSetting() {
    const subscription = this.settingService.getSetting('invoiceSetting orderSetting')
      .subscribe({
        next: res => {
          if (res.data) {
            this.invoiceSetting = res.data?.invoiceSetting;
            this.orderSetting = res.data?.orderSetting;
          }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }

  getInvoiceRoute(orderId: string): string[] {
    const selected = this.invoiceSetting?.selectedInvoice || 'invoice1';
    return ['/order-invoice', selected, orderId];
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

  private deleteMultipleOrderById() {
    const subscription = this.orderService.deleteMultipleOrderById(this.selectedIds)
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
      this.getAllOrders();
    }
  }

  sortData(query: any, type: number) {
    if (this.activeSort === type) {
      this.sortQuery = {createdAt: -1};
      this.activeSort = null;
    } else {
      this.sortQuery = query;
      this.activeSort = type;
    }
    this.getAllOrders();
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
    this.selectedTab = 'all'
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter3 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = filter ?? null;
    this.dataFormDateRange.reset();
    // ✅ URL থেকে query param clear
    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: '',
    });
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
            this.deleteMultipleOrderById();
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
      if(data?.orderStatus !== 'sent to courier'){
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
      else{
        this.openCourierDialog(data);
      }
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

  openNoteDialog(id: any) {
    this.dialog.open(NoteDialogComponent, {
      width: '600px',
      data: id
    });
  }


  openCourierDialog(data:any) {
    const dialogRef = this.dialog.open(CourierSelectionDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Selected Courier:', result);
        // এখানে API Call করো বা Order Create করো:
        this.updateMultipleOrderById(data);
      } else {
        console.log('Dialog closed without selection');
      }
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
// let text:any;
//     if (data.courierData && data.courierData.providerName === 'Steadfast Courier'){
//     text = `https://steadfast.com.bd/t/${data.courierData.consignmentId}`;
//     }else {
//       text = `https://merchant.pathao.com/tracking?consignment_id=${data.courierData.consignmentId}&phone=${data.phoneNo}`;
//     }

    this.clipboard.copy(text);
    // this.uiService.message('Tracking link copied successfully.', 'success');
    this.uiService.message('Consignment id copied successfully.', 'success');
  }

  trackingLink(data: any): string {
    if (data?.courierData && data.courierData.providerName === 'Steadfast Courier') {
      return `https://steadfast.com.bd/t/${data.courierData.trackingId}`;
    } else {
      return `https://merchant.pathao.com/tracking?consignment_id=${data.courierData.consignmentId}&phone=${data.phoneNo}`;
    }
  }


  /**
   * Download all orders
   */
  public downloadFiles(): void {
    // If there are selected IDs, filter allTableData to only those
    if (this.selectedIds && this.selectedIds.length) {
      let dataToDownload = this.allTableData.filter(order => this.selectedIds.includes(order._id));
      if (!dataToDownload || !dataToDownload.length) {
        this.uiService.message('No order data to download.', 'warn');
        return;
      }
      this.generateAndDownloadFiles(dataToDownload);
    } else {
      // Download all orders (fetch without pagination)
      this.fetchAllDataForDownload();
    }
  }

  // Fetch all orders without pagination download
  private fetchAllDataForDownload(): void {
    const filterData: FilterData = {
      pagination: {
        pageSize: 1000000, // Large number to get all data
        currentPage: 0
      },
      filter: {
        ...this.filter,
        ...(this.filter?.status ? {} : {status: {$ne: 'trash'}})
      },
      select: this.select,
      sort: this.sortQuery
    };

    const subscription = this.orderService.getAllOrders(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          if (res.data && res.data.length) {
            this.generateAndDownloadFiles(res.data);
          } else {
            this.uiService.message('No order data to download.', 'warn');
          }
        },
        error: err => {
          console.log(err);
          this.uiService.message('Error fetching orders for download.', 'warn');
        }
      });
    this.subscriptions.push(subscription);
  }

  // Generate and download CSV from order data
  private generateAndDownloadFiles(dataToDownload: Order[]): void {
    const fields = [
      { label: 'Order ID', value: 'orderId' },
      { label: 'Name', value: 'name' },
      { label: 'Phone No', value: 'phoneNo' },
      { label: 'Order From', value: 'orderedFrom' },
      { label: 'Order Date', value: 'checkoutDate' },
      { label: 'Order Time', value: 'createdAt' },
      { label: 'Payment Type', value: 'providerName' },
      { label: 'Payment Status', value: 'paymentStatus' },
      { label: 'Order Status', value: 'orderStatus' },
      { label: 'Grand Total', value: 'grandTotal' }
    ];
    const csvRows = [fields.map(f => f.label).join(',')].concat(
      dataToDownload.map(order => {
        return fields.map(f => {
          let val;
          switch (f.value) {
            case 'checkoutDate':
              val = order.checkoutDate ? this.datePipe.transform(order.checkoutDate, 'yyyy-MM-dd') : '';
              break;
            case 'createdAt':
              val = order.createdAt ? this.datePipe.transform(order.createdAt, 'HH:mm') : '';
              break;
            default:
              val = order[f.value] ?? '';
          }
          if (typeof val === 'string') {
            val = '"' + val.replace(/"/g, '""') + '"';
          }
          return val;
        }).join(',');
      })
    );
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
