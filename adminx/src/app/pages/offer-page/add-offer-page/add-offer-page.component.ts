import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {OfferPage} from "../../../interfaces/common/offer-page.interface";
import {Select} from "../../../interfaces/core/select";
import {DATA_STATUS, ShowType, URL_TYPES} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {OfferPageService} from "../../../services/common/offer-page.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../../services/core/utils.service";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {Product} from "../../../interfaces/common/product.interface";

@Component({
  selector: 'app-add-offer-page',
  templateUrl: './add-offer-page.component.html',
  styleUrl: './add-offer-page.component.scss'
})
export class AddOfferPageComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  offerPage: OfferPage;
  dataStatus: Select[] = DATA_STATUS;
  urlTypes: Select[] = URL_TYPES;
  autoSlug: boolean = true;
  allTableData: Product[] = [];
  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: string[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = []


  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly offerPageService = inject(OfferPageService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly utilsService = inject(UtilsService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.initDataForm();
    // ParamMap Subscription
    const subParamMap = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOfferPageById();
      }
    });
    this.subscriptions.push(subParamMap);

    // Auto Slug
    this.autoGenerateSlug();
    this.setPageData();
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Add OfferPage');
    this.pageDataService.setPageData({
      title: 'Add OfferPage',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add OfferPage', url: null},
      ]
    })
  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   * onDiscard()
   * setFormValue()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      images: [null],
      description: [null],
      shortDes: [null],
      product: [null],
      url: [null],
      slug: [null],
      background: [null],
      type: [null],
      status: ['publish'],
    });
  }

  onSubmit() {
    // if (!this.dataForm.value.images || !this.dataForm.value.images.length) {
    //   this.uiService.message('Image is required, Please select image', 'warn');
    //   this.dataForm.markAllAsTouched();
    //   return;
    // }

    if (this.dataForm.invalid) {
      this.uiService.message('Please fill all the required fields', 'warn');
      return;
    }


    let mData = {
      ...this.dataForm.value,
    };

    if (this.dataForm.value.urlType === 'internal') {
      mData = {
        ...mData,
        // ...{
        //   url: this.utilsService.extractPath(this.dataForm.value.url),
        // }
      }
    }

    if (!this.offerPage) {
      this.addOfferPage(mData);
    } else {
      this.updateOfferPageById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'catalog', 'all-offerPage']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.offerPage);

    if (this.offerPage.images) {
      this.pickedImages = this.offerPage.images;
    }
    if(this.offerPage.product) {
      this.allTableData = [this.offerPage.product]
    }
  }

  private patchDefaultValue() {
    this.dataForm.patchValue({status: 'publish'});
    this.pickedImages = [];
  }

  onTypeChange() {
    const type = this.dataForm.get('type')?.value;
    if (type === 'image') {
      this.dataForm.get('url')?.reset();
      this.dataForm.patchValue({url:null})
      this.pickedImages = []; // Clear selected images
    } else if (type === 'video') {
      // Reset image picker when switching to video type
      this.dataForm.get('images')?.reset();
      this.dataForm.patchValue({images:null})
      this.pickedImages = []; // Clear selected images
    }
  }
  /**
   * COMPONENT DIALOG
   * openConfirmDialog()
   * onPickedImage()
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Discard',
        message: 'Are you sure you want to discard?'
      }
    });
    const subDialogResult = dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.router.navigate(['/catalog/all-offerPage']).then();
      }
    });
    this.subscriptions.push(subDialogResult);
  }

  onPickedImage(event: any) {
    this.dataForm.patchValue({images: event});
  }

  /**
   * HTTP REQ HANDLE
   * getOfferPageById()
   * addOfferPage()
   * updateOfferPageById()
   */
  private getOfferPageById() {
    const subscription = this.offerPageService.getOfferPageById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.offerPage = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addOfferPage(data: any) {
    const subscription = this.offerPageService.addOfferPage(data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.formElement.resetForm();
            this.patchDefaultValue();
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions.push(subscription);
  }

  private updateOfferPageById(data: any) {
    const subscription = this.offerPageService.updateOfferPageById(this.offerPage._id, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
          } else {
            this.uiService.message(res.message, 'warn');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions.push(subscription);
  }
  /**
   * LOGICAL PART
   * onProductSelect()
   * deleteProducts()
   */

  onProductSelect(event: Product) {
    this.allTableData.push(event);
    this.dataForm.patchValue({product: this.allTableData[0]});
  }

  deleteProduct(index: number) {
    // Remove the product at the specified index
    this.allTableData.splice(index, 1);
    if (this.allTableData.length > 0) {
      this.dataForm.patchValue({ product: this.allTableData[0] });
    } else {
      this.dataForm.patchValue({ product: null });
    }
  }
  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    let subAutoSlug: any;
    if (this.autoSlug === true) {
      subAutoSlug = this.dataForm.get('name').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
      this.subscriptions.push(subAutoSlug);
    } else {
      if (!subAutoSlug) {
        return;
      }
      this.subscriptions.push(subAutoSlug);
    }
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }


  // protected readonly bannerType = BANNER_TYPE;
  protected readonly showType = ShowType;
}
