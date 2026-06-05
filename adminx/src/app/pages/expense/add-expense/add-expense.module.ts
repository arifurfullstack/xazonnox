import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddExpenseRoutingModule } from './add-expense-routing.module';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {AddExpenseComponent} from "./add-expense.component";


@NgModule({
  declarations: [
    AddExpenseComponent
  ],
  imports: [
    CommonModule,
    AddExpenseRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class AddExpenseModule { }
