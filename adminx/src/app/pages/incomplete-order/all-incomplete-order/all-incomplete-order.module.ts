import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllIncompleteOrderRoutingModule } from './all-incomplete-order-routing.module';
import { AllIncompleteOrderComponent } from './all-incomplete-order.component';
import {CodPipe} from "../../../shared/pipes/cod.pipe";
import {CurrencyPipe} from "../../../shared/pipes/currency.pipe";
import {DaysRemainingPipe} from "../../../shared/pipes/days-remaining.pipe";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    GalleryImageViewerComponent
} from "../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../../../shared/pipes/limit-text.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NoContentComponent} from "../../../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../../../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../../../shared/components/pagination/pagination.component";
import {PaymentStatusPipe} from "../../../shared/pipes/payment-status.pipe";


@NgModule({
  declarations: [
    AllIncompleteOrderComponent
  ],
    imports: [
        CommonModule,
        AllIncompleteOrderRoutingModule,
        CodPipe,
        CurrencyPipe,
        DaysRemainingPipe,
        FormsModule,
        GalleryImageViewerComponent,
        LimitTextPipe,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        NoContentComponent,
        PageLoaderComponent,
        PaginationComponent,
        PaymentStatusPipe,
        ReactiveFormsModule
    ]
})
export class AllIncompleteOrderModule { }
