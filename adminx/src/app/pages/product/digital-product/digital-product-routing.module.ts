import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DigitalProductComponent} from "./digital-product.component";

const routes: Routes = [
  { path: '', component: DigitalProductComponent },
  { path: ':id', component: DigitalProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalProductRoutingModule { }
