import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddChildCategoryComponent} from "./add-child-category.component";

const routes: Routes = [
  { path: '', component: AddChildCategoryComponent },
  { path: ':id', component: AddChildCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddChildCategoryRoutingModule { }
