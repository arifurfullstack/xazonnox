import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-google-console',
  templateUrl: './google-console.component.html',
  styleUrl: './google-console.component.scss'
})
export class GoogleConsoleComponent implements OnInit, OnDestroy {

  // Store Data from param
  dataForm: FormGroup;
  googleSearchConsoleToken: any;

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
    this.title.setTitle('Tag & Pixel');
    this.pageDataService.setPageData({
      title: 'Tag & Pixel',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Tag & Pixel', url: 'https://www.youtube.com/embed/DFvMIAE7BA4?si=ai5tI7-n6qfTCTC9'},
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
      googleSearchConsoleToken: [null],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.googleSearchConsoleToken);
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    this.addSetting(this.dataForm.value);
  }


  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('googleSearchConsoleToken')
      .subscribe({
        next: res => {
          if (res.data && res.data.googleSearchConsoleToken) {
            this.googleSearchConsoleToken = res.data;
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
