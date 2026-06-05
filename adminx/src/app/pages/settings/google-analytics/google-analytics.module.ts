import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GoogleAnalyticsRoutingModule} from './google-analytics-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {GoogleAnalyticsComponent} from './google-analytics.component';


@NgModule({
  declarations: [
    GoogleAnalyticsComponent
  ],
  imports: [
    CommonModule,
    GoogleAnalyticsRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ]
})
export class GoogleAnalyticsModule {
}
