import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddChildCategoryRoutingModule } from './add-child-category-routing.module';
import { AddChildCategoryComponent } from './add-child-category.component';
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
    AddChildCategoryComponent
  ],
    imports: [
        CommonModule,
        AddChildCategoryRoutingModule,
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
export class AddChildCategoryModule { }
