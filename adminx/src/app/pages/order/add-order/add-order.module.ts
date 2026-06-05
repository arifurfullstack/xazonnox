import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddOrderRoutingModule } from './add-order-routing.module';
import {AddOrderComponent} from "./add-order.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  GalleryImageViewerComponent
} from "../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../../shared/pipes/limit-text.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {PricePipe} from "../../../shared/pipes/price.pipe";
import {ProductSearchComponent} from "../../../shared/components/product-search/product-search.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMenuModule} from "@angular/material/menu";
import {NoContentComponent} from "../../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../../../shared/components/pagination/pagination.component";
import {ProductPricePipe} from "../../../shared/pipes/product-price.pipe";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {CurrencyCtrPipe} from "../../../shared/pipes/currency.pipe2";
import {CurrencyPipe} from "../../../shared/pipes/currency.pipe";


@NgModule({
  declarations: [
    AddOrderComponent
  ],
  imports: [
    CommonModule,
    AddOrderRoutingModule,
    FormsModule,
    GalleryImageViewerComponent,
    LimitTextPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    PricePipe,
    ProductSearchComponent,
    ReactiveFormsModule,

    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMenuModule,
    NoContentComponent,
    PageLoaderComponent,
    PaginationComponent,
    ProductPricePipe,
    DigitOnlyModule,
    CurrencyCtrPipe,
    CurrencyPipe,
  ]
})
export class AddOrderModule { }
