import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllIncompleteOrderComponent} from "./all-incomplete-order.component";

const routes: Routes = [
  {path: '', component: AllIncompleteOrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllIncompleteOrderRoutingModule { }
