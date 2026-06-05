import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SubscriptionExpireDialogComponent } from './subscription-expire-dialog.component';

@NgModule({
  declarations: [
    SubscriptionExpireDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    SubscriptionExpireDialogComponent
  ]
})
export class SubscriptionExpireDialogModule { } 