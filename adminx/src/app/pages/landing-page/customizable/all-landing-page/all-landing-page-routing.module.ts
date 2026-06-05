import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllLandingPageComponent} from "./all-landing-page.component";


const routes: Routes = [
  { path: '', component: AllLandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllLandingPageRoutingModule { }
