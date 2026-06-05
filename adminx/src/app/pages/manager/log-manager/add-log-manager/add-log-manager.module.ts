import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLogManagerRoutingModule } from './add-log-manager-routing.module';
import { AddLogManagerComponent } from './add-log-manager.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [
    AddLogManagerComponent
  ],
    imports: [
        CommonModule,
        AddLogManagerRoutingModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule
    ]
})
export class AddLogManagerModule { }
