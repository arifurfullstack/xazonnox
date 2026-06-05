import {Component, EventEmitter, Inject, Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-expire-dialog',
  templateUrl: './subscription-expire-dialog.component.html',
  styleUrls: ['./subscription-expire-dialog.component.scss']
})
export class SubscriptionExpireDialogComponent {
  @Output() payClicked = new EventEmitter<void>();
  constructor(
    public dialogRef: MatDialogRef<SubscriptionExpireDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Prevent dialog close on backdrop click
    dialogRef.disableClose = true;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onPayNow(): void {
    // this.dialogRef.close('pay');
    // Emit action without closing dialog
    this.payClicked.emit(); // ✅ Just emit, don't close the dialog
  }

  onContactUs() {
    const phoneNumber = '8801648879969';
    const message = `Hello, I need help with my ${this.data.shopType === 'free' ? 'trial' : 'subscription'}.\n\n` +
                   `${this.data.shopType === 'free' ? 'Trial' : 'Subscription'} expired ${this.data.expireDays} days ago.\n\n` +
                   `Please help me renew my ${this.data.shopType === 'free' ? 'trial' : 'subscription'} to continue using the services.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
