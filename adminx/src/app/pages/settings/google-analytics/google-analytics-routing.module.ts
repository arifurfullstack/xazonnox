import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoogleAnalyticsComponent} from './google-analytics.component';

const routes: Routes = [
  {path: '', component: GoogleAnalyticsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleAnalyticsRoutingModule {
}
