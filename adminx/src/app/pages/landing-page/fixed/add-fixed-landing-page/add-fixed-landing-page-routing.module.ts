import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddFixedLandingPageComponent} from "./add-fixed-landing-page.component";

const routes: Routes = [
  { path: '', component: AddFixedLandingPageComponent },
  { path: ':id', component: AddFixedLandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AddFixedLandingPageRoutingModule { }
