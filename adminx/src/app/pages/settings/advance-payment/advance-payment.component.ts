import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {
  ADVANCE_PAYMENTS,
  DATA_BOOLEAN,
  PAYMENT_PROVIDERS,
  PAYMENT_PROVIDERS_TYPES,
  SOCIAL_LOGIN_TYPES
} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {FilterData} from "../../../interfaces/core/filter-data";
import {Division} from "../../../interfaces/common/division.interface";
import {DivisionService} from "../../../services/common/division.service";
import {CountryService} from "../../../services/core/country.service";

@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrl: './advance-payment.component.scss'
})
export class AdvancePaymentComponent  implements OnInit, OnDestroy {
  // Store Data
  readonly advancePayments: Select[] = ADVANCE_PAYMENTS;

  advancePayment: any[] = [];
  divisions?: Division[] = [];
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = '';
  isLoading: boolean = false;
  country: any;

  selectedTags: number[] = []; // Only the IDs


  // Data Form
  dataForm?: FormGroup;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly divisionService = inject(DivisionService);
  private readonly countryService = inject(CountryService);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.countryService.getShopCountryInfo().subscribe(setting => {
      // if (setting?.country) {
        this.country = setting?.country?.name || 'Bangladesh';
        if(this.country){
          this.getAllDivision();
        }
      // }
    });
    // Init Data Form
    this.initFormGroup();

    // Base Data
    this.setPageData();
    this.getSetting();
    this.getAllDivision();

  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Advance Payment');
    this.pageDataService.setPageData({
      title: 'Advance Payment',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Advance Payment', url: 'https://www.youtube.com/embed/XUneKJ_IZwM'},
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
      providerName: [null],
      minimumAmount: [null],
      advancePaymentAmount: [null],
      advancePaymentNote: [null],
      division: [null],
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
      this.advancePayment.push(data);
      this.selectedIndex = this.advancePayment.length - 1;
      this.sortDeliveryCharges();
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.advancePayment.findIndex(f => f.providerName === this.dataForm.value.providerName);
      this.advancePayment[fIndex] = {
        ...this.advancePayment[fIndex],
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

  private getAllDivision() {
    let mSelect = {
      name: 1,
    };
    const filter: FilterData = {
      filter: {status: 'publish',country: this.country},
      select: mSelect,
      pagination: null,
      sort: {name: 1},
    };

    const subscription = this.divisionService.getAllDivisions(filter).subscribe({
      next: res => {
        this.divisions = res.data;

      },
      error: err => {
        console.log(err);
      }
    });
    this.subscriptions?.push(subscription);
  }


  private getSetting() {
    const subscription = this.settingService.getSetting('advancePayment')
      .subscribe({
        next: res => {
          if (res.data && res.data.advancePayment) {
            this.advancePayment = res.data.advancePayment;
            if (this.advancePayment.length) {
              this.onSelectItem(0);
            }
          }
        },
        error: err => {
          console.log(err)
        }
      });

    this.subscriptions.push(subscription);
  }

  private addSetting() {
    this.isLoading = true;
    const data = {
      advancePayment: this.advancePayment
    };

    const subscription = this.settingService.addSetting(data)
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
   * onAddNewDeliveryType()
   * toggleCheckbox()
   * onSelectItem()
   * sortDeliveryCharges()
   * isDisabledOpt()
   */
  onAddNewDeliveryType() {
    this.formViewMode = 'add';
    const missingTypes = this.advancePayments.filter(
      (deliveryType) =>
        !this.advancePayment.some(
          (charge) => charge.providerName === deliveryType.value
        )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({type: this.advancePayments[0].value});
    } else {
      this.dataForm.patchValue({type: missingTypes[0].value});
    }
  }

  toggleCheckbox(index: number): void {
    const currentStatus = this.advancePayment[index].status;
    this.advancePayment[index].status = currentStatus === 'active' ? 'inactive' : 'active';
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue(this.advancePayment[this.selectedIndex]);
  }

  private sortDeliveryCharges(): void {
    const typeOrder = this.advancePayments.map((type) => type.value);
    this.advancePayment.sort(
      (a, b) => typeOrder.indexOf(a.providerName) - typeOrder.indexOf(b.providerName)
    );
  }

  isDisabledOpt(type: string): boolean {
    return this.advancePayment.some(charge => charge.providerName === type);
  }


  getAdvancePaymentViewValue(providerName: string): string | undefined {
    return this.advancePayments.find(ap => ap.value === providerName)?.viewValue;
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
