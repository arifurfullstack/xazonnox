import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddVendorComponent} from './add-vendor.component';

const routes: Routes = [
  {path: '', component: AddVendorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddVendorRoutingModule {
}
