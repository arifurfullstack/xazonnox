import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductSettingRoutingModule } from './product-setting-routing.module';
import { ProductSettingComponent } from './product-setting.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ProductSettingComponent
  ],
  imports: [
    CommonModule,
    ProductSettingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,

  ]
})
export class ProductSettingModule { }
