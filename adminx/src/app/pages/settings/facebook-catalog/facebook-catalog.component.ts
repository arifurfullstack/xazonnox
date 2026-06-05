import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Setting} from "../../../interfaces/common/setting.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {Router} from "@angular/router";
import {SettingService} from "../../../services/common/setting.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../../services/core/page-data.service';
import {VendorService} from '../../../services/vendor/vendor.service';
import {environment} from '../../../../environments/environment';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-facebook-catalog',
  templateUrl: './facebook-catalog.component.html',
  styleUrl: './facebook-catalog.component.scss'
})
export class FacebookCatalogComponent implements OnInit, OnDestroy {

  // Store Data from param
  dataForm: FormGroup;
  facebookCatalog: any;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly vendorService = inject(VendorService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly clipboard = inject(Clipboard);

  // Subscriptions
  private subscriptions: Subscription[] = [];


  ngOnInit(): void {
    // Init Form
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
    this.title.setTitle('FB Catalog');
    this.pageDataService.setPageData({
      title: 'FB Catalog',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'FB Catalog', url: 'https://www.youtube.com/embed/lFuPeLLcQE4'},
      ]
    })
  }


  /**
   * FORMS METHODS
   * initFormGroup()
   * setFormData()
   * onSubmit()
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      isEnableFacebookCatalog: [false],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.facebookCatalog);

  }

  onSubmit() {
    console.log(this.dataForm.value);
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    const mData = {
      facebookCatalog: {...this.dataForm.value}
    }

    this.addSetting(mData);
  }


  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('facebookCatalog')
      .subscribe({
        next: res => {
          if (res.data && res.data.facebookCatalog) {
            this.facebookCatalog = res.data.facebookCatalog;
            this.setFormData();
          }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }

  private addSetting(data: any) {
    const subscription = this.settingService
      .addSetting(data)
      .subscribe({
        next: res => {
          this.uiService.message(res.message, "success");
        }
        ,
        error: err => {
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }

  get csvUrl() {
    return `${environment.ftpBaseLink}/api/upload/csv/${this.vendorService.getShopId()}/datafeed.csv`;
  }

  onCopyCsv() {
    this.clipboard.copy(this.csvUrl);
    this.uiService.message('Url Copied!', 'success');
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  protected readonly onchange = onchange;
}
