import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReviewsRoutingModule} from './reviews-routing.module';
import {ReviewsComponent} from './reviews.component';
import {ReplyReviewComponent} from './reply-review/reply-review.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {FlexModule} from '@angular/flex-layout';
import {MaterialModule} from "../../material/material.module";
import {GalleryImageViewerComponent} from "../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../shared/pipes/limit-text.pipe";
import {NoContentComponent} from "../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../../shared/components/pagination/pagination.component";
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {
  TableDetailsDialogComponent
} from "../../shared/dialog-view/table-details-dialog/table-details-dialog.component";
import { AddReviewsComponent } from './add-reviews/add-reviews.component';
import {ProductSearchComponent} from "../../shared/components/product-search/product-search.component";
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    ReviewsComponent,
    ReplyReviewComponent,
    AddReviewsComponent
  ],
    imports: [
        CommonModule,
        ReviewsRoutingModule,
        MaterialModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        FormsModule,
        LimitTextPipe,
        NoContentComponent,
        PageLoaderComponent,
        PaginationComponent,
        GalleryImagePickerComponent,
        TableDetailsDialogComponent,
        GalleryImageViewerComponent,
        LimitTextPipe,
        PaginationComponent,
        ProductSearchComponent,
        DigitOnlyModule,
    ]
})
export class ReviewsModule {
}
