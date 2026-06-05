import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductSettingComponent} from "./product-setting.component";

const routes: Routes = [
  {path: '', component: ProductSettingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSettingRoutingModule { }
