import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FilterData} from "../../interfaces/core/filter-data";
import {UserNotificatin} from "../../interfaces/common/user-notificatin.interface";
import {Observable, of, tap, BehaviorSubject} from "rxjs";
import {isPlatformBrowser} from '@angular/common';

const API_URL = environment.apiBaseLink + '/api/user-notification/';

@Injectable({
  providedIn: 'root'
})
export class UserNotificatinService {
  // Store Data
  private readonly cacheKey: string = 'userNotificatin_cache';
  private readonly dismissedKey: string = 'userNotificatin_dismissed';
  private userNotificatinCache: Map<string, { data: UserNotificatin[]; message: string; success: boolean }> = new Map();

  // Notification Queue Management
  private notificationQueue: UserNotificatin[] = [];
  private currentNotificationSubject = new BehaviorSubject<UserNotificatin | null>(null);
  private notificationInterval: any;
  private hideTimeout: any;
  private readonly NOTIFICATION_INTERVAL = 13000; // 13 seconds (3s display + 10s gap)
  private readonly NOTIFICATION_DISPLAY_TIME = 3000; // 3 seconds display time

  // Inject
  private httpClient = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  /**
   * getAllUserNotificatins
   */


  getAllUserNotificatins(): Observable<{
    data: UserNotificatin[];
    success: boolean;
    message: string;
  }> {

    // Only run on browser side, not during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return of({
        data: [],
        success: false,
        message: 'SSR mode - notifications disabled'
      });
    }

    if (this.userNotificatinCache.has(this.cacheKey)) {
      return of(this.userNotificatinCache.get(this.cacheKey) as {
        data: UserNotificatin[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: UserNotificatin[];
        success: boolean;
        message: string;
      }>(API_URL + 'get-all-data')
      .pipe(
        tap((response) => {
          console.log('API Response:', response);
          // Cache the response
          this.userNotificatinCache.set(this.cacheKey, response);
          // Initialize notification queue
          this.initializeNotificationQueue(response.data);
        })
      );
  }

  /**
   * Initialize notification queue and start showing notifications
   */
  private initializeNotificationQueue(notifications: UserNotificatin[]): void {
    // Only run on browser side
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Don't filter dismissed notifications initially - show all
    // This ensures continuous notification flow
    this.notificationQueue = [...notifications];
    this.startNotificationCycle();
  }

  /**
   * Start the notification cycle with 4-second intervals
   */
  private startNotificationCycle(): void {
    // Only run on browser side
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Clear any existing interval
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }

    // Show first notification immediately
    this.showNextNotification();

    // Set up interval for subsequent notifications
    this.notificationInterval = setInterval(() => {
      this.showNextNotification();
    }, this.NOTIFICATION_INTERVAL);

  }

  /**
   * Show the next notification in the queue
   */
  private showNextNotification(): void {

    // If queue is empty, refill it from cache
    if (this.notificationQueue.length === 0) {
      const cachedData = this.userNotificatinCache.get(this.cacheKey);
      if (cachedData && cachedData.data.length > 0) {
        // Don't filter dismissed notifications - show all again
        this.notificationQueue = [...cachedData.data];
      } else {
        return;
      }
    }

    const notification = this.notificationQueue.shift();
    if (notification) {
      this.currentNotificationSubject.next(notification);

      // Auto-hide notification after display time
      this.hideTimeout = setTimeout(() => {
        // Don't mark as dismissed when auto-hiding, only hide temporarily
        this.currentNotificationSubject.next(null);
      }, this.NOTIFICATION_DISPLAY_TIME);
    }
  }

  /**
   * Restart the notification cycle from the beginning
   */
  private restartNotificationCycle(): void {
    // Get fresh data from cache
    const cachedData = this.userNotificatinCache.get(this.cacheKey);
    if (cachedData && cachedData.data.length > 0) {
      // Don't filter dismissed notifications on restart - show all again
      this.notificationQueue = [...cachedData.data];
      // Don't restart the cycle, just refill the queue
      // The interval will continue running
    } else {
      console.log('No cached data for restart');
    }
  }

  /**
   * Get current notification observable
   */
  getCurrentNotification(): Observable<UserNotificatin | null> {
    return this.currentNotificationSubject.asObservable();
  }

  /**
   * Get dismissed notification IDs from localStorage
   */
  private getDismissedNotifications(): string[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    try {
      const dismissed = localStorage.getItem(this.dismissedKey);
      return dismissed ? JSON.parse(dismissed) : [];
    } catch (error) {
      console.error('Error reading dismissed notifications:', error);
      return [];
    }
  }

  /**
   * Save dismissed notification ID to localStorage
   */
  private saveDismissedNotification(notificationId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const dismissed = this.getDismissedNotifications();
      if (!dismissed.includes(notificationId)) {
        dismissed.push(notificationId);
        localStorage.setItem(this.dismissedKey, JSON.stringify(dismissed));
      }
    } catch (error) {
      console.error('Error saving dismissed notification:', error);
    }
  }

  /**
   * Manually hide current notification and mark as dismissed
   */
  hideCurrentNotification(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Get current notification to mark as dismissed
    const currentNotification = this.currentNotificationSubject.value;
    if (currentNotification && currentNotification._id) {
      this.saveDismissedNotification(currentNotification._id);
    }

    this.currentNotificationSubject.next(null);
  }

  /**
   * Clear all dismissed notifications (reset)
   */
  clearDismissedNotifications(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.removeItem(this.dismissedKey);
    } catch (error) {
      console.error('Error clearing dismissed notifications:', error);
    }
  }

  /**
   * Test notification for debugging
   */
  testNotification(): void {
    const testNotifications: UserNotificatin[] = [
      {
        _id: 'test-1',
        name: 'Test User 1',
        type: 'Test Product 1',
        images: ['https://via.placeholder.com/100x100']
      },
      {
        _id: 'test-2',
        name: 'Test User 2',
        type: 'Test Product 2',
        images: ['https://via.placeholder.com/100x100']
      },
      {
        _id: 'test-3',
        name: 'Test User 3',
        type: 'Test Product 3',
        images: ['https://via.placeholder.com/100x100']
      }
    ];

    // Store test data in cache
    this.userNotificatinCache.set(this.cacheKey, {
      data: testNotifications,
      success: true,
      message: 'Test data'
    });

    // Initialize notification queue with test data
    this.initializeNotificationQueue(testNotifications);
  }

  /**
   * Force restart notification cycle (ignore dismissed)
   */
  forceRestartNotifications(): void {
    this.clearDismissedNotifications();
    // Refill queue from cache
    const cachedData = this.userNotificatinCache.get(this.cacheKey);
    if (cachedData && cachedData.data.length > 0) {
      this.notificationQueue = [...cachedData.data];
      // Start the notification cycle
      this.startNotificationCycle();
    }
  }

  /**
   * Stop notification cycle
   */
  stopNotificationCycle(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.currentNotificationSubject.next(null);
  }

  getAllUserNotificatin(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: UserNotificatin[], count: number, success: boolean }>(API_URL + 'get-all-by-shop', filterData, {params});
  }

}
