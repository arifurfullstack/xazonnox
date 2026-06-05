import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSeoPageRoutingModule } from './add-seo-page-routing.module';
import { AddSeoPageComponent } from './add-seo-page.component';
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
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AddSeoPageComponent
  ],
    imports: [
        CommonModule,
        AddSeoPageRoutingModule,
        DigitOnlyModule,
        GalleryImagePickerComponent,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule
    ]
})
export class AddSeoPageModule { }
