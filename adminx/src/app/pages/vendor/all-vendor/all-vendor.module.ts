import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AllVendorRoutingModule} from './all-vendor-routing.module';
import {AllVendorComponent} from './all-vendor.component';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LimitTextPipe} from '../../../shared/pipes/limit-text.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {NoContentComponent} from '../../../shared/components/no-content/no-content.component';
import {
  GalleryImageViewerComponent
} from '../../../shared/components/gallery-image-viewer/gallery-image-viewer.component';
import {PageLoaderComponent} from '../../../shared/components/page-loader/page-loader.component';

@NgModule({
  declarations: [
    AllVendorComponent,
  ],
  imports: [
    CommonModule,
    AllVendorRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    PaginationComponent,
    MatCheckboxModule,
    MatTooltipModule,
    LimitTextPipe,
    MatMenuModule,
    NoContentComponent,
    GalleryImageViewerComponent,
    PageLoaderComponent,
  ]
})
export class AllVendorModule {
}
