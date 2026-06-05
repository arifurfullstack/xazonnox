import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllCouponComponent} from "./all-coupon.component";

const routes: Routes = [
  {path:'',component:AllCouponComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllCouponRoutingModule { }
