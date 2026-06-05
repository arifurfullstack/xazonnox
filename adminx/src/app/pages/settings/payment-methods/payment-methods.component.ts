import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BINANCE_METHODS, DATA_BOOLEAN, PAYMENT_PROVIDERS, PAYMENT_PROVIDERS_TYPES} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Select} from '../../../interfaces/core/select';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../../services/core/page-data.service';
import {MatSelectChange} from '@angular/material/select';
import {CountryService} from "../../../services/core/country.service";

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss'
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  // Store Data
  readonly allPaymentProviders: Select[] = PAYMENT_PROVIDERS;
  paymentProviders: Select[] = [];
  readonly allPaymentProviderTypes: any[] = PAYMENT_PROVIDERS_TYPES;
  paymentProviderTypes: any[] = [];
  paymentBinanceTypes: any[] = BINANCE_METHODS;
  readonly dataBoolean: Select[] = DATA_BOOLEAN;
  isCashOnDeliveryOff: boolean = false;
  paymentMethods: any[] = [];
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = '';
  isLoading: boolean = false;
  country: any;

  // Data Form
  dataForm?: FormGroup;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly countryService = inject(CountryService);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.countryService.getShopCountryInfo().subscribe(setting => {
        this.country = setting?.country?.name || 'Bangladesh';
        if(this.country){
          // Filter delivery types based on country
          this.filterPaymentProviderByCountry();
        }
    });

    // Init Data Form
    this.initFormGroup();

    // Base Data
    this.setPageData();
    this.getSetting();

  }

  private filterPaymentProviderByCountry(): void {
    if (!this.country || this.country === 'Bangladesh') {
      // If no country OR country is Bangladesh ➜ show Bangladesh providers
      this.paymentProviders = this.allPaymentProviders.filter(
        provider => provider.country === 'Bangladesh'
      );
    } else {
      // Otherwise ➜ show international providers only
      this.paymentProviders = this.allPaymentProviders.filter(
        provider => provider.country === 'International'
      );
    }
  }
  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Payment Methods');
    this.pageDataService.setPageData({
      title: 'Payment Methods',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Payment Methods', url: 'https://www.youtube.com/embed/QtNgzngiDeU'},
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
      providerName: [null, Validators.required],
      providerType: [null],
      accountNumber: [null],
      paymentInstruction: [null],
      production: [null],
      secretKey: [null],
      binanceType: [null],
      apiKey: [null],
      username: [null],
      password: [null],
      status: [null],
    });
  }


  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    if (this.formViewMode === 'add') {
      const data = {
        ...this.dataForm.value,
        ...{
          status: 'active'
        }
      }
      this.paymentMethods.push(data);
      this.selectedIndex = this.paymentMethods.length - 1;
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.paymentMethods.findIndex(f => f.providerName === this.dataForm.value.providerName);
      this.paymentMethods[fIndex] = {
        ...this.paymentMethods[fIndex],
        ...this.dataForm.value,
      }
      this.addSetting()
    }
  }


  /**
   * HTTP REQ HANDLE
   * addSetting()
   * getSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('paymentMethods isCashOnDeliveryOff country')
      .subscribe({
        next: res => {
          if (res.data && res.data.paymentMethods) {
            this.paymentMethods = res.data.paymentMethods;
            this.isCashOnDeliveryOff = res.data.isCashOnDeliveryOff;
            if (this.paymentMethods.length) {
              this.onSelectItem(0);
            }
          }

          // this.country = res?.data?.country?.name || 'Bangladesh';
          // if(this.country){
          //   // Filter delivery types based on country
          //   this.filterPaymentProviderByCountry();
          // }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }

  private addSetting(others?: any) {
    this.isLoading = true;
    const data = {
      paymentMethods: this.paymentMethods
    };

    const subscription = this.settingService.addSetting(others ?? data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.message(res.message, "success");
          } else {
            this.uiService.message(res.message, "warn");
          }

          if (this.formViewMode === 'add') {
            this.formViewMode = '';
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
   * onAddNewPaymentType()
   * toggleCheckbox()
   * onSelectItem()
   * isDisabledOpt()
   * toggleCashOnDelivery()
   */
  onAddNewPaymentType() {
    this.formViewMode = 'add';
    const missingTypes = this.paymentProviders.filter((f) =>
      !this.paymentMethods.some(
        (charge) => charge.providerName === f.value
      )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({providerName: this.paymentProviders[0].value});
    } else {
      this.dataForm.patchValue({providerName: missingTypes[0].value});
    }
    this.onProviderChange({value: this.dataForm.value.providerName});
  }

  toggleCheckbox(index: number): void {
    const currentStatus = this.paymentMethods[index].status;
    this.paymentMethods[index].status = currentStatus === 'active' ? 'inactive' : 'active';
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue(this.paymentMethods[this.selectedIndex]);
    this.onProviderChange({value: this.dataForm.value.providerName});
  }

  isDisabledOpt(value: string): boolean {
    return this.paymentMethods.some(charge => charge.providerName === value);
  }

  isDisabledOpt2(value: string): boolean {
    return this.paymentProviderTypes.some(charge => charge.value === value);
  }

  toggleCashOnDelivery(): void {
    this.isCashOnDeliveryOff = !this.isCashOnDeliveryOff;
    this.addSetting({isCashOnDeliveryOff: this.isCashOnDeliveryOff});
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  onProviderChange(event: MatSelectChange | any) {
    this.paymentProviderTypes = this.allPaymentProviderTypes.filter(f => f.provider ===event.value )
  }
}
