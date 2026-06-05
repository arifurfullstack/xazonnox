import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffiliateMarketingRoutingModule } from './affiliate-marketing-routing.module';
import { AffiliateMarketingComponent } from './affiliate-marketing.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
  declarations: [
    AffiliateMarketingComponent
  ],
  imports: [
    CommonModule,
    AffiliateMarketingRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule
  ]
})
export class AffiliateMarketingModule { }
