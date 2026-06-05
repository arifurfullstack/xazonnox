import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {SettingService} from "../../../services/common/setting.service";
import {VendorService} from "../../../services/vendor/vendor.service";
import {Title} from "@angular/platform-browser";
import {PageDataService} from "../../../services/core/page-data.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {ReloadService} from "../../../services/core/reload.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-blog-setting',
  templateUrl: './blog-setting.component.html',
  styleUrl: './blog-setting.component.scss'
})
export class BlogSettingComponent implements OnInit, OnDestroy {

  // Store Data from param
  dataForm: FormGroup;
  blogSetting: any;

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly uiService = inject(UiService);
  private readonly settingService = inject(SettingService);
  private readonly vendorService = inject(VendorService);
  private readonly title = inject(Title);
  private readonly pageDataService = inject(PageDataService);
  private readonly clipboard = inject(Clipboard);
  private readonly reloadService = inject(ReloadService);

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
    this.title.setTitle('Blog');
    this.pageDataService.setPageData({
      title: 'Blog',
      navArray: [
        {name: 'Settings', url: `/settings`},
        {name: 'Blog', url: 'https://www.youtube.com/embed/vcn15ymZp3g'},
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
      isEnableBlog: [false],
    });
  }



  private setFormData() {
    this.dataForm.patchValue({
      isEnableBlog: this.blogSetting.blog.isEnableBlog,
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete all the required fields', 'warn');
      return;
    }

    const mData = {
      blog: {
        isEnableBlog: this.dataForm.value.isEnableBlog,
      },

    };

    this.addSetting(mData);
  }



  /**
   * HTTP REQ HANDLE
   * getSetting()
   * addSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('blog')
      .subscribe({
        next: res => {
          if (res.data && res.data.blog) {
            this.blogSetting = res.data;
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
          this.reloadService.needRefreshIncompleteOrder$();
        }
        ,
        error: err => {
          console.log(err);
        }
      });
    this.subscriptions.push(subscription);
  }

  get csvUrl() {
    return `${environment.ftpBaseLink}/upload/csv/${this.vendorService.getShopId()}/datafeed.csv`;
  }

  onCopyCsv() {
    this.clipboard.copy(this.csvUrl);
    this.uiService.message('Url Copied!', 'success');
  }


  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  protected readonly onchange = onchange;
}
