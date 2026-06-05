import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddBannerComponent} from "./add-banner.component";

const routes: Routes = [
  { path: '', component: AddBannerComponent },
  { path: ':id', component: AddBannerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBannerRoutingModule { }
