import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddPopupComponent} from "./add-popup.component";

const routes: Routes = [
  { path: '', component: AddPopupComponent },
  { path: ':id', component: AddPopupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPopupRoutingModule { }
