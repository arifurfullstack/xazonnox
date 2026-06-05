import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllIpBlockComponent} from "./all-ip-block.component";

const routes: Routes = [
  {path: '', component: AllIpBlockComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllIpBlockRoutingModule { }
