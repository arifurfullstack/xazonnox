import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBrandComponent} from "../../brand/all-brand/all-brand.component";
import {AllSkinTypeComponent} from "./all-skin-type.component";

const routes: Routes = [
  { path: '', component: AllSkinTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSkinTypeRoutingModule { }
