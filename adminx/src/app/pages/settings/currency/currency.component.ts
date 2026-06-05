import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {COUNTRIES, CURRENCIES} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";
import {DATABASE_KEY} from "../../../core/utils/global-variable";
import {StorageService} from "../../../services/core/storage.service";
import {CountryService} from "../../../services/core/country.service";

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent implements OnInit, OnDestroy {
  // Store Data
  readonly currenciesData: Select[] = CURRENCIES;
  readonly countriesData: Select[] = COUNTRIES;
  currency: any;
  country: any;
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = 'add';
  isLoading: boolean = false;

  // Data Form
  dataForm?: FormGroup;
  dataFormCountry?: FormGroup;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly storageService = inject(StorageService);
  private readonly countryService = inject(CountryService);

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
    this.title.setTitle('Shop Currency & Country');
    this.pageDataService.setPageData({
      title: 'Shop Currency & Country',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Currency & Country', url: null},
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
      code: [null, Validators.required],
      symbol: [null],
      name: [null],
      status: [null],
      countryCode: [null],
    });

    this.dataFormCountry = this.fb.group({
      code: [null, Validators.required],
      name: [null],
    });
  }


  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    if (this.formViewMode === 'add') {
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      this.addSetting()
    }
  }


  /**
   * HTTP REQ HANDLE
   * addSetting()
   * currencySymbolSaveLocalStorage()
   * getSetting()
   */


  private addSetting(others?: any) {
    this.isLoading = true;
    const data = {
      currency: this.dataForm.value,
      country: this.dataFormCountry.value
    };

    const subscription = this.settingService.addSetting(others ?? data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.message(res.message, "success");
            this.getSetting()
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

  // Save Currency Symbol LocalStorage
  private currencySymbolSaveLocalStorage() {
    const getCurrencyToLocalStorage = this.storageService.getDataFromLocalStorage(DATABASE_KEY.currency);
    if (getCurrencyToLocalStorage?.code !== this.currency.code) {
      this.storageService.storeDataToLocalStorage(this.currency, DATABASE_KEY.currency)
    }
  }

  private getSetting() {
    const subscription = this.settingService.getSetting('currency orderSetting country')
      .subscribe({
        next: res => {
          if (res.data && res.data.currency) {
            this.currency = res.data.currency;
            this.country = res.data.country;
            if (this.currency || this.country) {
              this.onSelectItem(0);
              // Currency Symbol Save LocalStorage
              this.currencySymbolSaveLocalStorage()

              if (this.country) {
                this.countryService.setShopCountryInfo(res.data);
              }
            }
          }
        },
        error: err => {
          console.log(err)
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
   * onCurrencySelect()
   */

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.dataForm.patchValue({
      symbol: this.currency.symbol,
      name: this.currency.name,
      code: this.currency.code,
      countryCode: this.currency.countryCode,
      status: this.currency.status
    });
    this.dataFormCountry.patchValue({
      name: this.country.name,
      code: this.country.code,
    });


  }

  isDisabledOpt(value: string): boolean {
    return this.dataForm?.value?.code === value;
  }

  isDisabledCountry(value: string): boolean {
    return this.dataFormCountry?.value?.code === value;
  }

  onCurrencySelect(item: any) {
    this.dataForm.patchValue({name: item.viewValue, symbol: item.value,countryCode: item.countryCode});
  }

  onCountrySelect(item: any) {
    this.dataFormCountry.patchValue({name: item.viewValue});
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }


}
