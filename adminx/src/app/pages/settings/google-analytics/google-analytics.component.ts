import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Setting} from "../../../interfaces/common/setting.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {Router} from "@angular/router";
import {SettingService} from "../../../services/common/setting.service";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-google-analytics',
  templateUrl: './google-analytics.component.html',
  styleUrl: './google-analytics.component.scss'
})
export class GoogleAnalyticsComponent implements OnInit, OnDestroy {

  // Store Data from param
  id?: string;
  activeCardIndex: number;
  isUpdate: boolean = false;
  dataForm?: FormGroup;
  setting: Setting;

  // Subscriptions
  private subReload: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public router: Router,
    private settingService: SettingService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getSetting();
    });
    // INIT FORM
    this.initFormGroup();

    // GET DATA
    this.getSetting();

  }


  /**
   * FORMS METHODS
   * initFormGroup()
   * setFormData()
   * onSubmit()
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      id: [null],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.setting.googleAnalytics);

  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    let mData;
    if (this.isUpdate) {
      mData = {googleAnalytics: this.dataForm.value}
    } else {
      mData = {googleAnalytics: this.dataForm.value}
    }

    this.addSetting(mData);  // Send the data to your service to add or update the setting
  }


  /**
   * HTTP REQ HANDLE
   * addSetting()
   * getSetting()
   */

  private getSetting() {
    this.subDataTwo = this.settingService.getSetting().subscribe(
      (res) => {
        this.setting = res.data;
        this.setFormData();
      },
      (err) => {

        console.log(err);
      }
    );
  }

  private addSetting(data: any) {
    this.subDataOne = this.settingService
      .addSetting(data)
      .subscribe({
        next: res => {
          this.uiService.message(res.message, "success");
          this.reloadService.needRefreshData$()
        }
        ,
        error: err => {
          console.log(err);
        }
      });
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }
}
