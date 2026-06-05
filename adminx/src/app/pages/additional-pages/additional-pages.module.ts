import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdditionalPagesRoutingModule } from './additional-pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageListComponent } from './page-list/page-list.component';
import { ViewPageComponent } from './page-list/view-page/view-page.component';
import {MatListModule} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {HtmlEditorComponent} from "../../shared/components/html-editor/html-editor.component";



@NgModule({
  declarations: [
    PageListComponent,
    ViewPageComponent
  ],
  imports: [
    CommonModule,
    AdditionalPagesRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    // MaterialModule,
    // FlexLayoutModule,
    // QuillModule,
    // PipesModule,

    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,

    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HtmlEditorComponent,
  ]
})
export class AdditionalPagesModule { }
