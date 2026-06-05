import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SubscriptionReportComponent} from "./subscription-report.component";

const routes: Routes = [
  {path: '', component: SubscriptionReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionReportRoutingModule { }
