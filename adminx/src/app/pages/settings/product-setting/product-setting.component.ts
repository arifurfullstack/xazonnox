import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";
import {VendorService} from "../../../services/vendor/vendor.service";
import {ShopService} from "../../../services/common/shop.service";

@Component({
  selector: 'app-product-setting',
  templateUrl: './product-setting.component.html',
  styleUrl: './product-setting.component.scss'
})
export class ProductSettingComponent implements OnInit, OnDestroy  {

  allowedShopIds = ['686f65db70f6c8aaf4232385','67b8a04ba827d974b010ccc3'];
  // Store Data from
  dataForm: FormGroup;
  productSetting: any;
  isLoading: boolean = false;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  protected readonly vendorService = inject(VendorService);
  private readonly shopService = inject(ShopService);


  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Init Form
    this.initFormGroup();

    // Base Data
    this.setPageData();
    this.getSetting();

    // Reset digitalProduct when physical is selected
    // this.dataForm.get('productType')?.valueChanges.subscribe((type) => {
    //   if (type === 'physicalProduct') {
    //     this.dataForm.get('digitalProduct')?.reset({
    //       isEmailEnable: false,
    //       isAddressEnable: false,
    //       isDivisionEnable: false,
    //     });
    //   }
    // });
  }

  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Product Setting');
    this.pageDataService.setPageData({
      title: 'Product Setting',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Product Setting', url: 'https://www.youtube.com/embed/vcn15ymZp3g'},
      ]
    })
  }




  isAllowedShop(): boolean {
    const id = this.vendorService.getShopId();
    return !!id && this.allowedShopIds.includes(id);
  }


  /**
   * FORMS METHODS
   * initFormGroup()
   * setFormData()
   * onSubmit()
   */

  private initFormGroup() {
    this.dataForm = this.fb.group({
      productType: ['physicalProduct'], // default
      checkoutType: ['easyCheckout'], // //for one page checkout, added later
      urlType: ['website.com/product-details/test-product'], // //for url control, added later

      isEnableSoldQuantitySort: [null],
      isEnablePrioritySort: [null],
      isEnableProductDetailsView: [false],
      isEnableAdvancePayment: [false],
      isEnableDeliveryCharge: [false],
      isEnablePhoneModel: [false],
      digitalProduct: this.fb.group({
        isEmailEnable: [false],
        isAddressEnable: [false],
        isDivisionEnable: [false],
      }),
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.productSetting);
  }

  onSubmit() {
    this.isLoading = true;
    const mData = {
      productSetting: {...this.dataForm.value},
      needRebuild: true
    }

    this.addSetting(mData);
  }


  get isDigitalProductSelected(): boolean {
    return this.dataForm.get('productType')?.value === 'digitalProduct';
  }


  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('productSetting')
      .subscribe({
        next: res => {
          if (res.data && res.data.productSetting) {
            this.productSetting = res.data.productSetting;
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
          this.isLoading = false;
          this.uiService.message(res.message, "success");
          this.checkShopBuildStatusById();
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }


  private checkShopBuildStatusById() {
    this.shopService.checkShopUpdateStatusByInterval(1200)
      .subscribe({
        next: res => {
          if (res.data) {
            // this.buildStatus = res.data.updateStatus;
            // if (this.buildStatus === 'secure' || this.buildStatus === 'updated') {
            //   this.elapsedTime = this.totalTime;
            // }
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

}
