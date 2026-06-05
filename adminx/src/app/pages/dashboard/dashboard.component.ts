import {AfterViewInit, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ADMIN_MENU_DB} from '../../core/db/admin-menu.db';
import {PageDataService} from "../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {DataTableSelectionBase} from "../../mixin/data-table-select-base.mixin";
import {NOTIFICATION_DASHBOARD_DB} from "../../core/db/notification-dashboard.db";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends DataTableSelectionBase(Component) implements OnInit {

  // Static Data
  readonly adminMenu = ADMIN_MENU_DB;
  notifications = NOTIFICATION_DASHBOARD_DB;


  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);

  ngOnInit(){
    // Base Data
    this.setPageData();
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Dashboard');
    this.pageDataService.setPageData({
      title: 'Dashboard',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Dashboard', url: 'https://www.youtube.com/embed/QusKeCi-Oyo'},
      ]
    })
  }


}
