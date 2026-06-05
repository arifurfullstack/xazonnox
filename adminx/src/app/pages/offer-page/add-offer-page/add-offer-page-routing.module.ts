import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddOfferPageComponent} from "./add-offer-page.component";

const routes: Routes = [
  { path: '', component: AddOfferPageComponent },
  { path: ':id', component: AddOfferPageComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddOfferPageRoutingModule { }
