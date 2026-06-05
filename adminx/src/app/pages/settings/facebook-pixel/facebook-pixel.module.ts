import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FacebookPixelRoutingModule} from './facebook-pixel-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FacebookPixelComponent} from './facebook-pixel.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    FacebookPixelComponent
  ],
  imports: [
    CommonModule,
    FacebookPixelRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
  ]
})
export class FacebookPixelModule {
}
