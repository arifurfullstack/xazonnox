import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Carousel} from "../../../../interfaces/common/carousel.interface";
import {Select} from "../../../../interfaces/core/select";
import {DATA_STATUS, MAX_UPLOAD, URL_TYPES} from "../../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {CarouselService} from "../../../../services/common/carousel.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../../../services/core/utils.service";
import {PageDataService} from "../../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {MatSelectChange} from "@angular/material/select";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {Pagination} from "../../../../interfaces/core/pagination";
import {FilterData} from "../../../../interfaces/gallery/filter-data";

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  styleUrl: './add-carousel.component.scss'
})
export class AddCarouselComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  carousel: Carousel;
  dataStatus: Select[] = DATA_STATUS;
  urlTypes: Select[] = URL_TYPES;
  protected maxUpload: number = MAX_UPLOAD;

  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: string[] = [];

  // Pagination
  protected currentPage = 1;
  protected totalData = 0;
  protected dataPerPage = 10;

  // Filter
  filter: any = null;
  defaultFilter: any = null;
  searchQuery = null;

  private sortQuery = {createdAt: -1};
  private readonly select: any = {
    name: 1,
    url: 1,
    urlType: 1,
    images: 1,
    createdAt: 1,
    deleteDateString: 1,
    status: 1,
    priority: 1,
  }

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly carouselService = inject(CarouselService);
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
        this.getCarouselById();
      }
    });
    this.subscriptions.push(subParamMap);

    // Base Data
    this.setPageData();
    this.getAllCarousel();
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    if(this.id){
      this.title.setTitle('Update Carousel');
    }else {
      this.title.setTitle('Add Carousel');
    }
    this.pageDataService.setPageData({
      title: 'Add Carousel',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add Carousel', url: 'https://www.youtube.com/embed/szVMgCZvnTw'},
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
      name: [null],
      images: [null, Validators.required],
      type: [null],
      url: [null],
      urlType: [null],
      priority: [null],
      status: ['publish'],
    });
  }

  onSubmit() {
    if (!this.dataForm.value.images || !this.dataForm.value.images.length) {
      this.uiService.message('Image is required, Please select image', 'warn');
      this.dataForm.markAllAsTouched();
      return;
    }

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
        ...{
          url: this.utilsService.extractPath(this.dataForm.value.url)
        }
      }
    }

    if (!this.carousel) {
      this.addCarousel(mData);
    } else {
      this.updateCarouselById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'customization', 'all-carousel']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.carousel);

    if (this.carousel.images) {
      this.pickedImages = this.carousel.images;
    }
  }

  private patchDefaultValue() {
    this.dataForm.patchValue({status: 'publish'});
    this.pickedImages = [];
  }

  /**
   * SELECTION CHANGE
   * onUrlTypeChange()
   */
  onUrlTypeChange(event: MatSelectChange) {
    if (!event.value) {
      this.dataForm.get('url').setValue(null);
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
        this.router.navigate(['/customization/all-carousel']).then();
      }
    });
    this.subscriptions.push(subDialogResult);
  }

  onPickedImage(event: any) {
    this.dataForm.patchValue({images: event});
  }

  /**
   * HTTP REQ HANDLE
   * getCarouselById()
   * getAllSubCategories()
   * addCarousel()
   * updateCarouselById()
   * getAllCategories()
   */
  private getCarouselById() {
    const subscription = this.carouselService.getCarouselById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.carousel = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addCarousel(data: any) {
    const subscription = this.carouselService.addCarousel(data)
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

  private updateCarouselById(data: any) {
    const subscription = this.carouselService.updateCarouselById(this.carousel._id, data)
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

  private getAllCarousel() {
    // console.log('getAllCarousel')
    const pagination: Pagination = {
      pageSize: Number(this.dataPerPage),
      currentPage: Number(this.currentPage) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: {
        ...this.filter,
        ...(this.filter?.status ? {} : {status: {$ne: 'trash'}})
      },
      select: this.select,
      sort: this.sortQuery
    }

    const subscription = this.carouselService.getAllCarousel(filterData, this.searchQuery)
      .subscribe({
        next: res => {
          this.totalData = res.count ?? 0;
          // if(this.totalData>=this.maxUpload){
          //   this.uiService.message(`Your can upload maximum ${this.maxUpload} data at same time.`, 'warn');
          //   this.router.navigate(['/customization/all-carousel']);
          // }
        },
        error: err => {
          console.log(err)
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
