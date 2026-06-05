import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Blog} from "../../../interfaces/common/blog.interface";
import {Select} from "../../../interfaces/core/select";
import {BANNER_TYPE, DATA_STATUS, URL_TYPES} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {BlogService} from "../../../services/common/blog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../../services/core/utils.service";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {MatSelectChange} from "@angular/material/select";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.scss'
})
export class AddBlogComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  blog: Blog;
  dataStatus: Select[] = DATA_STATUS;
  urlTypes: Select[] = URL_TYPES;
  blogType: Select[] = BANNER_TYPE;

  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: string[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly blogService = inject(BlogService);
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
        this.getBlogById();
      }
    });
    this.subscriptions.push(subParamMap);

    // Base Data
    this.setPageData();
  }


  /**
   * Page Data
   * setPageData()
   */
  private setPageData(): void {
    this.title.setTitle('Add Blog');
    this.pageDataService.setPageData({
      title: 'Add Blog',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add Blog', url: null},
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
      title: [null, Validators.required],
      slug: [null],
      images: [null, Validators.required],
      authorName: [null],
      shortDesc: [null],
      description: [null],
      autoSlug: [true],
      priority: [null],
      showHome: [false],
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


    if (!this.blog) {
      this.addBlog(mData);
    } else {
      this.updateBlogById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'blog', 'all-blog']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.blog);

    if (this.blog.images) {
      this.pickedImages = this.blog.images;
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
        this.router.navigate(['/customization/all-blog']).then();
      }
    });
    this.subscriptions.push(subDialogResult);
  }

  onPickedImage(event: any) {
    this.dataForm.patchValue({images: event});
  }

  /**
   * HTTP REQ HANDLE
   * getBlogById()
   * getAllSubCategories()
   * addBlog()
   * updateBlogById()
   * getAllCategories()
   */
  private getBlogById() {
    const subscription = this.blogService.getBlogById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.blog = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addBlog(data: any) {
    const subscription = this.blogService.addBlog(data)
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

  private updateBlogById(data: any) {
    const subscription = this.blogService.updateBlogById(this.blog._id, data)
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

  onSlugChange() {
    const slugControl = this.dataForm.get('slug');
    if (slugControl) {
      let value = slugControl.value || '';

      // Format: remove special characters, replace spaces with dashes, and lowercase
      let formatted = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')     // remove non-alphanumeric except space/dash
          .replace(/\s+/g, '-')         // replace spaces with dash
          .replace(/-+/g, '-');         // collapse multiple dashes

      // Set the formatted value back to the control
      slugControl.setValue(formatted, { emitEvent: false });
    }
  }
  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

}
