import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllSkinTypeRoutingModule } from './all-skin-type-routing.module';
import { AllSkinTypeComponent } from './all-skin-type.component';
import {DaysRemainingPipe} from "../../../../shared/pipes/days-remaining.pipe";
import {FormsModule} from "@angular/forms";
import {
  GalleryImageViewerComponent
} from "../../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../../../shared/pipes/limit-text.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../../../material/material.module";
import {NoContentComponent} from "../../../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../../../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../../../../shared/components/pagination/pagination.component";


@NgModule({
  declarations: [
    AllSkinTypeComponent
  ],
  imports: [
    CommonModule,
    AllSkinTypeRoutingModule,
    DaysRemainingPipe,
    FormsModule,
    GalleryImageViewerComponent,
    LimitTextPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MaterialModule,
    NoContentComponent,
    PageLoaderComponent,
    PaginationComponent
  ]
})
export class AllSkinTypeModule { }
