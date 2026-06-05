import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddSkinTypeComponent} from "./add-skin-type.component";

const routes: Routes = [
  { path: '', component: AddSkinTypeComponent },
  { path: ':id', component: AddSkinTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSkinTypeRoutingModule { }
