import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageWebsitesRoutingModule} from './manage-websites-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {ManageWebsitesComponent} from './manage-websites.component';


@NgModule({
  declarations: [
    ManageWebsitesComponent
  ],
  imports: [
    CommonModule,
    ManageWebsitesRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ]
})
export class ManageWebsitesModule {
}
