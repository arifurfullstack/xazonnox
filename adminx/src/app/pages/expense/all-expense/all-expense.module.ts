import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllExpenseRoutingModule } from './all-expense-routing.module';
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
import {AllExpenseComponent} from "./all-expense.component";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";


@NgModule({
  declarations: [
    AllExpenseComponent
  ],
  imports: [
    CommonModule,
    AllExpenseRoutingModule,
    FormsModule,
    LimitTextPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NoContentComponent,
    PageLoaderComponent,
    PaginationComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    GalleryImageViewerComponent
  ]
})
export class AllExpenseModule { }
