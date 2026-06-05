import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FacebookPixelComponent} from './facebook-pixel.component';

const routes: Routes = [
  {path: '', component: FacebookPixelComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookPixelRoutingModule {
}
