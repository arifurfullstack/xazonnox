import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatManageComponent} from "./chat-manage.component";

const routes: Routes = [
  {path: '', component: ChatManageComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatManageRoutingModule { }
