import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {DATA_STATUS, MONTHS, ORDER_STATUS} from "../../../core/utils/app-data";
import {Category} from "../../../interfaces/common/category.interface";
import {SubCategory} from "../../../interfaces/common/sub-category.interface";
import {Brand} from "../../../interfaces/common/brand.interface";
import {NavBreadcrumb} from "../../../interfaces/core/nav-breadcrumb.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ProductService} from "../../../services/common/product.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {CategoryService} from "../../../services/common/category.service";
import {SubCategoryService} from "../../../services/common/sub-category.service";
import {BrandService} from "../../../services/common/brand.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {DatePipe} from "@angular/common";
import {
  TableDetailsDialogComponent
} from "../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {NgForm} from "@angular/forms";
import {Product} from "../../../interfaces/common/product.interface";

@Component({
  selector: 'app-top-product',
  templateUrl: './top-product.component.html',
  styleUrl: './top-product.component.scss'
})
export class TopProductComponent extends DataTableSelectionBase(Component) implements OnInit, OnDestroy {
  todayDate1 = new Date();

  // Decorator
  @ViewChild('searchForm') private searchForm: NgForm;
  selectedMonth: number = new Date().getMonth() + 1;
  // Store Data
  override allTableData: Product[] = [];
  private holdPrevUsers: Product[] = [];
  dataStatus: Select[] = DATA_STATUS;
  month: Select[] = MONTHS;
  isGalleryOpen: boolean = false;
  galleryImages: string[] = [];
  selectedImageIndex: number = 0;
  categories: Category[]=[];
  subCategories: SubCategory[]=[];
  brands: Brand[]=[];
  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 3;
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
    isVariation: 1,
    variationList: 1,
    discountAmount: 1,
    totalSold: 1,
    quantity: 1,
    category: 1,
    subCategory: 1,
    status: 1,
  }

  // Search
  private searchUsers: any[] = [];
  searchQuery = null;

  // Sort
  private sortQuery = {totalSold: -1};

  // Loading Control
  isLoading: boolean = true;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Active Data Store
  activeSortName: string = null;
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter3: number = null;
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
  private subDataOne: Subscription;

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly productService = inject(ProductService);
  private readonly clipboard = inject(Clipboard);
  private readonly categoryService = inject(CategoryService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly brandService = inject(BrandService);

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
    this.getAllCategory();
    this.setDefaultFilter();
  }


  private setDefaultFilter() {
    this.filter = { month: this.selectedMonth }; // Set filter to 'Pending'
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
      // filter: {...this.filter,...{status: {$ne:'trash'}}},
      filter: {
        ...this.filter,
        ...(this.filter?.status ? {} : { status: { $ne: 'trash' } }) // Only add if status isn't set
      },
      // filter: this.filter,
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

        },
        error: err => {
          console.log(err)
        }
      })
  }

  private getAllCategory() {
    // Select
    const mSelect = {
      name: 1,
      image: 1,
      mobileImage: 1,
      createdAt: 1,
      serial: 1,
      status: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.categoryService
      .getAllCategories(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.categories = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
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
      // case 'status': {
      //   this.filter = {...this.filter, ...{'status': value}};
      //   this.activeFilter6 = index;
      //   break;
      // }
      case 'month': {
        this.filter = {...this.filter, ...{'month': value}};
        this.activeFilter6 = index;
        break;
      }
      case 'category': {
        this.filter = {...this.filter, ...{'category._id': value}};
        this.activeFilter1 = index;
        break;
      }
      case 'subCategory': {
        this.filter = {...this.filter, ...{'subCategory._id': value}};
        this.activeFilter2 = index;
        break;
      }
      case 'brand': {
        this.filter = {...this.filter, ...{'brand._id': value}};
        this.activeFilter3 = index;
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
    this.activeFilter3 = null;
    this.activeFilter6 = null;
    this.sortQuery = {totalSold: -1};
    this.filter = null;
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}}).then();
    } else {
      this.getAllProduct();
    }
  }


  transformData(originalData: any, datePipe: DatePipe): any {

    return {
      Name: originalData?.name,
      Category: originalData.category?.name,
      Sub_Category: originalData.subCategory?.name,
      SalePrice: originalData.salePrice,
      Available_quantity: originalData.quantity,
      createdAt:   datePipe.transform(originalData.createdAt, 'yyyy-MM-dd'),
    };
  }

  openDetailsDialog(data:any): void {
    const datePipe = new DatePipe('en-US');
    const transformedData = this.transformData(data, datePipe);
    console.log('originalData',transformedData)
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
    this.subDataOne?.unsubscribe();
  }

  // protected readonly month = ORDER_STATUS;
}
