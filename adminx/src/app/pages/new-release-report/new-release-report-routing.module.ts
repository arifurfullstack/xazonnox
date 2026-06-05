import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NewReleaseReportComponent} from "./new-release-report.component";

const routes: Routes = [
  {
    path: '',
    component: NewReleaseReportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewReleaseReportRoutingModule { }
