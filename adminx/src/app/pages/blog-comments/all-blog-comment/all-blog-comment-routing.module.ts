import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllBlogCommentComponent} from "./all-blog-comment.component";

const routes: Routes = [
  {path:'',component:AllBlogCommentComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBlogCommentRoutingModule { }
