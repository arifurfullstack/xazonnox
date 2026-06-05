import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCouponRoutingModule } from './add-coupon-routing.module';
import { AddCouponComponent } from './add-coupon.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {
  GalleryImagePickerComponent
} from "../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    AddCouponComponent
  ],
  imports: [
    CommonModule,
    AddCouponRoutingModule,
    DigitOnlyModule,
    GalleryImagePickerComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AddCouponModule { }
