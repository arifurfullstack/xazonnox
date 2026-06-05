import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllProductComponent} from "./all-product.component";

const routes: Routes = [
  { path: '', component: AllProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllProductRoutingModule { }
