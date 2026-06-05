import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddTrashManagerComponent} from "./add-trash-manager.component";

const routes: Routes = [
  {path: '', component: AddTrashManagerComponent},
  {path: ':id', component: AddTrashManagerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTrashManagerRoutingModule { }
