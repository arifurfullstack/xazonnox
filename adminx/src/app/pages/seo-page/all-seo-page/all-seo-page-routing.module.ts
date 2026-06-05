import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllSeoPageComponent} from "./all-seo-page.component";

const routes: Routes = [
  {path: '', component: AllSeoPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSeoPageRoutingModule { }
