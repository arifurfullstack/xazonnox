import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user.component';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NoWhitespaceModule} from "../../../shared/directives/no-whitespace/no-whitespace.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AddUserComponent
  ],
    imports: [
        CommonModule,
        AddUserRoutingModule,
        DigitOnlyModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatTooltipModule,
        NoWhitespaceModule,
        ReactiveFormsModule
    ]
})
export class AddUserModule { }
