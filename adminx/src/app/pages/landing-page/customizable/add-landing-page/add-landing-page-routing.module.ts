import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddLandingPageComponent} from "./add-landing-page.component";

const routes: Routes = [
  { path: '', component: AddLandingPageComponent },
  { path: ':id', component: AddLandingPageComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLandingPageRoutingModule { }
