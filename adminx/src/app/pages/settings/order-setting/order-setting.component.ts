import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {VendorService} from "../../../services/vendor/vendor.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {ReloadService} from "../../../services/core/reload.service";
import {CountryService} from "../../../services/core/country.service";

@Component({
  selector: 'app-order-setting',
  templateUrl: './order-setting.component.html',
  styleUrl: './order-setting.component.scss'
})
export class OrderSettingComponent implements OnInit, OnDestroy {
  allowedShopIds = [
    '6875e087618cd365fb9160db',
    // Amder Test er Jonno nicher id Gulo
    '67b8a04ba827d974b010ccc3',
    '679511745a429b7bb55421c4',
    '67a8615b53a1da782b9acad9'
  ];
  // Store Data from param
  dataForm: FormGroup;
  orderSetting: any;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly vendorService = inject(VendorService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly clipboard = inject(Clipboard);
  private readonly reloadService = inject(ReloadService);
  private readonly countryService = inject(CountryService);


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
    this.title.setTitle('Order Setting');
    this.pageDataService.setPageData({
      title: 'Order Setting',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Order Setting', url: 'https://www.youtube.com/embed/vcn15ymZp3g'},
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
      isEnableOrderNote: [false],
      isEnableOtp: [false],
      isEnableSMSNotification: [false],
      isEnableEmailNotification: [false],
      isEnableIncompleteOrder: [false],
      isEnableInvoiceSetting: [false],
      orderPhoneValidation: [false],
      isEnableHomeRecentOrder: [false],
      isSwapPaymentAndOrderItem: [false],
      isEnableOutsideBd: [false],
      isEnableSingleIpBlock: [false],
      isEnableIpWiseOrderLimitAndBlockTime: [false],
      ipWiseOrderBlockTime: [null],
      ipWiseOrderLimit: [null],
      isEnablePreviousOrderCount: [false],
      maxLength: [null],
      minLength: [null],
      deliveryOptionType: this.fb.group({
        selection: ['division']
      })
    });
  }


  private setFormData() {
    const selection = this.orderSetting.deliveryOptionType ? this.orderSetting.deliveryOptionType?.isEnableDivision
      ? 'division'
      : 'insideCity' : 'division';

    this.dataForm.patchValue({
      isEnableOrderNote: this.orderSetting.orderSetting.isEnableOrderNote,
      isEnableOtp: this.orderSetting.orderSetting.isEnableOtp,
      isEnableSingleIpBlock: this.orderSetting.orderSetting.isEnableSingleIpBlock,
      isEnableIpWiseOrderLimitAndBlockTime: this.orderSetting.orderSetting.isEnableIpWiseOrderLimitAndBlockTime,
      ipWiseOrderBlockTime: this.orderSetting.orderSetting.ipWiseOrderBlockTime,
      ipWiseOrderLimit: this.orderSetting.orderSetting.ipWiseOrderLimit,
      isEnablePreviousOrderCount: this.orderSetting.orderSetting.isEnablePreviousOrderCount,
      isEnableInvoiceSetting: this.orderSetting.orderSetting.isEnableInvoiceSetting,
      isEnableSMSNotification: this.orderSetting.orderNotification.isEnableSMSNotification,
      isEnableEmailNotification: this.orderSetting.orderNotification.isEnableEmailNotification,
      isEnableIncompleteOrder: this.orderSetting.incompleteOrder.isEnableIncompleteOrder,
      isEnableHomeRecentOrder: this.orderSetting.orderSetting.isEnableHomeRecentOrder,
      isEnableOutsideBd: this.orderSetting?.orderPhoneValidation?.isEnableOutsideBd,
      maxLength: this.orderSetting?.orderPhoneValidation?.maxLength,
      minLength: this.orderSetting?.orderPhoneValidation?.minLength,
      isSwapPaymentAndOrderItem: this.orderSetting?.orderSetting.isSwapPaymentAndOrderItem,
      deliveryOptionType: {
        selection: selection
      }
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    const deliveryType = this.dataForm.value.deliveryOptionType.selection;


    const mData = {
      orderSetting: {
        isEnableOrderNote: this.dataForm.value.isEnableOrderNote,
        isEnableOtp: this.dataForm.value.isEnableOtp,
        isEnableInvoiceSetting: this.dataForm.value.isEnableInvoiceSetting,
        isEnableHomeRecentOrder: this.dataForm.value.isEnableHomeRecentOrder,
        isSwapPaymentAndOrderItem: this.dataForm.value.isSwapPaymentAndOrderItem,
        isEnablePreviousOrderCount: this.dataForm.value.isEnablePreviousOrderCount,
        isEnableSingleIpBlock: this.dataForm.value.isEnableSingleIpBlock,
        isEnableIpWiseOrderLimitAndBlockTime: this.dataForm.value.isEnableIpWiseOrderLimitAndBlockTime,
        ipWiseOrderBlockTime: this.dataForm.value.ipWiseOrderBlockTime,
        ipWiseOrderLimit: this.dataForm.value.ipWiseOrderLimit,
      },
      orderNotification: {
        isEnableSMSNotification: this.dataForm.value.isEnableSMSNotification,
        isEnableEmailNotification: this.dataForm.value.isEnableEmailNotification,
      },
      incompleteOrder: {
        isEnableIncompleteOrder: this.dataForm.value.isEnableIncompleteOrder,
      },
      orderPhoneValidation: {
        isEnableOutsideBd: this.dataForm.value.isEnableOutsideBd,
        maxLength: this.dataForm.value.maxLength,
        minLength: this.dataForm.value.minLength,
      },
      deliveryOptionType: {
        isEnableDivision: deliveryType === 'division',
        isEnableInsideCityOutsideCity: deliveryType === 'insideCity',
      }
    };

    this.addSetting(mData);
  }


  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('orderPhoneValidation orderSetting deliveryOptionType orderNotification incompleteOrder currency country')
      .subscribe({
        next: res => {
          if (res.data && res.data.orderSetting) {
            this.orderSetting = res.data;
            this.setFormData();
            console.log("res.data")
            this.countryService.setShopCountryInfo(res.data);
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
          this.getSetting();
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

  isAllowedShop(): boolean {
    const id = this.vendorService.getShopId();
    return !!id && this.allowedShopIds.includes(id);
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  protected readonly onchange = onchange;
}
