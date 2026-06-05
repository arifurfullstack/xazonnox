import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleConsoleRoutingModule } from './google-console-routing.module';
import { GoogleConsoleComponent } from './google-console.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    GoogleConsoleComponent
  ],
    imports: [
        CommonModule,
        GoogleConsoleRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class GoogleConsoleModule { }
