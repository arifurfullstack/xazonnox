import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBannerComponent} from "./all-banner.component";

const routes: Routes = [
  { path: '', component: AllBannerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBannerRoutingModule { }
