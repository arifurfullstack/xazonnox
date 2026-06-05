import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FacebookCatalogRoutingModule} from './facebook-catalog-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FacebookCatalogComponent} from './facebook-catalog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    FacebookCatalogComponent
  ],
  imports: [
    CommonModule,
    FacebookCatalogRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
  ]
})
export class FacebookCatalogModule {
}
