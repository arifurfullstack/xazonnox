import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddOfferPageRoutingModule } from './add-offer-page-routing.module';
import { AddOfferPageComponent } from './add-offer-page.component';
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
import {HtmlEditorComponent} from "../../../shared/components/html-editor/html-editor.component";
import {ProductSearchComponent} from "../../../shared/components/product-search/product-search.component";


@NgModule({
  declarations: [
    AddOfferPageComponent
  ],
    imports: [
        CommonModule,
        AddOfferPageRoutingModule,
        DigitOnlyModule,
        GalleryImagePickerComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MaterialModule,
        ReactiveFormsModule,
        HtmlEditorComponent,
        ProductSearchComponent
    ]
})
export class AddOfferPageModule { }
