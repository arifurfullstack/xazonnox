import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllPopupComponent} from "./all-popup.component";

const routes: Routes = [
  { path: '', component: AllPopupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllPopupRoutingModule { }
