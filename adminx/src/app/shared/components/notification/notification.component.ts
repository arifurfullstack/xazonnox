import {Component, Input, TemplateRef} from '@angular/core';
import {NgClass, NgFor, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { Router } from '@angular/router';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatIconModule, NgIf, NgFor, MatButtonModule, NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {


  @Input() colorClass: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() actionLink: string = '';
  @Input() actionText: string = 'Action';
  @Input() matIcon: string;

  constructor(
    private dialog: MatDialog,
    private router: Router
  )
  { }

/*  getIcon(): string {
    switch (this.colorClass) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error_outline';
      case 'message':
        return 'info';
      default:
        return 'info';
    }
  }*/


  openDialog(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {
      width: '45%',
      disableClose: false,
      autoFocus: false,
    });
  }



  goToPaymentPage(){
    this.router.navigate(['/payment']);
  }
}
