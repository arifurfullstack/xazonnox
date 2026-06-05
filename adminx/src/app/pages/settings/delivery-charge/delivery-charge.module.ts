import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DeliveryChargeRoutingModule} from './delivery-charge-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {DeliveryChargeComponent} from './delivery-charge.component';
import {MaterialModule} from "../../../material/material.module";
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    DeliveryChargeComponent
  ],
    imports: [
        CommonModule,
        DeliveryChargeRoutingModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MaterialModule,
        DigitOnlyModule,
    ]
})
export class DeliveryChargeModule {
}
