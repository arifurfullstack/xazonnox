import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DomainInformationComponent} from "./domain-information.component";

const routes: Routes = [
  {path: '', component: DomainInformationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomainInformationRoutingModule { }
