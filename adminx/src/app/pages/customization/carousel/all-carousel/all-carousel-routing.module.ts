import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllCarouselComponent} from "./all-carousel.component";

const routes: Routes = [
  { path: '', component: AllCarouselComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllCarouselRoutingModule { }
