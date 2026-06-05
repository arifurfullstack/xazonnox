import {Component, inject} from '@angular/core';
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrl: './my-subscription.component.scss'
})
export class MySubscriptionComponent {


  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);

  ngOnInit(){
    this.setPageData();
  }

  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('My Subscription');
    this.pageDataService.setPageData({
      title: 'My Subscription',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'My Subscription', url: null},
      ]
    })
  }

}
