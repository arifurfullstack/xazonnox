import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFixedLandingPageRoutingModule } from './add-fixed-landing-page-routing.module';
import { AddFixedLandingPageComponent } from './add-fixed-landing-page.component';
import {
  GalleryImagePickerComponent
} from "../../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {HtmlEditorComponent} from "../../../../shared/components/html-editor/html-editor.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../../material/material.module";
import {ProductSearchComponent} from "../../../../shared/components/product-search/product-search.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AddFixedLandingPageComponent
  ],
  imports: [
    CommonModule,
    AddFixedLandingPageRoutingModule,
    GalleryImagePickerComponent,
    HtmlEditorComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MaterialModule,
    ProductSearchComponent,
    ReactiveFormsModule
  ]
})
export class AddFixedLandingPageModule { }
