import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCustomDomainRoutingModule } from './add-custom-domain-routing.module';
import { AddCustomDomainComponent } from './add-custom-domain.component';
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    AddCustomDomainComponent
  ],
    imports: [
        CommonModule,
        AddCustomDomainRoutingModule,
        MaterialModule
    ]
})
export class AddCustomDomainModule { }
