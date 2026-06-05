import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewReleaseReportRoutingModule } from './new-release-report-routing.module';
import { NewReleaseReportComponent } from './new-release-report.component';
import {FormsModule} from "@angular/forms";
import {InfiniteScrollDirective} from "../../shared/directives/infinite-scroll.directive";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MaterialModule} from "../../material/material.module";


@NgModule({
  declarations: [
    NewReleaseReportComponent
  ],
  imports: [
    CommonModule,
    NewReleaseReportRoutingModule,
    FormsModule,
    InfiniteScrollDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    MaterialModule
  ]
})
export class NewReleaseReportModule { }
