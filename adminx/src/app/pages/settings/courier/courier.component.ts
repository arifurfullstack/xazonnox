import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {COURIER_PROVIDERS} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Select} from '../../../interfaces/core/select';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../../services/core/page-data.service';

@Component({
  selector: 'app-courier-api',
  templateUrl: './courier.component.html',
  styleUrl: './courier.component.scss'
})
export class CourierComponent implements OnInit, OnDestroy {
  // Store Data
  readonly courierProviders: Select[] = COURIER_PROVIDERS;
  courierMethods: any[] = [];
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
        {name: 'Courier Methods', url: 'https://www.youtube.com/embed/Rwxy1C0sC5s?si=IvYONl9Kz4nys5Co'},
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
      apiKey: [null],
      secretKey: [null],
      username: [null],
      password: [null],
      status: [null],
      storeId: [null],
      specialInstruction: [null],
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
          status: !this.courierMethods.length ? 'active' : 'inactive'
        }
      }
      this.courierMethods.push(data);
      this.selectedIndex = this.courierMethods.length - 1;
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.courierMethods.findIndex(f => f.providerName === this.dataForm.value.providerName);
      this.courierMethods[fIndex] = {
        ...this.courierMethods[fIndex],
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
    const subscription = this.settingService.getSetting('courierMethods')
      .subscribe({
        next: res => {
          if (res.data && res.data.courierMethods) {
            this.courierMethods = res.data.courierMethods;
            // 👉 active index খুঁজে বের করো
            const activeIndex = this.courierMethods.findIndex(m => m.status === 'active');

            if (activeIndex !== -1) {
              this.onSelectItem(activeIndex);
            } else if (this.courierMethods.length) {
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

  private addSetting(others?: any) {
    this.isLoading = true;
    const data = {
      courierMethods: this.courierMethods
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
   */
  onAddNewPaymentType() {
    this.formViewMode = 'add';
    const missingTypes = this.courierProviders.filter((f) =>
      !this.courierMethods.some(
        (charge) => charge.providerName === f.value
      )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({providerName: this.courierProviders[0].value});
    } else {
      this.dataForm.patchValue({providerName: missingTypes[0].value});
    }
  }

  toggleCheckbox(index: number): void {
    this.courierMethods.forEach((method, i) => {
      method.status = i === index ? 'active' : 'inactive';
    });
    this.onSelectItem(index); // active করলে সাথে সাথে select ও হবে
    this.addSetting();
  }


  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue(this.courierMethods[this.selectedIndex]);
  }

  isDisabledOpt(value: string): boolean {
    return this.courierMethods.some(charge => charge.providerName === value);
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
