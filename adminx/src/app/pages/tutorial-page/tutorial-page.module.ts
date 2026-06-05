import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TutorialPageRoutingModule} from './tutorial-page-routing.module';
import {TutorialPageComponent} from './tutorial-page.component';
import {FormsModule} from "@angular/forms";
import {InfiniteScrollDirective} from "../../shared/directives/infinite-scroll.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    TutorialPageComponent
  ],
  imports: [
    CommonModule,
    TutorialPageRoutingModule,
    FormsModule,
    InfiniteScrollDirective,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class TutorialPageModule {
}
