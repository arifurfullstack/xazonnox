import {Component, ElementRef, Input, SimpleChanges} from '@angular/core';
import {NavBreadcrumb} from '../../../interfaces/core/nav-breadcrumb.interface';
import {Router, RouterLink} from '@angular/router';
import {YoutubeVideoShowComponent} from "../../dialog-view/youtube-video-show/youtube-video-show.component";
import {VendorService} from "../../../services/vendor/vendor.service";
import {MatDialog} from "@angular/material/dialog";
import {VendorDataService} from "../../../services/vendor/vendor-data.service";
import {ReloadService} from "../../../services/core/reload.service";
import {NotificationService} from "../../../services/common/notification.service";
import {UiService} from "../../../services/core/ui.service";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    RouterLink,
    MatTooltipModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() title: string = 'General';
  @Input() navArray: NavBreadcrumb[] = [];

  constructor(
    private dialog:MatDialog,
    private uiService: UiService,
  ) {
  }
  ngOnChanges(): void {
    // console.log("navArray", this.navArray);
  }

  /**
   * On Click
   * openYoutubeVideoDialog()
   */
  public openYoutubeVideoDialog(event: MouseEvent, url: string) {
    if(url==null){
      this.uiService.message('There is no video', 'warn');
      return;
    }
    event.stopPropagation();
    const dialogRef = this.dialog.open(YoutubeVideoShowComponent, {
      data: {url: url},
      panelClass: ['theme-dialog', 'no-padding-dialog'],
      width: '98%',
      maxWidth: '700px',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.data) {
      }
    });
  }
}
