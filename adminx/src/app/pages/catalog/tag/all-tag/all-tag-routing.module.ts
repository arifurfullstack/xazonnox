import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllTagComponent} from "./all-tag.component";


const routes: Routes = [
  { path: '', component: AllTagComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTagRoutingModule { }
