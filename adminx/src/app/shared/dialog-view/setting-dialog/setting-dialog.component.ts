import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MaterialModule} from "../../../material/material.module";

@Component({
  selector: 'app-setting-dialog',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './setting-dialog.component.html',
  styleUrl: './setting-dialog.component.scss'
})
export class SettingDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SettingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }


}
