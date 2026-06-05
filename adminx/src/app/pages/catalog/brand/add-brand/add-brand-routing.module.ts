import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddBrandComponent} from "./add-brand.component";

const routes: Routes = [
  { path: '', component: AddBrandComponent },
  { path: ':id', component: AddBrandComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrandRoutingModule { }
