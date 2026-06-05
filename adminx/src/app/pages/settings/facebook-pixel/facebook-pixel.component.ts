import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Setting} from "../../../interfaces/common/setting.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {Router} from "@angular/router";
import {SettingService} from "../../../services/common/setting.service";
import {ReloadService} from "../../../services/core/reload.service";
import {Title} from '@angular/platform-browser';
import {PageDataService} from '../../../services/core/page-data.service';
import {facebookAccessTokenValidator} from "../../../services/core/facebook-token.validator";
import {facebookPixelIdValidator} from '../../../services/core/facebook-pixel-id.validator';

@Component({
  selector: 'app-facebook-pixel',
  templateUrl: './facebook-pixel.component.html',
  styleUrl: './facebook-pixel.component.scss'
})
export class FacebookPixelComponent implements OnInit, OnDestroy {

  // Store Data from param
  dataForm: FormGroup;
  analytics: any;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);

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
    this.title.setTitle('FB Pixel');
    this.pageDataService.setPageData({
      title: 'FB Pixel',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'FB Pixel', url: 'https://www.youtube.com/embed/61DvSJe0gis'},
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
      isEnablePixelTestEvent: [false],
      facebookPixelTestEventId: [null],
      facebookPixelId: [null, [facebookPixelIdValidator]],
      facebookPixelAccessToken: [null, [facebookAccessTokenValidator]],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.analytics);

  }

  onSubmit() {
    console.log(this.dataForm.value);
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    const mData = {
      analytics: {...this.dataForm.value}
    }

    this.addSetting(mData);
  }


  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('analytics')
      .subscribe({
        next: res => {
          if (res.data && res.data.analytics) {
            this.analytics = res.data.analytics;
            this.setFormData();
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
        }
        ,
        error: err => {
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
