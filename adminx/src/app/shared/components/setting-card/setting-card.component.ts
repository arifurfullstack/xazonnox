import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingDialogComponent } from '../../dialog-view/setting-dialog/setting-dialog.component';

@Component({
  selector: 'app-setting-card',
  standalone: true,
  imports: [],
  templateUrl: './setting-card.component.html',
  styleUrl: './setting-card.component.scss'
})
export class SettingCardComponent {
  @Input() inputData: any;


  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  ngOnInit(){
  }

   /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
   public openConfirmDialog() {
    const dialogRef = this.dialog.open(SettingDialogComponent, {
      maxWidth: '600px',
      data: this.inputData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // this.router.navigate(['/settings/all-setting']).then();
        this.router.navigate(['/settings/full-settings']).then();
      }
    });

  }
  
}
