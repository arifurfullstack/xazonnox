import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllSettingsComponent} from './all-settings.component';

const routes: Routes = [
  {path: '', component: AllSettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSettingsRoutingModule {
}
