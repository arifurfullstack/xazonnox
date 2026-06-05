import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncompleteOrderDetailsRoutingModule } from './incomplete-order-details-routing.module';
import { IncompleteOrderDetailsComponent } from './incomplete-order-details.component';
import {CurrencyPipe} from "../../../shared/pipes/currency.pipe";
import {ImageLoadErrorModule} from "../../../shared/directives/image-load/image-load-error.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {OrderTimelineModule} from "../../../shared/components/order-timeline/order-timeline.module";
import {ProductPricePipe} from "../../../shared/pipes/product-price.pipe";


@NgModule({
  declarations: [
    IncompleteOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    IncompleteOrderDetailsRoutingModule,
    CurrencyPipe,
    ImageLoadErrorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    OrderTimelineModule,
    ProductPricePipe
  ]
})
export class IncompleteOrderDetailsModule { }
