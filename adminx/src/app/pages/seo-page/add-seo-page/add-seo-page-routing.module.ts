import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddSeoPageComponent} from "./add-seo-page.component";

const routes: Routes = [
  {path: '', component: AddSeoPageComponent},
  { path: ':id', component: AddSeoPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSeoPageRoutingModule { }
