import { Clipboard } from "@angular/cdk/clipboard";
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DATA_STATUS, URL_TYPES } from "../../../../core/utils/app-data";
import { LandingPage } from "../../../../interfaces/common/landing-page.interface";
import { Product } from "../../../../interfaces/common/product.interface";
import { Select } from "../../../../interfaces/core/select";
import { LandingPageService } from "../../../../services/common/landing-page.service";
import { ShopInformationService } from "../../../../services/common/shop-information.service";
import { PageDataService } from "../../../../services/core/page-data.service";
import { UiService } from "../../../../services/core/ui.service";
import { UtilsService } from "../../../../services/core/utils.service";
import { ConfirmDialogComponent } from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import { LandingPagePreviewDialogComponent } from "../../../../shared/dialog-view/landing-page-preview-dialog/landing-page-preview-dialog.component";
import { ThemeSelectorComponent } from "../theme-selector/theme-selector.component";


@Component({
  selector: 'app-add-landing-page',
  templateUrl: './add-landing-page.component.html',
  styleUrl: './add-landing-page.component.scss'
})
export class AddLandingPageComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;
  @ViewChild('templateContainer', {static: false}) templateContainer!: ElementRef;


  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  landingPage: LandingPage;
  dataStatus: Select[] = DATA_STATUS;
  urlTypes: Select[] = URL_TYPES;
  autoSlug: boolean = true;
  allTableData: Product[] = [];
  selectedData: any;
  link: any;
  selectedTab: number = 0;
  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: string[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = []
  shopInformation: any;
  isLoadMore = false;
  webLink = '/'

  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly landingPageService = inject(LandingPageService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly utilsService = inject(UtilsService);
  private readonly pageDataService = inject(PageDataService);
  private readonly title = inject(Title);
  private readonly shopInformationService = inject(ShopInformationService);
  private readonly clipboard = inject(Clipboard);

  ngOnInit(): void {
    this.initDataForm();
    this.getShopInformation();
    // ParamMap Subscription
    const subParamMap = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getLandingPageById();
      }
    });
    this.subscriptions.push(subParamMap);

    // Auto Slug
    this.autoGenerateSlug();
    this.setPageData();


  }

  ngAfterViewInit() {
    // Make sure the DOM is fully loaded before accessing the link element
    // const links:any = document.getElementById('link') as HTMLAnchorElement;
    // if (link && this.dataForm.value.slug) {
    //   link.href = `/landing-page/${this.dataForm.value.slug}#payment`;
    // } else {
    //   console.error('Link or slug value is missing.');
    // }
    const links = document.querySelectorAll('.link') as NodeListOf<HTMLAnchorElement>;
    // console.log(`Found ${links.length} link(s)`);
    links.forEach((link) => {
      if (link && this.dataForm.value.slug) {
        link.href = `/landing-page/${this.dataForm.value.slug}#payment`;
      } else {
        console.error('Slug value is missing or link is undefined.');
      }
    });
  }

  private getShopInformation() {
    this.shopInformationService.getShopInformation()
      .subscribe(res => {
        this.shopInformation = res.fShopDomain;
        this.webLink = this.shopInformation.domain ?? this.shopInformation.subDomain;
      }, err => {
        console.log(err);
      });
  }

  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Add LandingPage');
    this.pageDataService.setPageData({
      title: 'Add LandingPage',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add LandingPage', url: 'https://www.youtube.com/embed/otEQZ3oSQOY'},
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
      theme: [null],
      shortDes: [null],
      product: [null],
      url: [null],
      template: [null],
      slug: [null],
      background: [null],
      isHtml: [null],
      htmlBase: [null],
      type: [null],
      status: ['publish'],
    });
  }

  onSubmit() {
    // const link = document.getElementById('link') as HTMLAnchorElement;
    // if (link) {
    //   link.href = `http://${this.webLink}/landing-page/${this.dataForm.value.slug}#payment` ;
    // }
    // const originalHtml = this.templateContainer?.nativeElement?.innerHTML;
    // // HTML থেকে Angular-র attribute এবং অবাঞ্ছিত class গুলো মুছে ফেলা হচ্ছে
    // let cleanedHtml = this.cleanHTML(originalHtml);

    if (this.dataForm.invalid) {
      this.uiService.message('Please fill all the required fields', 'warn');
      return;
    }
    let mData;
    if (!this.dataForm.value.isHtml) {
       mData = {
        ...this.dataForm.value,
        ...{
          template: {
            _id: this.selectedData._id,
            image: this.selectedData.image,
            name: this.selectedData.name,
            link: this.selectedData.link,
            theme: this.dataForm.value.theme,
          }
        }
      };
    }else{
      mData = {
        ...this.dataForm.value,
      };
    }


    if (this.dataForm.value.urlType === 'internal') {
      mData = {
        ...mData,
      }
    }

    if (!this.landingPage) {
      this.addLandingPage(mData);
    } else {
      this.updateLandingPageById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/landing-page/all-customizable-landing-page']).then();

    }
  }

  private setFormValue() {

    this.dataForm.patchValue(this.landingPage);

    if (this.landingPage.template) {
      this.selectedData = this.landingPage.template;
      this.dataForm.patchValue({theme: this.landingPage.template.theme})
    }

    if (this.landingPage.images) {
      this.pickedImages = this.landingPage.images;
    }

    if (this.landingPage.product) {
      this.allTableData = [this.landingPage.product]
    }
    // const link = document.getElementById('link') as HTMLAnchorElement;
    // if (link) {
    //   link.href = `/landing-page/${this.dataForm.value.slug}#payment` ;
    // }

    const links = document.querySelectorAll('.link') as NodeListOf<HTMLAnchorElement>;
    console.log(`Found ${links.length} link(s)`);
    links.forEach((link) => {
      if (link && this.dataForm.value.slug) {
        link.href = `/landing-page/${this.dataForm.value.slug}#payment`;
      } else {
        console.error('Slug value is missing or link is undefined.');
      }
    });
  }

  private patchDefaultValue() {
    this.dataForm.patchValue({status: 'publish'});
    this.pickedImages = [];
  }

  changeVideo(): void {
    const videoId = prompt('Enter YouTube Video ID:');

    if (videoId === null || videoId.trim() === '') {
      alert('No video ID entered.');
      return;
    }

    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    alert(`Video URL: ${videoUrl}`);

    const iframe = document.getElementById('video') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = videoUrl;
    }

  }

  changePhone(): void {
    const phoneNumber = prompt('Enter phone:');

    if (!phoneNumber || phoneNumber.trim() === '') {
      alert('No phone entered.');
      return;
    }

    const phone = phoneNumber.trim();
    alert(`Phone: ${phone}`);

    const phoneElement = document.getElementById('phone') as HTMLAnchorElement;
    if (phoneElement) {
      phoneElement.href = `tel:${phone}`;
    } else {
      console.error("Element with ID 'phone' not found or is not an anchor tag.");
    }
  }

  copyLink(): void {
    const link = `/landing-page/${this.dataForm.value.slug}#payment`; // Replace with your dynamic link
    this.clipboard.copy(link);
    alert('Link copied to clipboard!'); // Optional feedback to the user
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
        this.router.navigate(['/landing-page/all-customizable-landing-page']).then();

      }
    });
    this.subscriptions.push(subDialogResult);
  }

  onPickedImage(event: any) {
    this.dataForm.patchValue({images: event});
    const image1 = document.getElementById('image') as HTMLIFrameElement;
    if (image1) {
      image1.src = this.dataForm.value.images[0];
    }
  }

  /**
   * HTTP REQ HANDLE
   * getLandingPageById()
   * addLandingPage()
   * updateLandingPageById()
   */
  private getLandingPageById() {
    const subscription = this.landingPageService.getLandingPageById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.landingPage = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addLandingPage(data: any) {
    const subscription = this.landingPageService.addLandingPage(data)
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

  private updateLandingPageById(data: any) {
    const subscription = this.landingPageService.updateLandingPageById(this.landingPage._id, data)
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
    console.log("event", event)
    this.allTableData.push(event);
    this.dataForm.patchValue({product: this.allTableData[0]});
  }

  deleteProduct(index: number) {
    // Remove the product at the specified index
    this.allTableData.splice(index, 1);
    if (this.allTableData.length > 0) {
      this.dataForm.patchValue({product: this.allTableData[0]});
    } else {
      this.dataForm.patchValue({product: null});
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

  onPreview() {
    // Prepare the data for preview
    const previewData = {
      ...this.dataForm.value,
      allTableData: this.allTableData,
      images: this.pickedImages
    };

    // Open the preview dialog
    const dialogRef = this.dialog.open(LandingPagePreviewDialogComponent, {
      width: '98vw',
      maxWidth: '1400px',
      height: '95vh',
      maxHeight: '95vh',
      panelClass: 'landing-page-preview-dialog',
      data: previewData,
      disableClose: false,
      autoFocus: false,
      restoreFocus: true,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close if needed
    });
  }

  // Method to set content dynamically for each tab
  setTabData(tabIndex: number): void {
    this.selectedTab = tabIndex;
  }

  openTemplateEditor() {
    const dialogRef = this.dialog.open(ThemeSelectorComponent, {
      maxWidth: '1200px',
      width: '100%',
      minHeight: '80vh',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.dataForm.patchValue({theme: dialogResult.theme});
        this.selectedData = dialogResult;
        // const link = document.getElementById('link') as HTMLAnchorElement;
        // if (link) {
        //   link.href = `/landing-page/${this.dataForm.value.slug}#payment` ;
        // }

        const links = document.querySelectorAll('.link') as NodeListOf<HTMLAnchorElement>;
        console.log(`Found ${links.length} link(s)`);
        links.forEach((link) => {
          if (link && this.dataForm.value.slug) {
            link.href = `/landing-page/${this.dataForm.value.slug}#payment`;
          } else {
            console.error('Slug value is missing or link is undefined.');
          }
        });
      }
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

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

}
