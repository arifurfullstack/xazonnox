import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBrandComponent} from "./all-brand.component";

const routes: Routes = [
  { path: '', component: AllBrandComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBrandRoutingModule { }
