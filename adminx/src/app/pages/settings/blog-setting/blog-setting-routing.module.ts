import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlogSettingComponent} from "./blog-setting.component";

const routes: Routes = [
  {path: '', component: BlogSettingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogSettingRoutingModule { }
