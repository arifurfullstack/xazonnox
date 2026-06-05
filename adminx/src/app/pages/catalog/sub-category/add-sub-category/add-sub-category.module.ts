import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSubCategoryRoutingModule } from './add-sub-category-routing.module';
import { AddSubCategoryComponent } from './add-sub-category.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {
    GalleryImagePickerComponent
} from "../../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AddSubCategoryComponent
  ],
    imports: [
        CommonModule,
        AddSubCategoryRoutingModule,
        DigitOnlyModule,
        GalleryImagePickerComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class AddSubCategoryModule { }
