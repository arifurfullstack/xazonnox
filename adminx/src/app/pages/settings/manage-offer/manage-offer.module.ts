import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageOfferRoutingModule } from './manage-offer-routing.module';
import { ManageOfferComponent } from './manage-offer.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ManageOfferComponent
  ],
    imports: [
        CommonModule,
        ManageOfferRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class ManageOfferModule { }
