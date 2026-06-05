import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancePaymentRoutingModule } from './advance-payment-routing.module';
import { AdvancePaymentComponent } from './advance-payment.component';
import {HtmlEditorComponent} from "../../../shared/components/html-editor/html-editor.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AdvancePaymentComponent
  ],
  imports: [
    CommonModule,
    AdvancePaymentRoutingModule,
    HtmlEditorComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdvancePaymentModule { }
