import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-shop-select-dialog',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatButtonModule
  ],
  templateUrl: './shop-select-dialog.component.html',
  styleUrl: './shop-select-dialog.component.scss'
})
export class ShopSelectDialogComponent {
  shops: any[];

  constructor(
    public dialogRef: MatDialogRef<ShopSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data.data) {
      this.shops = data.data
    }

  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  onSelect(_id: string) {
    this.dialogRef.close({_id: _id});
  }
}
