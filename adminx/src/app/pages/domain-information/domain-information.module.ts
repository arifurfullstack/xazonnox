import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomainInformationRoutingModule } from './domain-information-routing.module';
import { DomainInformationComponent } from './domain-information.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {ImageCropperModule} from "ngx-image-cropper";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {ImageCropComponent} from "../../shared/components/image-crop/image-crop.component";
import {RoleViewPipe} from "../../shared/pipes/role-view.pipe";


@NgModule({
  declarations: [
    DomainInformationComponent
  ],
  imports: [
    CommonModule,
    DomainInformationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ImageCropComponent,
    RoleViewPipe
  ]
})
export class DomainInformationModule { }
