import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../../interfaces/core/select";
import {OVERVIEW_FILTER} from "../../../../core/utils/app-data";
import {FormControl, FormGroup} from "@angular/forms";
import {DashboardService} from "../../../../services/common/dashboard.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {Title} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";
import {PageDataService} from "../../../../services/core/page-data.service";
import {VendorService} from "../../../../services/vendor/vendor.service";
import {Subscription} from "rxjs";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {User} from "../../../../interfaces/common/user.interface";

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
  providers: [DatePipe]
})
export class DashboardCardComponent implements OnInit, OnDestroy {

  @Input() userData!: User;
  @Input() phoneNo!: any;

  // Store Data
  dashboardData: any;
  defaultFilter: any;
  filter: any;
  protected readonly overviewFilters: Select[] = OVERVIEW_FILTER;

  // Active Filter Data
  selectedOverviewFilter: Select = null;


  // Date Filter
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Inject
  private readonly dashboardService = inject(DashboardService);
  private readonly utilsService = inject(UtilsService);
  private readonly title = inject(Title);
  private readonly datePipe = inject(DatePipe);
  private readonly pageDataService = inject(PageDataService);
  private readonly vendorService = inject(VendorService);

  // Subscriptions
  private subGetVendorDashboard: Subscription;



  ngOnInit() {
    // Default Data & Filter
    this.setPageData();
    this.setDefaultFilter();

    // Base Data

    if (this.userData || this.phoneNo) {
      this.getUserDashboard();
    }


  }

  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('User Dashboard');
    this.pageDataService.setPageData({
      title: 'User Dashboard',
      navArray: []
    })
  }


  /**
   * HTTP Req Handle
   * getUserDashboard()
   */

  private getUserDashboard() {
    const orConditions: any[] = [];

    if (this.userData) {
      orConditions.push({ user: this.userData._id });
      orConditions.push({ phoneNo: this.userData.phoneNo });
    } else if (this.phoneNo) {
      orConditions.push({ phoneNo: this.phoneNo });
    }

    const filterData: FilterData = {
      pagination: null,
      filter: {
        ...this.filter,
        ...(orConditions.length ? { $or: orConditions } : {})
      }
    };

    this.subGetVendorDashboard = this.dashboardService.getAllDashboardOrders(filterData, null)
      .subscribe({
        next: res => {
          this.dashboardData = res.data;
        },
        error: err => {
          console.log(err);
        }
      });
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

    this.defaultFilter = {checkoutDate: {$gte: startDate, $lte: endDate}};
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
      this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
      // Re fetch Data
      this.getUserDashboard();
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
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;
        case 'lastDays':
          const yesterday = new Date(today.setDate(today.getDate() - 1));
          startDate = this.utilsService.getDateString(yesterday);
          endDate = this.utilsService.getDateString(yesterday);
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;
        case 'thisWeek':
          const currentWeekDay = today.getDay(); // Sunday is 0, Monday is 1, and so on.
          const startOfWeek = new Date(today.setDate(today.getDate() - currentWeekDay));
          startDate = this.utilsService.getDateString(startOfWeek);
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;

        case 'lastWeek':
          const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
          const lastWeekStart = new Date(today.setDate(today.getDate() - 6)); // 6 days before the end of last week.
          startDate = this.utilsService.getDateString(lastWeekStart);
          endDate = this.utilsService.getDateString(lastWeekEnd);
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;

        case 'last7Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 7)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;

        case 'last15Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 15)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;

        case 'last30Days':
          startDate = this.utilsService.getDateString(new Date(today.setDate(today.getDate() - 30)));
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;

        case 'thisMonth':
          startDate = this.utilsService.getDateString(new Date(today.getFullYear(), today.getMonth(), 1));
          endDate = this.utilsService.getDateString(today);
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;

        case 'lastMonth':
          const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
          startDate = this.utilsService.getDateString(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1));
          endDate = this.utilsService.getDateString(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0));
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;
        default:
          startDate = this.utilsService.getDateString(new Date());
          endDate = this.utilsService.getDateString(new Date());
          this.filter = {checkoutDate: {$gte: startDate, $lte: endDate}};
          break;
      }
    }

    // Fetch Data
    this.getUserDashboard();

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
    this.getUserDashboard();
  }

  /**
   * Access Control
   * isAccess()
   */
  isAccess(type: string): boolean {
    const isExist = this.vendorService.userMenu.find(f => f.routerLink === type);
    return !!isExist;
  }

  /**
   * ON Destroy
   */

  ngOnDestroy() {
    this.subGetVendorDashboard?.unsubscribe();
  }


}
