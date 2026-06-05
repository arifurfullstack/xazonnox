import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableSelectionBase} from "../../../mixin/data-table-select-base.mixin";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Select} from "../../../interfaces/core/select";
import {DATA_STATUS, OVERVIEW_FILTER, TABLE_TAB_DATA} from "../../../core/utils/app-data";
import {debounceTime, distinctUntilChanged, map, filter, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {
  TableDetailsDialogComponent
} from "../../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import {ExpenseService} from "../../../services/common/expense.service";
import {DatePipe} from "@angular/common";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {UtilsService} from "../../../services/core/utils.service";

@Component({
  selector: 'app-all-expense',
  templateUrl: './all-expense.component.html',
  styleUrl: './all-expense.component.scss',
  providers: [DatePipe]
})
export class AllExpenseComponent extends DataTableSelectionBase(Component) implements AfterViewInit, OnInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm', {static: true}) private searchForm: NgForm;

  // Store Data
  override allTableData: any[] = [];
  protected categories: any[] = [];
  protected totalExpense: any;
  protected dataStatus: Select[] = DATA_STATUS;
  protected tableTabData: Select[] = TABLE_TAB_DATA;
  protected selectedTab: string = this.tableTabData[0].value;

  // Gallery View
  protected isGalleryOpen: boolean = false;
  protected galleryImages: string[] = [];
  protected selectedImageIndex: number = 0;

  // Pagination
  protected currentPage = 1;
  protected totalData = 0;
  protected dataPerPage = 10;


  protected readonly overviewFilters: Select[] = OVERVIEW_FILTER;
  // Active Filter Data
  selectedOverviewFilter: Select = null;
  // Date Filter
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Filter
  filter: any = null;
  defaultFilter: any = null;
  searchQuery = null;
  private sortQuery = {createdAt: -1};
  private readonly select: any = {
    name: 1,
    category: 1,
    images: 1,
    description: 1,
    serial: 1,
    cost: 1,
    commission: 1,
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
  private readonly expenseService = inject(ExpenseService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly datePipe = inject(DatePipe);
  public override readonly utilsService = inject(UtilsService);


  ngOnInit() {
    // Reload Data
    const subReload = this.reloadService.refreshData$.subscribe(() => {
      this.filter = null;
      this.getAllCategories();
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

      this.getAllCategories();
    });
    this.subscriptions.push(subActivateRoute);

    // Base Data
    this.setPageData();
    this.initImageGalleryView();
    this.setDefaultFilter();
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
    this.title.setTitle('Expense');
    this.pageDataService.setPageData({
      title: 'Expense',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Expense', url: null},
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
   * Filter
   * setDefaultFilter()
   * endChangeRegDateRange()
   * onFilterChange()
   * isFilterChange()
   * dateFilterTitle()
   * onClearFilter()
   */
  private setDefaultFilter() {
    this.selectedOverviewFilter = this.overviewFilters[0];

    const startDate = this.utilsService.getDateString(new Date());
    const endDate = this.utilsService.getDateString(new Date());

    this.defaultFilter = {createdAt: {$gte: startDate, $lte: endDate}};
    this.filter = this.defaultFilter;
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );
      this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
      // Re fetch Data
      this.getAllCategories();
    }
  }

  onFilterChange(type: 'overviewFilter', value: string) {
    if (type === 'overviewFilter') {
      this.selectedOverviewFilter = this.overviewFilters.find(f => f.value === value);
      let startDate: string, endDate: string;
      const today = new Date();
      switch (value) {
        case 'today':
          startDate = this.utilsService.getDateString(new Date());
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;
        case 'lastDays':
          const yesterday = new Date(today.setDate(today.getDate() - 1));
          startDate = this.utilsService.getDateString(yesterday);
          endDate = this.utilsService.getDateString(yesterday);
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;
        case 'thisWeek':
          const currentWeekDay = today.getDay(); // Sunday is 0, Monday is 1, and so on.
          const startOfWeek = new Date(today.setDate(today.getDate() - currentWeekDay));
          startDate = this.utilsService.getDateString(startOfWeek);
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;

        case 'lastWeek':
          const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
          const lastWeekStart = new Date(today.setDate(today.getDate() - 6)); // 6 days before the end of last week.
          startDate = this.utilsService.getDateString(lastWeekStart);
          endDate = this.utilsService.getDateString(lastWeekEnd);
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;

        case 'last7Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 7)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;

        case 'last15Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 15)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;

        case 'last30Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 30)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;

        case 'thisMonth':
          startDate = this.utilsService.getDateString(new Date(today.getFullYear(), today.getMonth(), 1));
          endDate = this.utilsService.getDateString(today);
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;

        case 'lastMonth':
          const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
          startDate = this.utilsService.getDateString(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1));
          endDate = this.utilsService.getDateString(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0));
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;
        default:
          startDate = this.utilsService.getDateString(new Date());
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {createdAt: {$gte: startDate, $lte: endDate}};
          break;
      }
    }

    // Fetch Data
    this.getAllCategories();

  }

  get isFilterChange(): boolean {
    if (!this.filter) {
      return false;
    } else {
      return !this.utilsService.checkObjectDeepEqual(this.defaultFilter, this.filter);
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

  onClearFilter() {
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    this.getAllCategories();
  }


  /**
   * HTTP REQ HANDLE
   * getAllCategories()
   * getAllCategories()
   * deleteMultipleCategoryById()
   * updateMultipleUserById()
   */


  private getAllCategories() {
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

    const subscription = this.expenseService.getAllCategories(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.totalExpense = res;
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

  private deleteMultipleCategoryById() {
    const subscription = this.expenseService.deleteMultipleCategoryById(this.selectedIds)
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

  private updateMultipleCategoryById(data: any) {
    const subscription = this.expenseService.updateMultipleCategoryById(this.selectedIds, data)
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
      this.getAllCategories();
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
    this.getAllCategories();
  }

  filterData(value: any, type: 'category', index: number,) {
    switch (type) {
      case 'category': {
        if (value) {
          this.filter = {...this.filter, ...{'category._id': value}};
          this.activeFilter1 = index;
        } else {
          delete this.filter['category._id'];
          this.activeFilter1 = null;
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
    this.filter = null;
    this.getAllCategories();
  }

  // get isFilterChange(): boolean {
  //   if (!this.filter) {
  //     return false;
  //   } else {
  //     return !this.utilsService.checkObjectDeepEqual(this.defaultFilter ?? {}, this.filter ?? {}, 'status');
  //   }
  // }


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
          this.deleteMultipleCategoryById();
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
          this.updateMultipleCategoryById(data);
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
