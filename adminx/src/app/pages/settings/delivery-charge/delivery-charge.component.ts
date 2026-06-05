import {Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Division} from '../../../interfaces/common/division.interface';
import {DivisionService} from '../../../services/common/division.service';
import {FilterData} from '../../../interfaces/core/filter-data';
import {DELIVERY_TYPES} from '../../../core/utils/app-data';
import {Select} from '../../../interfaces/core/select';
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../../services/core/page-data.service';
import {CountryService} from "../../../services/core/country.service";

@Component({
  selector: 'app-delivery-charge',
  templateUrl: './delivery-charge.component.html',
  styleUrl: './delivery-charge.component.scss'
})
export class DeliveryChargeComponent implements OnInit, OnDestroy,OnChanges {
  // Store Data
  // readonly deliveryTypes: Select[] = DELIVERY_TYPES;
  // Store Data
  readonly allDeliveryTypes: Select[] = DELIVERY_TYPES; // store all for reuse
  deliveryTypes: Select[] = [];


  deliveryCharges: any[] = [];
  selectedIndex: number;
  formViewMode: 'add' | 'edit' | '' = '';
  divisions: Division[] = [];
  isLoading: boolean = false;
  country: any;

  // Data Form
  dataForm?: FormGroup;

  // Inject
  private readonly divisionService = inject(DivisionService);
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
          this.filterDeliveryTypesByCountry();
          this.getAllDivision();
        }
    });


    // Init Data Form
    this.initFormGroup();

    // Base Data
    this.setPageData();
    this.getSetting();


  }

  ngOnChanges(changes: SimpleChanges) {
    this.countryService.getShopCountryInfo().subscribe(setting => {
      if (setting?.currency) {
        this.country = setting?.currency?.name || 'Bangladesh';
      }
    });
    // Filter delivery types based on country
    this.filterDeliveryTypesByCountry();
  }

  private filterDeliveryTypesByCountry(): void {
    this.deliveryTypes = this.allDeliveryTypes.filter(type => {
      return !type.country || type.country === this.country;
    });
  }

  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Delivery Charge');
    this.pageDataService.setPageData({
      title: 'Delivery Charge',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Delivery Charge', url: null},
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
      type: [null],
      city: [null],
      insideCity: [null],
      outsideCity: [null],
      freeDeliveryMinAmount: [null],
      note: [null],
      status: [null],
      isAdvancePayment: [false],
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
          name: this.deliveryTypes.find(f => f.value === this.dataForm.value.type).viewValue,
          status: 'active'
        }
      }
      this.deliveryCharges.push(data);
      this.selectedIndex = this.deliveryCharges.length - 1;
      this.sortDeliveryCharges();
      this.addSetting()
    } else if (this.formViewMode === 'edit') {
      const fIndex = this.deliveryCharges.findIndex(f => f.type === this.dataForm.value.type);
      this.deliveryCharges[fIndex] = {
        ...this.deliveryCharges[fIndex],
        ...this.dataForm.value,
      }
      this.addSetting()
    }
  }


  /**
   * HTTP REQ HANDLE
   * getAllDivision()
   * addSetting()
   * getSetting()
   */

  private getAllDivision() {
    let mSelect = {
      name: 1,
      country:1
    };
    const filter: FilterData = {
      filter: {status: 'publish', country: this.country},
      select: mSelect,
      pagination: null,
      sort: {name: 1,},
    };
    const subscription = this.divisionService.getAllDivisions(filter)
      .subscribe({
        next: res => {
          this.divisions = res.data;
        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }

  private getSetting() {
    const subscription = this.settingService.getSetting('deliveryCharges')
      .subscribe({
        next: res => {
          if (res.data && res.data.deliveryCharges) {
            this.deliveryCharges = res.data.deliveryCharges;
            if (this.deliveryCharges.length) {
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
      deliveryCharges: this.deliveryCharges
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
    const missingTypes = this.deliveryTypes.filter(
      (deliveryType) =>
        !this.deliveryCharges.some(
          (charge) => charge.type === deliveryType.value
        )
    );
    this.dataForm.reset();
    if (!missingTypes.length) {
      this.dataForm.patchValue({type: this.deliveryTypes[0].value});
    } else {
      this.dataForm.patchValue({type: missingTypes[0].value});
    }
  }

  toggleCheckbox(index: number): void {
    const currentStatus = this.deliveryCharges[index].status;
    this.deliveryCharges[index].status = currentStatus === 'active' ? 'inactive' : 'active';
    this.onSelectItem(index);
    this.addSetting();
  }

  onSelectItem(index: number) {
    this.formViewMode = 'edit';
    this.selectedIndex = index;
    this.dataForm.patchValue({isAdvancePayment:false});
    this.dataForm.patchValue(this.deliveryCharges[this.selectedIndex]);
  }

  private sortDeliveryCharges(): void {
    const typeOrder = this.deliveryTypes.map((type) => type.value);
    this.deliveryCharges.sort(
      (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    );
  }

  isDisabledOpt(type: string): boolean {
    return this.deliveryCharges.some(charge => charge.type === type);
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }


}
