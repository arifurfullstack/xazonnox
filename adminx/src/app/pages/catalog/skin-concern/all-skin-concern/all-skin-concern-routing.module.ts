import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBrandComponent} from "../../brand/all-brand/all-brand.component";
import {AllSkinConcernComponent} from "./all-skin-concern.component";

const routes: Routes = [
  { path: '', component: AllSkinConcernComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSkinConcernRoutingModule { }
