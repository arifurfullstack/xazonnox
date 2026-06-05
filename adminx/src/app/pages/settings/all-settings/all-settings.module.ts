import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AllSettingsRoutingModule} from './all-settings-routing.module';
import {AllSettingsComponent} from './all-settings.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AllSettingsComponent
  ],
  imports: [
    CommonModule,
    AllSettingsRoutingModule,
    MatButtonModule,
    MatIconModule,
    SafeHtmlCustomPipe,
    FormsModule,
  ]
})
export class AllSettingsModule {
}
