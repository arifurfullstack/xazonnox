import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {DataTableSelectionBase} from "../../../../mixin/data-table-select-base.mixin";
import {NgForm} from "@angular/forms";
import {ChildCategory} from "../../../../interfaces/common/child-category.interface";
import {Category} from "../../../../interfaces/common/category.interface";
import {SubCategory} from "../../../../interfaces/common/sub-category.interface";
import {Select} from "../../../../interfaces/core/select";
import {DATA_STATUS, TABLE_TAB_DATA} from "../../../../core/utils/app-data";
import {debounceTime, distinctUntilChanged, map, filter, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../../services/core/ui.service";
import {ReloadService} from "../../../../services/core/reload.service";
import {SubCategoryService} from "../../../../services/common/sub-category.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {CategoryService} from "../../../../services/common/category.service";
import {ChildCategoryService} from "../../../../services/common/child-category.service";
import {PageDataService} from "../../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {Pagination} from "../../../../interfaces/core/pagination";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {
  TableDetailsDialogComponent
} from "../../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {VendorService} from "../../../../services/vendor/vendor.service";

@Component({
  selector: 'app-all-child-category',
  templateUrl: './all-child-category.component.html',
  styleUrl: './all-child-category.component.scss'
})
export class AllChildCategoryComponent extends DataTableSelectionBase(Component) implements AfterViewInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm', {static: true}) private searchForm: NgForm;

  // Store Data
  override allTableData: ChildCategory[] = [];
  protected categories: Category[] = [];
  protected subCategories: SubCategory[] = [];
  protected dataStatus: Select[] = DATA_STATUS;
  protected tableTabData: Select[] = TABLE_TAB_DATA;
  protected selectedTab: string = this.tableTabData[0].value;
  protected adminRole:any;

  // Gallery View
  protected isGalleryOpen: boolean = false;
  protected galleryImages: string[] = [];
  protected selectedImageIndex: number = 0;

  // Pagination
  protected currentPage = 1;
  protected totalData = 0;
  protected dataPerPage = 10;

  // Filter
  filter: any = null;
  defaultFilter: any = null;
  searchQuery = null;
  private sortQuery = {createdAt: -1};
  private readonly select: any = {
    name: 1,
    category: 1,
    subCategory: 1,
    images: 1,
    deleteDateString: 1,
    status: 1,
    priority: 1,
  }

  // Loading
  isLoading: boolean = true;

  // Active Data Store
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly clipboard = inject(Clipboard);
  private readonly categoryService = inject(CategoryService);
  private readonly childCategoryService = inject(ChildCategoryService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly vendorService = inject(VendorService);

  ngOnInit() {
    this.adminRole = this.vendorService.getUserRole();
    // Reload Data
    const subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllChildCategories();
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

      this.getAllChildCategories();
    });
    this.subscriptions.push(subActivateRoute);

    // Base Data
    this.setPageData();
    this.getAllCategories();
    this.getAllSubCategories();
    this.getAllChildCategories();
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
    this.title.setTitle('Child Category');
    this.pageDataService.setPageData({
      title: 'Child Category',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Child Category', url: null},
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
    } else {
      this.filter = {status: data}
    }
    this.onClearSelection();
    this.onClearDataQuery(this.filter);
  }


  /**
   * HTTP REQ HANDLE
   * getAllCategories()
   * getAllSubCategories()
   * deleteMultipleChildCategoryById()
   * updateMultipleUserById()
   */

  private getAllCategories() {
    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: {
        name: 1,
      },
      sort: {name: 1}
    }
    const subscription = this.categoryService.getAllCategories(filterData, null)
      .subscribe({
        next: res => {
          this.categories = res.data;
        },
        error: error => {
          console.log(error);
        }
      });
    this.subscriptions.push(subscription);
  }

  private getAllSubCategories() {
    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: {
        name: 1,
      },
      sort: {name: 1}
    }
    const subscription = this.subCategoryService.getAllSubCategories(filterData, null)
      .subscribe({
        next: res => {
          this.subCategories = res.data;
        },
        error: error => {
          console.log(error);
        }
      });
    this.subscriptions.push(subscription);
  }


  private getAllChildCategories() {
    // console.log('getAllSubCategories')
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

    const subscription = this.childCategoryService.getAllChildCategories(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.allTableData = res.data;
          // console.log("this.allTableData child category", this.allTableData)
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

  private deleteMultipleChildCategoryById() {
    const subscription = this.childCategoryService.deleteMultipleChildCategoryById(this.selectedIds)
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

  private updateMultipleChildCategoryById(data: any) {
    const subscription = this.childCategoryService.updateMultipleChildCategoryById(this.selectedIds, data)
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
      this.getAllChildCategories();
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
    this.getAllChildCategories();
  }

  filterData(value: any, type: any, index: number,) {
    switch (type) {
      case 'category': {
        if (value) {
          this.filter = {...this.filter, ...{'category._id': value}};
          this.activeFilter1 = index;
        }
        else {
          delete this.filter['category._id'];
          this.activeFilter1 = null;
        }
        break;
      }
      case 'subCategory': {
        if (value) {
          this.filter = {...this.filter, ...{'subCategory._id': value}};
          this.activeFilter2 = index;
        }
        else {
          delete this.filter['subCategory._id'];
          this.activeFilter2 = null;
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
    this.activeSort = null;
    this.activeFilter1 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = filter ?? null;
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
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want delete this data?'
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.deleteMultipleChildCategoryById();
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
          this.updateMultipleChildCategoryById(data);
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
  private deleteAllTrashByShop() {
    const subscription = this.childCategoryService.deleteAllTrashByShop()
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
