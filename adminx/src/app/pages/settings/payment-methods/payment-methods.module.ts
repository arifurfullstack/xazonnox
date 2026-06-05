import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaymentMethodsRoutingModule} from './payment-methods-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {PaymentMethodsComponent} from './payment-methods.component';
import {HtmlEditorComponent} from '../../../shared/components/html-editor/html-editor.component';


@NgModule({
  declarations: [
    PaymentMethodsComponent
  ],
  imports: [
    CommonModule,
    PaymentMethodsRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    HtmlEditorComponent,
  ]
})
export class PaymentMethodsModule {
}
