import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import {PageLoaderComponent} from '../../../shared/components/page-loader/page-loader.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe} from "../../../shared/pipes/currency.pipe";


@NgModule({
  declarations: [
    InvoiceComponent
  ],
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        PageLoaderComponent,
        NgxPaginationModule,
        MatIconModule,
        MatButtonModule,
        CurrencyPipe
    ]
})
export class InvoiceModule { }
