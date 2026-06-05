import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderTimelineComponent } from './order-timeline.component';
import {MatIconModule} from "@angular/material/icon";



@NgModule({
    declarations: [
        OrderTimelineComponent
    ],
    exports: [
        OrderTimelineComponent
    ],
    imports: [
        CommonModule,
        MatIconModule
    ]
})
export class OrderTimelineModule { }
