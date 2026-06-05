import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UiService } from "../../../services/core/ui.service";
import { SettingService } from "../../../services/common/setting.service";
import { Title } from "@angular/platform-browser";
import { PageDataService } from "../../../services/core/page-data.service";
import { Subscription } from "rxjs";
import { Clipboard } from "@angular/cdk/clipboard";
import { YoutubeVideoShowComponent } from "../../../shared/dialog-view/youtube-video-show/youtube-video-show.component";
import { MatDialog } from "@angular/material/dialog";
import { ShopService } from '../../../services/common/shop.service';
import {
  WebsiteUpdateDialogComponent
} from '../../../shared/dialog-view/website-update-dialog/website-update-dialog.component';

@Component({
  selector: 'app-domain-setting',
  templateUrl: './domain-setting.component.html',
  styleUrl: './domain-setting.component.scss'
})
export class DomainSettingComponent implements OnInit, OnDestroy {
  // Store Data
  domains: any[] = [];
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = '';
  isLoading: boolean = false;

  // Data Form
  dataForm?: FormGroup;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly shopService = inject(ShopService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly clipboard = inject(Clipboard);
  private readonly dialog = inject(MatDialog);
  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Init Data Form
    this.initFormGroup();

    // Base Data
    this.setPageData();
    this.getSetting();

  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Domain');
    this.pageDataService.setPageData({
      title: 'Domain',
      navArray: [
        { name: 'Settings', url: `/settings` },
        { name: 'Domain', url: 'https://www.youtube.com/' },
      ]
    })
  }


  /**
   * FORMS METHODS
   * initFormGroup()
   * onSubmit()
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      domain: [null, Validators.required],
    });
  }


  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    this.changeDomainByVendor();

    console.log(this.dataForm.value);
  }


  /**
   * HTTP REQ HANDLE
   * addSetting()
   * getSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('domains')
      .subscribe({
        next: res => {
          if (res.data && res.data.domains) {
            this.domains = res.data.domains;
          }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }

  private changeDomainByVendor() {

    const data = {
      domain: this.dataForm.value.domain.trim().toLowerCase()
    }
    const subscription = this.shopService.changeDomainByVendor(data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.message(res.message, "success");
            this.openWebsiteUpdateDialog();
          } else {
            this.uiService.message(res.message, "warn");
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }


  /**
   * UI Logics
   * onAddNewDeliveryType()
   * toggleCheckbox()
   * onSelectItem()
   * sortDeliveryCharges()
   * isDisabledOpt()
   */


  copyLink(data: any): void {
    const link = data; // Replace with your dynamic link
    this.clipboard.copy(link);
    alert('Link copied to clipboard!'); // Optional feedback to the user
  }

  public openYoutubeVideoDialog(event: MouseEvent, url: string) {
    if (url == null) {
      this.uiService.message('There is no video', 'warn');
      return;
    }
    event.stopPropagation();
    const dialogRef = this.dialog.open(YoutubeVideoShowComponent, {
      data: { url: url },
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

  private openWebsiteUpdateDialog(): void {
    const dialogRef = this.dialog.open(WebsiteUpdateDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: {
        title: 'Domain Changing',
        desc: 'Please wait until it completely updating your website properly.',
        timeInSec: 180,
        showCloseBtn: true,
      },
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      // this.formElement.resetForm();
      location.reload()
    });
  }


  // resCheckDomain {
  //   domain: 'tukitakirmt.com',
  //     aRecord: {
  //     found: '172.67.207.173',
  //       expected: '128.199.220.202',
  //       valid: false
  //   },
  //   cnameRecord: { found: '', expected: 'tukitakirmt.com', valid: false }
  // }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
