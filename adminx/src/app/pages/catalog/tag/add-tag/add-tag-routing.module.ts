import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddTagComponent} from "./add-tag.component";

const routes: Routes = [
  { path: '', component: AddTagComponent },
  { path: ':id', component: AddTagComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTagRoutingModule { }
