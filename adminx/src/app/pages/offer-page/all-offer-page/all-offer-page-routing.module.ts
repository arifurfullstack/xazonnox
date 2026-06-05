import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddOfferPageComponent} from "../add-offer-page/add-offer-page.component";
import {AllOfferPageComponent} from "./all-offer-page.component";

const routes: Routes = [
  { path: '', component: AllOfferPageComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllOfferPageRoutingModule { }
