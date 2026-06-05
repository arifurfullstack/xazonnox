import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {FilterDropdownComponent} from '../../shared/components/filter-dropdown/filter-dropdown.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import {SafeHtmlCustomPipe} from "../../shared/pipes/safe-html.pipe";
import { ThemeOneComponent } from './theme-one/theme-one.component';
import {GalleryImagePickerComponent} from "../../shared/components/gallery-image-picker/gallery-image-picker.component";


@NgModule({
  declarations: [
    TestComponent,
    ThemeSelectorComponent,
    ThemeOneComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    FilterDropdownComponent,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    SafeHtmlCustomPipe,
    GalleryImagePickerComponent
  ]
})
export class TestModule { }
