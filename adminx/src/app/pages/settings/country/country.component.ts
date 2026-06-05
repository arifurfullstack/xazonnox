import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {COUNTRIES, CURRENCIES} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit, OnDestroy {
  // Store Data
  readonly countriesData: Select[] = COUNTRIES;
  country: any[] = [];
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = '';
  isLoading: boolean = false;

  // Data Form
  dataForm?: FormGroup;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);

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
    this.title.setTitle('Courier Methods');
    this.pageDataService.setPageData({
      title: 'Courier Methods',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Courier Methods', url: null},
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
      name: [null],
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
          status: !this.country.length ? 'active' : 'inactive'
        }
      }
      this.country.push(data);
      this.selectedIndex = this.country.length - 1;
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.selectedIndex
      this.country[fIndex] = {
        ...this.country[fIndex],
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

  private addSetting(others?: any) {
    this.isLoading = true;
    const data = {
      country: this.country
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

  private getSetting() {
    const subscription = this.settingService.getSetting('country')
      .subscribe({
        next: res => {
          if (res.data && res.data.country) {
            this.country = res.data.country;
            if (this.country.length) {
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

  /**
   * UI Logics
   * onAddNewPaymentType()
   * toggleCheckbox()
   * onSelectItem()
   * isDisabledOpt()
   * onCountrySelect()
   */
  onAddNewPaymentType() {
    this.formViewMode = 'add';
    const missingTypes = this.countriesData.filter((f) =>
      !this.country.some(
        (charge) => charge.code === f.code
      )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({
        name: this.countriesData[0].viewValue,
        code: this.countriesData[0].code
      });
    } else {
      this.dataForm.patchValue({
        name: missingTypes[0].viewValue,
        code: missingTypes[0].code
      });
    }
  }

  toggleCheckbox(index: number): void {
    this.country.forEach((method, i) => {
      method.status = i === index ? 'active' : 'inactive';
    });
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue({
      name: this.country[this.selectedIndex].name,
      code: this.country[this.selectedIndex].code,
      status: this.country[this.selectedIndex].status
    });


  }

  isDisabledOpt(value: string): boolean {
    return this.country.some(charge => charge.code === value);
  }

  onCountrySelect(item: any) {
    this.dataForm.patchValue({name: item.viewValue});
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }


}
