import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteProgressService } from './route-progress.service';

@Component({
  selector: 'app-route-progress',
  templateUrl: './route-progress.component.html',
  styleUrl: './route-progress.component.scss',
  imports: [
    NgIf
  ],
  standalone: true
})
export class RouteProgressComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription: Subscription;

  constructor(
    private progressService: RouteProgressService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.progressService.progress$.subscribe((loading: boolean) => {
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
