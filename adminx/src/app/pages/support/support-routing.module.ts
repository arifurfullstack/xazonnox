import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SupportComponent} from './support.component';
import {AddSupportComponent} from './add-support/add-support.component';

const routes: Routes = [
  {path: '', component: SupportComponent},
  {path: 'add-support', component: AddSupportComponent},
  {path: 'edit-support/:id', component: AddSupportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule {
}
