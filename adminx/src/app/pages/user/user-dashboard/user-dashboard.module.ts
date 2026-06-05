import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { RecentOrderComponent } from './recent-order/recent-order.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {
  GalleryImageViewerComponent
} from "../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import { UserCartAndWishlistComponent } from './user-cart-and-wishlist/user-cart-and-wishlist.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    DashboardCardComponent,
    RecentOrderComponent,
    UserCartAndWishlistComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    GalleryImageViewerComponent
  ]
})
export class UserDashboardModule { }
