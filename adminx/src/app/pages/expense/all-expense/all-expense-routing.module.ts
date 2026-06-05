import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllExpenseComponent} from "./all-expense.component";

const routes: Routes = [
  {path: '', component: AllExpenseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllExpenseRoutingModule { }
