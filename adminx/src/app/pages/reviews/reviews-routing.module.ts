import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReviewsComponent} from './reviews.component';
import {ReplyReviewComponent} from './reply-review/reply-review.component';
import {AddReviewsComponent} from "./add-reviews/add-reviews.component";

const routes: Routes = [
  {path: '', component: ReviewsComponent},
  {path: 'reply-review/:id', component: ReplyReviewComponent},
  {path: 'add-review', component: AddReviewsComponent},
  {path: 'edit-review/:id', component: AddReviewsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule {
}
