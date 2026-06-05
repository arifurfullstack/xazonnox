import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatManageRoutingModule } from './chat-manage-routing.module';
import { ChatManageComponent } from './chat-manage.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ChatManageComponent
  ],
  imports: [
    CommonModule,
    ChatManageRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class ChatManageModule { }
