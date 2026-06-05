import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeliveryChargeComponent} from './delivery-charge.component';

const routes: Routes = [
  {path: '', component: DeliveryChargeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryChargeRoutingModule {
}
