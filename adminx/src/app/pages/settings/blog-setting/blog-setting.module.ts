import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogSettingRoutingModule } from './blog-setting-routing.module';
import { BlogSettingComponent } from './blog-setting.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BlogSettingComponent
  ],
  imports: [
    CommonModule,
    BlogSettingRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class BlogSettingModule { }
