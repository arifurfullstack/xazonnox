import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllVendorComponent} from './all-vendor.component';

const routes: Routes = [
  {path: '', component: AllVendorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllVendorRoutingModule {
}
