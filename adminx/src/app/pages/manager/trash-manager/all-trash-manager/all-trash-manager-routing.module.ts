import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTrashManagerComponent} from "./all-trash-manager.component";

const routes: Routes = [
  {path: '', component: AllTrashManagerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTrashManagerRoutingModule { }
