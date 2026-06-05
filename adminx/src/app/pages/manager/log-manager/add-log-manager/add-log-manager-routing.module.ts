import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddLogManagerComponent} from "./add-log-manager.component";

const routes: Routes = [
  {path: '', component: AddLogManagerComponent},
  {path: ':id', component: AddLogManagerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLogManagerRoutingModule { }
