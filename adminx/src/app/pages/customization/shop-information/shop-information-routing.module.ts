import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopInformationComponent} from "./shop-information.component";

const routes: Routes = [
  { path: '', component: ShopInformationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopInformationRoutingModule { }
