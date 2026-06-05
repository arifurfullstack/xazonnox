import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaymentMethodsComponent} from './payment-methods.component';

const routes: Routes = [
  {path: '', component: PaymentMethodsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodsRoutingModule {
}
