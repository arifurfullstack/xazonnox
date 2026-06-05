import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Select} from '../../../interfaces/core/select';
import {SOCIAL_LOGIN_TYPES} from '../../../core/utils/app-data';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../../services/core/page-data.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrl: './social-login.component.scss'
})
export class SocialLoginComponent implements OnInit, OnDestroy {
  // Store Data
  readonly socialLoginTypes: Select[] = SOCIAL_LOGIN_TYPES;

  socialLogins: any[] = [];
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
    this.title.setTitle('Social Login');
    this.pageDataService.setPageData({
      title: 'Social Login',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Social Login', url: null},
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
      authId: [null],
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
      this.socialLogins.push(data);
      this.selectedIndex = this.socialLogins.length - 1;
      this.sortDeliveryCharges();
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.socialLogins.findIndex(f => f.providerName === this.dataForm.value.providerName);
      this.socialLogins[fIndex] = {
        ...this.socialLogins[fIndex],
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
    const subscription = this.settingService.getSetting('socialLogins')
      .subscribe({
        next: res => {
          if (res.data && res.data.socialLogins) {
            this.socialLogins = res.data.socialLogins;
            if (this.socialLogins.length) {
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
      socialLogins: this.socialLogins
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
    const missingTypes = this.socialLoginTypes.filter(
      (deliveryType) =>
        !this.socialLogins.some(
          (charge) => charge.providerName === deliveryType.value
        )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({type: this.socialLoginTypes[0].value});
    } else {
      this.dataForm.patchValue({type: missingTypes[0].value});
    }
  }

  toggleCheckbox(index: number): void {
    const currentStatus = this.socialLogins[index].status;
    this.socialLogins[index].status = currentStatus === 'active' ? 'inactive' : 'active';
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue(this.socialLogins[this.selectedIndex]);
  }

  private sortDeliveryCharges(): void {
    const typeOrder = this.socialLoginTypes.map((type) => type.value);
    this.socialLogins.sort(
      (a, b) => typeOrder.indexOf(a.providerName) - typeOrder.indexOf(b.providerName)
    );
  }

  isDisabledOpt(type: string): boolean {
    return this.socialLogins.some(charge => charge.providerName === type);
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
