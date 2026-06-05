import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VendorLoginDeviceComponent} from "./vendor-login-device.component";

const routes: Routes = [{
  path: '',
  component: VendorLoginDeviceComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorLoginDeviceRoutingModule { }
