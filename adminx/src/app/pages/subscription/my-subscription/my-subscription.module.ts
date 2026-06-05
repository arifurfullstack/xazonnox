import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySubscriptionRoutingModule } from './my-subscription-routing.module';
import { MySubscriptionComponent } from './my-subscription.component';
import {CurrencyPipe} from "../../../shared/pipes/currency.pipe";


@NgModule({
  declarations: [
    MySubscriptionComponent
  ],
    imports: [
        CommonModule,
        MySubscriptionRoutingModule,
        CurrencyPipe
    ]
})
export class MySubscriptionModule { }
