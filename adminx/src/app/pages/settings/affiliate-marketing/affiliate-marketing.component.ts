import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {VendorService} from "../../../services/vendor/vendor.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {ReloadService} from "../../../services/core/reload.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-affiliate-marketing',
  templateUrl: './affiliate-marketing.component.html',
  styleUrl: './affiliate-marketing.component.scss'
})
export class AffiliateMarketingComponent implements OnInit, OnDestroy {

  // Store Data from param
  dataForm: FormGroup;
  affiliateSetting: any;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly vendorService = inject(VendorService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly clipboard = inject(Clipboard);
  private readonly reloadService = inject(ReloadService);

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
    this.title.setTitle('Affiliate Marketing');
    this.pageDataService.setPageData({
      title: 'Affiliate Marketing',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Affiliate Marketing', url: 'https://www.youtube.com/embed/vcn15ymZp3g'},
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
      isAffiliate: [false],

    });
  }



  private setFormData() {

    this.dataForm.patchValue({
      isAffiliate: this.affiliateSetting.affiliate.isAffiliate,

    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }



    const mData = {


      affiliate: {
        isAffiliate: this.dataForm.value.isAffiliate,
      },

    };

    this.addSetting(mData);
  }



  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('affiliate')
      .subscribe({
        next: res => {
          if (res.data && res.data.affiliate) {
            this.affiliateSetting = res.data;
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
          this.reloadService.needRefreshIncompleteOrder$();
        }
        ,
        error: err => {
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }

  get csvUrl() {
    return `${environment.ftpBaseLink}/upload/csv/${this.vendorService.getShopId()}/datafeed.csv`;
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
