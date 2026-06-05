import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddCouponComponent} from "./add-coupon.component";

const routes: Routes = [
  {path:'',component:AddCouponComponent},
  {path:':id',component:AddCouponComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCouponRoutingModule { }
