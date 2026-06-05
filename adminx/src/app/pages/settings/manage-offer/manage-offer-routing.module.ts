import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageOfferComponent} from "./manage-offer.component";

const routes: Routes = [
  {path: '', component: ManageOfferComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageOfferRoutingModule { }
