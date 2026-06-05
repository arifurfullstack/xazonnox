import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Notification } from "../../../interfaces/common/notification.interface";
import { FilterData } from "../../../interfaces/core/filter-data";
import { Pagination } from "../../../interfaces/core/pagination";
import { NotificationService } from "../../../services/common/notification.service";
import { PageDataService } from "../../../services/core/page-data.service";
import { ReloadService } from "../../../services/core/reload.service";
import { UiService } from "../../../services/core/ui.service";
import { VendorDataService } from '../../../services/vendor/vendor-data.service';
import { VendorService } from '../../../services/vendor/vendor.service';
import { YoutubeVideoShowComponent } from "../../dialog-view/youtube-video-show/youtube-video-show.component";
import { CurrencyPipe } from "../../pipes/currency.pipe";
import { DayAgoPipe } from "../../pipes/day-ago.pipe";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    DayAgoPipe,
    CurrencyPipe,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Store Data
  @Output() onMenuToggle = new EventEmitter();
  @Input() shopInfo!: any;
  @Input() websiteInfo: any;
  @Input() shopPackageInfo: any;
  admin: any = null;
  isOpen = false;
  isNotificationVisible = false;

  isLoading = false;
  isLoadMore = false;
  private isNotificationLoading = false;


  // Pagination
  currentPage = 1;
  totalNotifications = 0;
  productsPerPage = 15;
  allNotifications: Notification[] = [];
  unReadNotifications: Notification[] = [];
  unreadNotificationCount: number = 0;


  // Subscriptions
  private subDataOne: Subscription;
  private subReload: Subscription;
  private subDataThree: Subscription;

  protected readonly pageDataService = inject(PageDataService);

  constructor(
    private vendorService: VendorService,
    private vendorDataService: VendorDataService,
    private eRef: ElementRef,
    private reloadService: ReloadService,
    private notificationService: NotificationService,
    private router: Router,
    private uiService: UiService,
    private dialog: MatDialog,
  ) {
  }


  ngOnInit() {
    // Reload Data
    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getLoginVendorInfo();
      });

    // Reload Data
    this.subReload = this.reloadService.refreshNotification$.subscribe(() => {
      this.getAllNotification();
    });

    this.getLoginVendorInfo();
    this.getAllNotification();

  }


  toggleNotification() {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.getAllNotification()
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isNotificationVisible = false;
    }
  }

  /**
   * HTTP Req Handle
   * getLoggedInAdminData()
   * adminLogOut()
   */
  private getLoginVendorInfo() {
    const select = 'username profileImg role name'
    this.subDataOne = this.vendorDataService.getLoggedInVendorData(select)
      .subscribe({
        next: res => {
          this.admin = res.data;

        },
        error: err => {
          console.log(err)
        }
      })
  }


  private getAllNotification(loadMore?: boolean) {

    if (this.isNotificationLoading) {
      console.log('Notification load already in progress, skipping duplicate.');
      return;
    }

    this.isNotificationLoading = true;



    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1
    };
    // Select
    const mSelect = {
      name: 1,
      isRead: 1,
      url: 1,
      image: 1,
      description: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: pagination,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.notificationService
      .getAllNotifications(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            // console.log("res.data",res.data)
            this.isLoading = false;
            this.isLoadMore = false;
            if (loadMore) {
              this.allNotifications = [...this.allNotifications, ...res.data];
            } else {
              this.allNotifications = res.data;
            }
            this.totalNotifications = res.count;
            this.unreadNotificationCount = res.unreadCount;
            this.unReadNotifications = this.allNotifications.filter(item => item.isRead === false);

            this.isNotificationLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isNotificationLoading = false;
          // handle data
        },
      });
  }

  onLoadMore() {
    if (this.totalNotifications > this.allNotifications.length) {
      this.isLoadMore = true;
      this.currentPage += 1;
      this.getAllNotification(true);
    }
  }

  onChangeStatus(id: string, data: { isRead: boolean }, navigateUrl?: string) {
    this.updatePopupById(id, data, navigateUrl)
    this.isNotificationVisible = false;
  }

  onDeleteNotification(id: string,) {
    this.deleteNotificationById(id)
  }


  private updatePopupById(id: string, data: any, navigateUrl?: string) {
    this.subDataThree = this.notificationService
      .updateNotificationById(id, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.reloadService.needRefreshNotification();
            if (navigateUrl) {
              this.router.navigate([navigateUrl]);
            }
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  private deleteNotificationById(id: any) {
    this.notificationService.deleteNotificationById(id)
      .subscribe(res => {
        this.uiService.message(res.message, 'success');
        this.reloadService.needRefreshNotification();
      }, error => {
        console.log(error);
      });
  }

  adminLogOut() {
    this.vendorService.userLogOut(true);
  }

  /**
   * On Click
   * onToggle()
   */
  onClickMenu() {
    this.isOpen = !this.isOpen;
    this.onMenuToggle.emit(this.isOpen);
  }

  public openYoutubeVideoDialog(event: MouseEvent, url: string) {
    if (url == null) {
      this.uiService.message('There is no video', 'warn');
      return;
    }
    event.stopPropagation();
    const dialogRef = this.dialog.open(YoutubeVideoShowComponent, {
      data: {url: url},
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '700px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }


  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
  }


  protected readonly Math = Math;
}
