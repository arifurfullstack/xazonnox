import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderSettingComponent} from "./order-setting.component";

const routes: Routes = [
  {path: '', component: OrderSettingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderSettingRoutingModule { }
