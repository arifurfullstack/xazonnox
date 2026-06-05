import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ActivatedRoute} from '@angular/router';
import { AdditionalPage } from '../../../../interfaces/core/additional-page.interface';
import { UiService } from '../../../../services/core/ui.service';
import { AdditionalPageService } from '../../../../services/core/additional-page.service';
import { DATA_STATUS } from '../../../../core/utils/app-data';
import { Select } from '../../../../interfaces/core/select';
import {Subscription} from "rxjs";
// import {UiService} from '../../../../../services/core/ui.service';
// import { AdditionalPageService } from 'src/app/services/core/additional-page.service';
// import {AdditionalPage} from '../../../../../interfaces/core/additional-page.interface';
// import Quill from 'quill';
// import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
// Quill.register('modules/blotFormatter', BlotFormatter);


@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit, OnDestroy {

  // Ngx Quill
  modules: any = null;

  // Store Data
  slug: string = null;
  pageInfo: AdditionalPage = null;
  nameData: string

  dataStatus: Select[] = DATA_STATUS;

  // Data Form
  dataForm: FormGroup;

  private subRoute2:Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private additionalPageService: AdditionalPageService,
  ) {
  }


  ngOnInit(): void {

    this.initDataForm();

    this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });

    this.subRoute2 = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.nameData = qParam.get('name');
      if (this.nameData) {
        this.dataForm.patchValue({name: this.nameData});
      }
    });

  }


  /**
   * FORM FUNCTIONS
   * initDataForm()
   * setFormData()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.pageInfo);
    if (this.pageInfo.isHtml) {
      this.dataForm.patchValue({htmlBase: this.pageInfo.description});
    }

  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.message('Please complete required fields', 'warn')
      return;
    }
    this.addPageInfo();
  }

  /**
   * HTTP REQ HANDLE
   */

  private addPageInfo() {
    let finalData;
    if (this.pageInfo) {
      finalData = {...this.dataForm.value, ...{slug: this.slug, _id: this.pageInfo._id}};
    } else {
      finalData = {...this.dataForm.value, ...{slug: this.slug}};
    }

    this.additionalPageService.addAdditionalPage(finalData)
      .subscribe({
        next: (res => {
          console.log(res)
          this.uiService.message(res.message, 'success');
        }),
        error: (error => {
          console.log(error);
        })
      });
  }

  private getPageInfo() {
    this.additionalPageService.getAdditionalPageBySlug(this.slug)
      .subscribe({
        next: (res => {
          this.pageInfo = res.data;
          if (this.pageInfo) {
            this.setFormData();
          }
        }),
        error: (error => {
          console.log(error);
        })
      });
  }


  /**
   * HTML EDIT FUNCTIONS
   * onChangeBaseHtml()
   * onCheckChange()
   */
  onChangeBaseHtml(event: string) {
    this.dataForm.patchValue({
      description: event
    })
  }

  onCheckChange(event: MatCheckboxChange) {
    this.dataForm.patchValue({
      description: null,
      htmlBase: null
    })
  }

  ngOnDestroy() {

  }
}
