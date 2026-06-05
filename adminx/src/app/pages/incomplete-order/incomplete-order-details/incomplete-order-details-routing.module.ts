import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IncompleteOrderDetailsComponent} from "./incomplete-order-details.component";

const routes: Routes = [
  {path: '', component: IncompleteOrderDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncompleteOrderDetailsRoutingModule { }
