import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageWebsitesComponent} from './manage-websites.component';

const routes: Routes = [
  {path: '', component: ManageWebsitesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageWebsitesRoutingModule {
}
