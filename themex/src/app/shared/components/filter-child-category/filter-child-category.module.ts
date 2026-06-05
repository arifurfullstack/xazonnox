import { NgModule } from '@angular/core';
import { FilterChildCategoryComponent } from './filter-child-category.component';
import {RouterLink} from "@angular/router";

@NgModule({
    declarations: [
        FilterChildCategoryComponent
    ],
    exports: [
        FilterChildCategoryComponent
    ],
  imports: [
    RouterLink
  ]
})
export class FilterChildCategoryModule { }
