import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddCustomDomainComponent} from "./add-custom-domain.component";

const routes: Routes = [
  {path: '', component: AddCustomDomainComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCustomDomainRoutingModule { }
