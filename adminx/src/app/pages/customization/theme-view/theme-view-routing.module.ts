import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ThemeViewComponent} from './theme-view.component';

const routes: Routes = [
  {
    path: '',
    component: ThemeViewComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeViewRoutingModule { }
