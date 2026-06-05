import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AffiliateMarketingComponent} from "./affiliate-marketing.component";

const routes: Routes = [
  {path: '', component: AffiliateMarketingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliateMarketingRoutingModule { }
