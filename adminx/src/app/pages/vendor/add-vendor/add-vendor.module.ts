import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AddVendorRoutingModule} from './add-vendor-routing.module';
import {AddVendorComponent} from './add-vendor.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {MatSelectModule} from '@angular/material/select';
import {NoWhitespaceModule} from '../../../shared/directives/no-whitespace/no-whitespace.module';

@NgModule({
  declarations: [
    AddVendorComponent
  ],
  imports: [
    CommonModule,
    AddVendorRoutingModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    NoWhitespaceModule,
    MatButtonModule,
    MatIconModule,
    DigitOnlyModule,
    MatSelectModule,
  ]
})
export class AddVendorModule {
}
