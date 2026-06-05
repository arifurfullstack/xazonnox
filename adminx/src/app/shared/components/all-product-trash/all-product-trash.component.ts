import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "../breadcrumb/breadcrumb.component";
import {FormsModule, NgForm} from "@angular/forms";
import {GalleryImageViewerComponent} from "../gallery-image-viewer/gallery-image-viewer.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxPaginationModule} from "ngx-pagination";
import {NoContentComponent} from "../no-content/no-content.component";
import {PageLoaderComponent} from "../page-loader/page-loader.component";
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {Product} from "../../../interfaces/common/product.interface";
import {Select} from "../../../interfaces/core/select";
import {DATA_STATUS} from "../../../core/utils/app-data";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ProductService} from "../../../services/common/product.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../ui/confirm-dialog/confirm-dialog.component";
import {DatePipe, NgClass, TitleCasePipe} from "@angular/common";
import {TableDetailsDialogComponent} from "../../dialog-view/table-details-dialog/table-details-dialog.component";

@Component({
  selector: 'app-all-product-trash',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    GalleryImageViewerComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NgxPaginationModule,
    NoContentComponent,
    PageLoaderComponent,
    NgClass,
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './all-product-trash.component.html',
  styleUrl: './all-product-trash.component.scss'
})
export class AllProductTrashComponent extends DataTableSelectionBase(Component) implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm') private searchForm: NgForm;

  // Store Data
  override allTableData: Product[] = [];
  private holdPrevUsers: Product[] = [];
  dataStatus: Select[] = DATA_STATUS;
  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    name: 1,
    images: 1,
    createdAt: 1,
    brand: 1,
    costPrice: 1,
    salePrice: 1,
    discountType: 1,
    discountAmount: 1,
    quantity: 1,
    category: 1,
    subCategory: 1,
    status: 1,
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
  activeFilter6: number = null;

  // Nav Data Breadcrumb
  navArray: NavBreadcrumb[] = [
    {name: 'Dashboard', url: `/dashboard`},
    {name: 'All Product', url: null},
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
  private readonly productService = inject(ProductService);
  private readonly clipboard = inject(Clipboard);

  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllProduct();
    });

    // Get Data from Param
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      if (!this.searchQuery) {
        this.getAllProduct();
      }
    });

    // Gallery Image View handle
    this.subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   * getAllProduct()
   * deleteMultipleUserById()
   * updateMultipleUserById()
   */
  private getAllProduct() {
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {...this.filter,...{status:'trash'}},
      select: this.select,
      sort: this.sortQuery
    }

    // Start Request Time
    this.reqStartTime = new Date();

    this.subDataGetAll = this.productService.getAllProducts(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.allTableData = res.data;
          if (this.allTableData && this.allTableData.length) {
            this.allTableData.forEach((m, i) => {
              const index = this.selectedIds.findIndex(f => f === m._id);
              this.allTableData[i].select = index !== -1;
            });

            this.totalData = res.count;
            if (!this.searchQuery) {
              if (this.currentPage === 1) {
                this.holdPrevUsers = res.data;
                this.totalDataStore = res.count;
              }
            }

            this.checkSelectionData();
          }

          // Response Time Loader
          this.calculateReqTimeAndHideLoader();
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private deleteMultipleUserById() {
    this.subDataDeleteMulti = this.productService.deleteMultipleProductById(this.selectedIds)
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
      })
  }

  private updateMultipleProductById(data: any) {
    this.subDataUpdateMulti = this.productService.updateMultipleProductById(this.selectedIds, data)
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
      })
  }

  /**
   * Request Time Calculate and Loader Logic
   * calculateReqTimeAndHideLoader()
   */
  private calculateReqTimeAndHideLoader() {
    // Response Time Loader
    this.reqEndTime = new Date;
    const totalReqTimeInSec = (this.reqEndTime.getTime() - this.reqStartTime.getTime()) / 1000;
    if (totalReqTimeInSec < 1) {
      setTimeout(() => {
        this.isLoading = false;
      }, 500)
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Filter & Sort Methods
   * sortData()
   * filterData()
   */
  sortData(query: any, type: number, name: string) {
    this.sortQuery = query;
    this.activeSort = type;
    this.activeSortName = name;
    this.getAllProduct();
  }

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'status': {
        this.filter = {...this.filter, ...{'status': value}};
        this.activeFilter6 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProduct();
    }
  }

  /**
   * Table & Table Methods
   * onClearDataQuery()
   */
  onClearDataQuery() {
    this.activeSort = null;
    this.activeSortName = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter6 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}}).then();
    } else {
      this.getAllProduct();
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openDetailsDialog()
   */
  public openConfirmDialog(type: string, data?: any) {
    if (type === 'delete') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want delete this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.deleteMultipleUserById();
        }
      });
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
          this.updateMultipleProductById(data);
        }
      });
    }
  }

  transformData(originalData: any, datePipe: DatePipe): any {

    return {
      Name: originalData?.name,
      Category: originalData.category?.name,
      Sub_Category: originalData.subCategory?.name,
      SalePrice: originalData.salePrice,
      Available_quantity: originalData.quantity,
      createdAt: datePipe.transform(originalData.createdAt, 'yyyy-MM-dd'),
    };
  }

  openDetailsDialog(data: any): void {
    const datePipe = new DatePipe('en-US');
    const transformedData = this.transformData(data, datePipe);
    console.log('originalData', transformedData)
    this.dialog.open(TableDetailsDialogComponent, {
      data: {data: transformedData, nestedFieldName: 'name'},
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
