import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {OFFER_TYPES} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-manage-offer',
  templateUrl: './manage-offer.component.html',
  styleUrl: './manage-offer.component.scss'
})
export class ManageOfferComponent implements OnInit, OnDestroy {
  // Store Data
  readonly offerTypes: Select[] = OFFER_TYPES;

  offers: any[] = [];
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
    this.title.setTitle('Offers');
    this.pageDataService.setPageData({
      title: 'Offers',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Offers', url: null},
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
      discount: [null],
      offerType: [null],
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
      this.offers.push(data);
      this.selectedIndex = this.offers.length - 1;
      this.sortDeliveryCharges();
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.offers.findIndex(f => f.offerType === this.dataForm.value.offerType);
      this.offers[fIndex] = {
        ...this.offers[fIndex],
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
    const subscription = this.settingService.getSetting('offers')
      .subscribe({
        next: res => {
          if (res.data && res.data.offers) {
            this.offers = res.data.offers;
            if (this.offers.length) {
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
      offers: this.offers
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
    const missingTypes = this.offerTypes.filter(
      (deliveryType) =>
        !this.offers.some(
          (charge) => charge.offerType === deliveryType.value
        )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({type: this.offerTypes[0].value});
    } else {
      this.dataForm.patchValue({type: missingTypes[0].value});
    }
  }

  toggleCheckbox(index: number): void {
    const currentStatus = this.offers[index].status;
    this.offers[index].status = currentStatus === 'active' ? 'inactive' : 'active';
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue(this.offers[this.selectedIndex]);
  }

  private sortDeliveryCharges(): void {
    const typeOrder = this.offerTypes.map((type) => type.value);
    this.offers.sort(
      (a, b) => typeOrder.indexOf(a.offerType) - typeOrder.indexOf(b.offerType)
    );
  }

  isDisabledOpt(type: string): boolean {
    return this.offers.some(charge => charge.offerType === type);
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
