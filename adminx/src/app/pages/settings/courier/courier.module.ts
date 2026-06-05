import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CourierRoutingModule} from './courier-routing.module';
import {CourierComponent} from './courier.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    CourierComponent
  ],
    imports: [
        CommonModule,
        CourierRoutingModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        DigitOnlyModule,
    ]
})
export class CourierModule {
}
