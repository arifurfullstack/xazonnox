import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SocialLoginRoutingModule} from './social-login-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {SocialLoginComponent} from './social-login.component';


@NgModule({
  declarations: [
    SocialLoginComponent
  ],
  imports: [
    CommonModule,
    SocialLoginRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ]
})
export class SocialLoginModule {
}
