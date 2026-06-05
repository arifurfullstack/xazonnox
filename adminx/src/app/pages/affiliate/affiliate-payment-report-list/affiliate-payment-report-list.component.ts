import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { adminBaseMixin } from '../../../mixin/admin-base.mixin';
import { AffiliatePaymentReport } from '../../../interfaces/common/affiliate-payment-report.interface';
import { NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { NavBreadcrumb } from '../../../interfaces/core/nav-breadcrumb.interface';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Subscription
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UiService } from '../../../services/core/ui.service';
import { UtilsService } from '../../../services/core/utils.service';
import { ReloadService } from '../../../services/core/reload.service';
import { AffiliatePaymentReportService } from '../../../services/common/affiliate-payment-report.service';
import { switchMap } from 'rxjs/operators';
import { Pagination } from '../../../interfaces/core/pagination';
import { FilterData } from '../../../interfaces/gallery/filter-data';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { AffiliateReportsService } from '../../../services/common/affiliate-reports.service';
import {VendorService} from "../../../services/vendor/vendor.service";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-affiliate-payment-report-list',
  templateUrl: './affiliate-payment-report-list.component.html',
  styleUrl: './affiliate-payment-report-list.component.scss'
})
export class AffiliatePaymentReportListComponent
  extends adminBaseMixin(Component)
  implements OnDestroy
{
  // Store Data
  affiliatePaymentReports: AffiliatePaymentReport[] = [];
  private holdPrevUsers: AffiliatePaymentReport[] = [];

  affiliateReport: any;
  userId: string;
  affiliateId: string;
  type: string;

  // Pagination
  currentPage = 1;
  totalData = 0;
  dataPerPage = 100;
  totalDataStore = 0;
  totalAmount = 0;

  // Filter
  filter: any = null;
  private readonly select: any = {
    amount: 1,
    createdAt: 1,
    paymentMethod: 1,
    note: 1,
    dateString: 1,
    affiliate: 1,
    method: 1,
    status: 1,
    image: 1
  };

  // Search
  @ViewChild('searchForm') private searchForm: NgForm;
  searchQuery = null;

  // Sort
  private sortQuery = { createdAt: -1 };

  // Selected Data
  isIndeterminate = false;
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') private matCheckbox: MatCheckbox;

  // Loading Control
  isLoading = true;
  private reqStartTime: Date = null;
  private reqEndTime: Date = null;

  // Active Data Store
  activeSortName: string = null;
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;

  // Nav Data
  navArray: NavBreadcrumb[] = [
    { name: 'Dashboard', url: `/dashboard` },
    { name: 'All AffiliatePaymentReport', url: null }
  ];

  isGalleryOpen = false;
  galleryImages: string[] = [];
  selectedImageIndex = 0;

  // Subscriptions
  private subActivateRoute: Subscription;
  private subSearch: Subscription;
  private subReload: Subscription;
  private subDataGetAll: Subscription;
  private subDataDeleteMulti: Subscription;
  private subDataUpdateMulti: Subscription;
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly uiService = inject(UiService);
  private readonly utilsService = inject(UtilsService);
  private readonly reloadService = inject(ReloadService);
  private readonly affiliatePaymentReportDataService = inject(AffiliatePaymentReportService);
  private readonly affiliateReportsService = inject(AffiliateReportsService);
  private readonly vendorService = inject(VendorService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);


  ngOnInit() {
    this.subActivateRoute = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.affiliateId = qParam.get('affiliate');
      this.type = qParam.get('type');
      if (this.affiliateId && this.type) {
        this.getAllAffiliateReports();
      }
    });

    this.initImageGalleryView();
    // Base Data
    this.setPageData();
  }

  private getAllAffiliateReports() {
    const pagination: Pagination = {
      pageSize: this.dataPerPage,
      currentPage: this.currentPage - 1
    };

    const filterData: FilterData = {
      pagination,
      filter: {
        ...this.filter,
        affiliate: this.affiliateId,
        type: this.type,
        status: 'paid',
        ownerId: this.vendorService.getShopId(),
        ownerType: 'shop'
      },
      select: this.select,
      sort: this.sortQuery
    };

    this.reqStartTime = new Date();

    this.subDataGetAll = this.affiliateReportsService
      .getAllAffiliateReports(filterData, this.searchQuery)
      .subscribe({
        next: (res) => {
          this.affiliateReport = res.data;
          this.totalAmount = res.totalAmount;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      });
  }

  private getAllAffiliatePaymentReports() {
    const pagination: Pagination = {
      pageSize: this.dataPerPage,
      currentPage: this.currentPage - 1
    };

    const filterData: FilterData = {
      pagination,
      filter: {
        ...this.filter,
        refferId: this.userId
      },
      select: this.select,
      sort: this.sortQuery
    };

    this.reqStartTime = new Date();

    this.subDataGetAll = this.affiliatePaymentReportDataService
      .getAllAffiliatePaymentReports(filterData, this.searchQuery)
      .subscribe({
        next: (res) => {
          this.affiliatePaymentReports = res.data;
          this.affiliatePaymentReports.forEach((m, i) => {
            m.select = this.selectedIds.includes(m._id);
          });

          this.totalData = res.count;
          if (!this.searchQuery && this.currentPage === 1) {
            this.holdPrevUsers = res.data;
            this.totalDataStore = res.count;
          }

          this.checkSelectionData();
          this.calculateReqTimeAndHideLoader();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  private updateMultipleUserById(data: any) {
    this.subDataUpdateMulti = this.affiliatePaymentReportDataService
      .updateMultipleAffiliatePaymentReportById(this.selectedIds, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.selectedIds = [];
            this.reloadService.needRefreshData$();
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'wrong');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  private deleteMultipleUserById() {
    this.subDataDeleteMulti = this.affiliatePaymentReportDataService
      .deleteMultipleAffiliatePaymentReportById(this.selectedIds)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.selectedIds = [];
            this.uiService.message(res.message, 'success');
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } }).then();
            } else {
              this.reloadService.needRefreshData$();
            }
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  private calculateReqTimeAndHideLoader() {
    this.reqEndTime = new Date();
    const totalReqTimeInSec = (this.reqEndTime.getTime() - this.reqStartTime.getTime()) / 1000;
    if (totalReqTimeInSec < 1) {
      setTimeout(() => (this.isLoading = false), 500);
    } else {
      this.isLoading = false;
    }
  }

  private checkSelectionData() {
    const isAllSelect = this.affiliatePaymentReports.every((m) => m.select);
    this.matCheckbox.checked = isAllSelect;
  }

  sortData(query: any, type: number, name: string) {
    this.sortQuery = query;
    this.activeSort = type;
    this.activeSortName = name;
    this.getAllAffiliatePaymentReports();
  }

  onClearDataQuery() {
    this.activeSort = null;
    this.activeSortName = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } }).then();
    } else {
      this.getAllAffiliatePaymentReports();
    }
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle(' Payment Report');
    this.pageDataService.setPageData({
      title: 'Payment Report',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Payment Report', url: null},
      ]
    })
  }

  public openConfirmDialog(type: string, data?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: `Confirm ${type === 'delete' ? 'Delete' : 'Edit'}`,
        message: `Are you sure you want to ${type} this data?`
      }
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (type === 'delete') this.deleteMultipleUserById();
        if (type === 'edit') this.updateMultipleUserById(data);
      }
    });
  }

  openGallery(event: MouseEvent, images: string | string[], index: number = 0): void {
    event.stopPropagation();
    this.galleryImages = Array.isArray(images) ? images : [images];
    this.selectedImageIndex = index;
    this.isGalleryOpen = true;

    this.router.navigate([], {
      queryParams: { 'gallery-image-view': true },
      queryParamsHandling: 'merge'
    });
  }

  closeGallery(): void {
    this.isGalleryOpen = false;
    this.router.navigate([], {
      queryParams: { 'gallery-image-view': null },
      queryParamsHandling: 'merge'
    }).then();
  }

  private initImageGalleryView() {
    const subGalleryImageView = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (!qParam.get('gallery-image-view')) {
        this.closeGallery();
      }
    });
    this.subscriptions.push(subGalleryImageView);
  }

  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } }).then();
  }

  ngOnDestroy() {
    this.subActivateRoute?.unsubscribe();
    this.subReload?.unsubscribe();
    this.subSearch?.unsubscribe();
    this.subDataGetAll?.unsubscribe();
    this.subDataDeleteMulti?.unsubscribe();
    this.subDataUpdateMulti?.unsubscribe();
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }
}
