import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgClass, TitleCasePipe} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ShopService} from '../../../services/common/shop.service';

@Component({
  selector: 'app-website-update-dialog',
  standalone: true,
  imports: [
    NgClass,
    TitleCasePipe,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  templateUrl: './website-update-dialog.component.html',
  styleUrl: './website-update-dialog.component.scss'
})
export class WebsiteUpdateDialogComponent implements OnInit {
  showCloseBtn: boolean = true;
  buildStatus: string = 'working'
  elapsedTime: number = 0;
  totalTime: number = 180; // Total time in seconds (e.g., 1.5 minutes)

  // Inject
  private readonly shopService = inject(ShopService);
  private readonly dialogRef = inject(MatDialogRef<WebsiteUpdateDialogComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);


  ngOnInit() {

    if (this.data) {
      if (this.data.timeInSec) {
        this.totalTime = this.data.timeInSec;
      }
      if (this.data.showCloseBtn) {
        this.showCloseBtn = this.data.showCloseBtn;
      }

      this.checkShopBuildStatusById();
    }

    this.startProgress();
  }

  startProgress() {
    if (!this.totalTime || this.totalTime < 1) {
      this.totalTime = 180; // fallback
    }
    const interval = setInterval(() => {
      if (this.elapsedTime < this.totalTime) {
        this.elapsedTime++;
      } else {
        clearInterval(interval);
        this.elapsedTime = this.totalTime; // Ensure we reach exactly 100%
        this.buildStatus = 'updated';
      }
    }, 1000); // Update every second
  }

  get progressValue(): number {
    return (this.elapsedTime / this.totalTime) * 100;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }


  closeDialog() {
    this.dialogRef.close();
  }


  private checkShopBuildStatusById() {
    this.shopService.checkShopUpdateStatusByInterval(1200)
      .subscribe({
        next: res => {
          if (res.data) {
            // this.buildStatus = res.data.updateStatus;
            // if (this.buildStatus === 'secure' || this.buildStatus === 'updated') {
            //   this.elapsedTime = this.totalTime;
            // }
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

}
