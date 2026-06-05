import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Clipboard} from '@angular/cdk/clipboard';
import {debounceTime, distinctUntilChanged, filter, map, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {DataTableSelectionBase} from '../../mixin/data-table-select-base.mixin';
import {DATA_STATUS, TABLE_TAB_OTHERS} from "../../core/utils/app-data";
import {Select} from "../../interfaces/core/select";
import {UiService} from "../../services/core/ui.service";
import {ReloadService} from "../../services/core/reload.service";
import {ReviewService} from "../../services/common/review.service";
import {PageDataService} from "../../services/core/page-data.service";
import {Pagination} from "../../interfaces/core/pagination";
import {FilterData} from "../../interfaces/core/filter-data";
import {ConfirmDialogComponent} from "../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {
  TableDetailsDialogComponent
} from "../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {Shop} from "../../interfaces/common/shop.interface";
import {ShopService} from "../../services/common/shop.service";
import {DATABASE_KEY} from "../../core/utils/global-variable";
import {StorageService} from "../../services/core/storage.service";


// @ts-ignore
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent extends DataTableSelectionBase(Component) implements AfterViewInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm', {static: true}) private searchForm: NgForm;

  // Store Data
  override allTableData: any[] = [];
  protected dataStatus: Select[] = DATA_STATUS;
  protected tableTabData: Select[] = TABLE_TAB_OTHERS;
  protected selectedTab: string = this.tableTabData[0].value;
  protected shop?: Shop;
  protected shopId?: string;

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
    title: 1,
    name: 1,
    images: 1,
    product: 1,
    rating: 1,
    review: 1,
    description: 1,
    url: 1,
    deleteDateString: 1,
    urlType: 1,
    type: 1,
    createdAt: 1,
    status: 1,
    priority: 1,
  }

  // Loading
  isLoading: boolean = true;

  // Active Data Store
  activeSort: number = null;
  activeFilter1: number = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly clipboard = inject(Clipboard);
  private readonly reviewService = inject(ReviewService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly shopService = inject(ShopService);
  private readonly storageService = inject(StorageService);


  ngOnInit() {
    // Reload Data
    const subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllReview();
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
      this.getAllReview();
    });
    this.subscriptions.push(subActivateRoute);

    // Base Data
    this.setPageData();
    this.getAllReview();
    this.initImageGalleryView();
    this.shopId = this.storageService.getDataFromEncryptLocal(
      DATABASE_KEY.encryptShop
    )?.shop;
    if (this.shopId){
      this.getShopById();
    }

    // this.getUpdatedProductReviews();
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
    this.title.setTitle('Review');
    this.pageDataService.setPageData({
      title: 'Review',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Review', url: 'https://www.youtube.com/embed/2bAgtL1YI_E'},
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
   * getAllReview()
   * deleteMultipleReviewById()
   * updateMultipleReviewById()
   */

  private getAllReview() {
    // console.log('getAllReview')
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: this.filter,
      select: this.select,
      sort: this.sortQuery
    }

    const subscription = this.reviewService.getAllReviewsShop(filterData,this.searchQuery)
      .subscribe({
        next: res => {
          this.allTableData = res.data;
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


  private getUpdatedProductReviews() {
    const subscription = this.reviewService.getUpdatedProductReviews()
      .subscribe({
        next: res => {
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private deleteMultipleReviewById() {
    const subscription = this.reviewService.deleteMultipleReviewById(this.selectedIds)
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

  private updateMultipleReviewById(data: any) {
    const subscription = this.reviewService.updateMultipleReviewById(this.selectedIds, data)
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

  private getShopById() {
    const subscription = this.shopService.getShopById(this.shopId).subscribe({
      next: (res) => {
        if (res.data) {
          this.shop = res.data;
        }
      },
      error: (error) => {
        console.log(error);
      },
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
      this.getAllReview();
    }
  }

  sortData(query: any, type: number) {
    console.log("query, type",query, type);
    if (this.activeSort === type) {
      this.sortQuery = {createdAt: -1};
      this.activeSort = null;
    } else {
      this.sortQuery = query;
      this.activeSort = type;
    }
    this.getAllReview();
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
          this.deleteMultipleReviewById();
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
          this.updateMultipleReviewById(data);
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
    const subscription = this.reviewService.deleteAllTrashByShop()
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
