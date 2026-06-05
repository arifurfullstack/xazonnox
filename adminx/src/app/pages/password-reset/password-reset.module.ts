import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordResetRoutingModule } from './password-reset-routing.module';
import { PasswordResetComponent } from './password-reset.component';
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {OnlyNumberDirective} from "../../shared/directives/number-only.directive";
import {OtpInputComponent} from "../../shared/components/otp-input/otp-input.component";
import {ImageSliderComponent} from "../../shared/components/image-slider/image-slider.component";


@NgModule({
  declarations: [
    PasswordResetComponent
  ],
    imports: [
        CommonModule,
        PasswordResetRoutingModule,
        MatButtonModule,
        ReactiveFormsModule,
        OnlyNumberDirective,
        OtpInputComponent,
        ImageSliderComponent
    ]
})
export class PasswordResetModule { }
