import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {BlogComment} from "../../../interfaces/common/blog-comment.interface";
import {Select} from "../../../interfaces/core/select";
import {BANNER_TYPE, DATA_STATUS, URL_TYPES} from "../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {MatDialog} from "@angular/material/dialog";
import {BlogCommentService} from "../../../services/common/blog-comment.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../../services/core/utils.service";
import {PageDataService} from "../../../services/core/page-data.service";
import {Title} from "@angular/platform-browser";
import {MatSelectChange} from "@angular/material/select";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-add-blog-comment',
  templateUrl: './add-blog-comment.component.html',
  styleUrl: './add-blog-comment.component.scss'
})
export class AddBlogCommentComponent implements OnInit, OnDestroy {

  // Decorator
  @ViewChild('formElement') formElement: NgForm;

  // Data Form
  dataForm?: FormGroup;

  // Store Data
  id: string;
  blogComment: BlogComment;
  dataStatus: Select[] = DATA_STATUS;
  urlTypes: Select[] = URL_TYPES;
  blogCommentType: Select[] = BANNER_TYPE;

  // Loading Control
  isLoading: boolean = false;

  // Image Control
  pickedImages: string[] = [];

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly uiService = inject(UiService);
  private readonly dialog = inject(MatDialog);
  private readonly blogCommentService = inject(BlogCommentService);
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
        this.getBlogCommentById();
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
    this.title.setTitle('Add BlogComment');
    this.pageDataService.setPageData({
      title: 'Add BlogComment',
      navArray: [
        {name: 'Dashboard', url: `/dashboard`},
        {name: 'Add BlogComment', url: null},
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
      reply: [null],
      review: [null],
      priority: [null],
      status: [null],
    });
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.message('Please fill all the required fields', 'warn');
      return;
    }


    let mData = {
      ...this.dataForm.value,
    };


    if (!this.blogComment) {
      this.addBlogComment(mData);
    } else {
      this.updateBlogCommentById(mData);
    }
  }

  onDiscard() {
    if (this.dataForm.dirty) {
      this.openConfirmDialog();
    } else {
      this.router.navigate(['/', 'blog-comment', 'all-blog-comment']).then();
    }
  }

  private setFormValue() {
    this.dataForm.patchValue(this.blogComment);

    if (this.blogComment.images) {
      this.pickedImages = this.blogComment.images;
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
        this.router.navigate(['/customization/all-blogComment']).then();
      }
    });
    this.subscriptions.push(subDialogResult);
  }

  onPickedImage(event: any) {
    this.dataForm.patchValue({images: event});
  }

  /**
   * HTTP REQ HANDLE
   * getBlogCommentById()
   * getAllSubCategories()
   * addBlogComment()
   * updateBlogCommentById()
   * getAllCategories()
   */
  private getBlogCommentById() {
    const subscription = this.blogCommentService.getBlogCommentById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.blogComment = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions.push(subscription);
  }

  private addBlogComment(data: any) {
    const subscription = this.blogCommentService.addBlogComment(data)
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

  private updateBlogCommentById(data: any) {
    const subscription = this.blogCommentService.updateBlogCommentById(this.blogComment._id, data)
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
