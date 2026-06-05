import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPopupRoutingModule } from './add-popup-routing.module';
import { AddPopupComponent } from './add-popup.component';
import {
    GalleryImagePickerComponent
} from "../../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AddPopupComponent
  ],
    imports: [
        CommonModule,
        AddPopupRoutingModule,
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
export class AddPopupModule { }
