import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private refreshUser = new Subject<void>();
  private refreshData = new Subject<void>();
  private refreshNotification = new Subject<void>();
  private refreshIncompleteOrder = new Subject<void>();
  private refreshSticky = new Subject();
  /**
   * REFRESH GLOBAL DATA
   */
  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }

  /**
   * REFRESH GLOBAL INCOMPLETE ORDER
   */
  get refreshIncompleteOrder$() {
    return this.refreshIncompleteOrder;
  }
  needRefreshIncompleteOrder$() {
    this.refreshIncompleteOrder.next();
  }


  get refreshNotification$() {
    return this.refreshNotification;
  }

  needRefreshNotification() {
    this.refreshNotification.next();
  }

  /**
   * REFRESH USEr DATA
   */

  get refreshUser$() {
    return this.refreshUser;
  }
  needRefreshUser$() {
    this.refreshUser.next();
  }


  /**
   * REFRESH Sticky
   */

  get refreshSticky$() {
    return this.refreshSticky;
  }

  needRefreshSticky$(data: boolean) {
    this.refreshSticky.next(data);
  }

}
