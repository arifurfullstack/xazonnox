import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllSubCategoryComponent} from "./all-sub-category.component";

const routes: Routes = [
  { path: '', component: AllSubCategoryComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSubCategoryRoutingModule { }
