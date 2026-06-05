import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopInformationRoutingModule } from './shop-information-routing.module';
import { ShopInformationComponent } from './shop-information.component';
import {
    GalleryImagePickerComponent
} from "../../../shared/components/gallery-image-picker/gallery-image-picker.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from '@angular/material/radio';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ShopInformationComponent
  ],
  imports: [
    CommonModule,
    ShopInformationRoutingModule,
    GalleryImagePickerComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
  ]
})
export class ShopInformationModule { }
