import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllOrderComponent} from "./all-order.component";

const routes: Routes = [
  {path: '', component: AllOrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllOrderRoutingModule { }
