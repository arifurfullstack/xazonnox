import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddOrderComponent} from "./add-order.component";

const routes: Routes = [
  {path: '', component: AddOrderComponent},
  {path: ':id', component: AddOrderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddOrderRoutingModule { }
