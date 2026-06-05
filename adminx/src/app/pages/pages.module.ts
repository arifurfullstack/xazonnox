import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {RouteProgressComponent} from '../shared/components/route-progress/route-progress.component';
import {ThemesComponent} from './customization/themes/themes.component';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../material/material.module";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {GalleryImagePickerComponent} from "../shared/components/gallery-image-picker/gallery-image-picker.component";
import {HtmlEditorComponent} from "../shared/components/html-editor/html-editor.component";
import {DaysRemainingPipe} from "../shared/pipes/days-remaining.pipe";
import {GalleryImageViewerComponent} from "../shared/components/gallery-image-viewer/gallery-image-viewer.component";
import {LimitTextPipe} from "../shared/pipes/limit-text.pipe";
import {NoContentComponent} from "../shared/components/no-content/no-content.component";
import {PageLoaderComponent} from "../shared/components/page-loader/page-loader.component";
import {PaginationComponent} from "../shared/components/pagination/pagination.component";


@NgModule({
  declarations: [
    PagesComponent,
    ThemesComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HeaderComponent,
    RouteProgressComponent,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MaterialModule,
    DigitOnlyModule,
    GalleryImagePickerComponent,
    HtmlEditorComponent,
    DaysRemainingPipe,
    GalleryImageViewerComponent,
    LimitTextPipe,
    NoContentComponent,
    PageLoaderComponent,
    PaginationComponent,
  ]
})
export class PagesModule {
}
