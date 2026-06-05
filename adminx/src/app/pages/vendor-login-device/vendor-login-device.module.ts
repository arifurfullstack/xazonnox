import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorLoginDeviceRoutingModule } from './vendor-login-device-routing.module';
import { VendorLoginDeviceComponent } from './vendor-login-device.component';


@NgModule({
  declarations: [
    VendorLoginDeviceComponent
  ],
  imports: [
    CommonModule,
    VendorLoginDeviceRoutingModule
  ]
})
export class VendorLoginDeviceModule { }
