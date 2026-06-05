import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddSkinConcernComponent} from "./add-skin-concern.component";

const routes: Routes = [
  { path: '', component: AddSkinConcernComponent },
  { path: ':id', component: AddSkinConcernComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSkinConcernRoutingModule { }
