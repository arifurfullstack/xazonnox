import {Component, Input, OnInit, OnDestroy, inject, PLATFORM_ID} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserNotificatinService} from '../../../services/common/user-notification.service';
import {UserNotificatin} from '../../../interfaces/common/user-notificatin.interface';
import {NgIf, isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-notification-card',
  standalone: true,
  templateUrl: './notification-card.component.html',
  imports: [
    NgIf
  ],
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent implements OnInit, OnDestroy {
  @Input() notificationData!: any;

  // Current notification to display
  currentNotification: UserNotificatin | null = null;
  isVisible: boolean = false;
  isSlidingOut: boolean = false;

  // Inject services
  private notificationService = inject(UserNotificatinService);
  private platformId = inject(PLATFORM_ID);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Only run on browser side, not during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Subscribe to current notification changes
    const subscription = this.notificationService.getCurrentNotification().subscribe({
      next: (notification) => {
        if (notification) {
          this.currentNotification = notification;
          this.showNotification();
        } else {
          this.hideNotification();
        }
      },
      error: (err) => {
        console.error('Error in notification subscription:', err);
      }
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private showNotification(): void {
    this.isSlidingOut = false;
    this.isVisible = true;
  }

  private hideNotification(): void {
    this.isSlidingOut = true;
    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.isVisible = false;
      this.isSlidingOut = false;
    }, 300);
  }

  onCloseNotification(): void {
    this.notificationService.hideCurrentNotification();
  }
}


