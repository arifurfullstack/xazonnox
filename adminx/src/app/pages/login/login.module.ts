import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {OnlyNumberDirective} from "../../shared/directives/number-only.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ImageSliderComponent} from "../../shared/components/image-slider/image-slider.component";


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    NgOptimizedImage,
    OnlyNumberDirective,
    FaIconComponent,
    ImageSliderComponent,
  ]
})
export class LoginModule { }
