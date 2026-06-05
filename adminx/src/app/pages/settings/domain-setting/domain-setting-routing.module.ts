import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DomainSettingComponent} from "./domain-setting.component";

const routes: Routes = [
  {path: '', component: DomainSettingComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomainSettingRoutingModule { }
