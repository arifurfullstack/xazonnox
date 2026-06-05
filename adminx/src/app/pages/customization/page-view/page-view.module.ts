import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageViewRoutingModule } from './page-view-routing.module';
import { PageViewComponent } from './page-view.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    PageViewComponent
  ],
  imports: [
    CommonModule,
    PageViewRoutingModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class PageViewModule { }
