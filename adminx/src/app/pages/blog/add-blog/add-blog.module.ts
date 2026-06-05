import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBlogRoutingModule } from './add-blog-routing.module';
import { AddBlogComponent } from './add-blog.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {
    GalleryImagePickerComponent
} from "../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HtmlEditorComponent} from "../../../shared/components/html-editor/html-editor.component";


@NgModule({
  declarations: [
    AddBlogComponent
  ],
  imports: [
    CommonModule,
    AddBlogRoutingModule,
    DigitOnlyModule,
    GalleryImagePickerComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    HtmlEditorComponent
  ]
})
export class AddBlogModule { }
