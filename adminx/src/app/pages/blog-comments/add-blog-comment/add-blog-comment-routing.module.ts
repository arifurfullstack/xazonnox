import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBlogComponent} from "../../blog/all-blog/all-blog.component";
import {AddBlogComponent} from "../../blog/add-blog/add-blog.component";
import {AddBlogCommentComponent} from "./add-blog-comment.component";

const routes: Routes = [
  {path:'',component:AddBlogCommentComponent},
  {path:':id',component:AddBlogCommentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBlogCommentRoutingModule { }
