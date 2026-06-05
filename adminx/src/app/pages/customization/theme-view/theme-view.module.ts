import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeViewRoutingModule } from './theme-view-routing.module';
import { ThemeViewComponent } from './theme-view.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {
    GalleryImageViewerComponent
} from "../../../shared/components/gallery-image-viewer/gallery-image-viewer.component";


@NgModule({
  declarations: [
    ThemeViewComponent
  ],
    imports: [
        CommonModule,
        ThemeViewRoutingModule,
        MatCheckboxModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        GalleryImageViewerComponent
    ]
})
export class ThemeViewModule { }
