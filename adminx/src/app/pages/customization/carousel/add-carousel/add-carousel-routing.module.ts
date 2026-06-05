import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddCarouselComponent} from "./add-carousel.component";

const routes: Routes = [
  { path: '', component: AddCarouselComponent },
  { path: ':id', component: AddCarouselComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCarouselRoutingModule { }
