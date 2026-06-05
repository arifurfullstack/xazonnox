import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderSettingRoutingModule } from './order-setting-routing.module';
import { OrderSettingComponent } from './order-setting.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    OrderSettingComponent
  ],
  imports: [
    CommonModule,
    OrderSettingRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MaterialModule
  ]
})
export class OrderSettingModule { }
