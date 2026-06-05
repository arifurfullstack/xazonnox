import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomainSettingRoutingModule } from './domain-setting-routing.module';
import { DomainSettingComponent } from './domain-setting.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    DomainSettingComponent
  ],
    imports: [
        CommonModule,
        DomainSettingRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MaterialModule,
        ReactiveFormsModule,
        DigitOnlyModule
    ]
})
export class DomainSettingModule { }
