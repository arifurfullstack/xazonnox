import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllChildCategoryComponent} from "./all-child-category.component";

const routes: Routes = [
  { path: '', component: AllChildCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllChildCategoryRoutingModule { }
