import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoogleConsoleComponent} from "./google-console.component";

const routes: Routes = [
  {path: '', component: GoogleConsoleComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleConsoleRoutingModule { }
