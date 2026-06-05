import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductRoutingModule } from './all-product-routing.module';
import { AllProductComponent } from './all-product.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    GalleryImageViewerComponent
} from "../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../../shared/pipes/limit-text.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NoContentComponent} from "../../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../../../shared/components/pagination/pagination.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {DaysRemainingPipe} from "../../../shared/pipes/days-remaining.pipe";


@NgModule({
  declarations: [
    AllProductComponent
  ],
    imports: [
        CommonModule,
        AllProductRoutingModule,
        FormsModule,
        GalleryImageViewerComponent,
        LimitTextPipe,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        NoContentComponent,
        PageLoaderComponent,
        PaginationComponent,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        DaysRemainingPipe
    ]
})
export class AllProductModule { }
