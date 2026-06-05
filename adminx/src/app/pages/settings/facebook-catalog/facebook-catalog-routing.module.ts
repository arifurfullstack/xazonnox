import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FacebookCatalogComponent} from './facebook-catalog.component';

const routes: Routes = [
  {path: '', component: FacebookCatalogComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookCatalogRoutingModule {
}
