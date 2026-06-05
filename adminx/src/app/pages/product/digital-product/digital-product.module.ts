import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalProductRoutingModule } from './digital-product-routing.module';
import { DigitalProductComponent } from './digital-product.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {
    GalleryImagePickerComponent
} from "../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {HtmlEditorComponent} from "../../../shared/components/html-editor/html-editor.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DigitalProductComponent
  ],
    imports: [
        CommonModule,
        DigitalProductRoutingModule,
        DigitOnlyModule,
        GalleryImagePickerComponent,
        HtmlEditorComponent,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatOptionModule,
        MatSelectModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class DigitalProductModule { }
