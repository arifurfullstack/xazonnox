import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCarouselRoutingModule } from './add-carousel-routing.module';
import { AddCarouselComponent } from './add-carousel.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    GalleryImagePickerComponent
} from "../../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [
    AddCarouselComponent
  ],
    imports: [
        CommonModule,
        AddCarouselRoutingModule,
        DigitOnlyModule,
        FormsModule,
        GalleryImagePickerComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule
    ]
})
export class AddCarouselModule { }
