import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-filter-child-category',
  templateUrl: './filter-child-category.component.html',
  styleUrl: './filter-child-category.component.scss'
})
export class FilterChildCategoryComponent implements OnChanges {
  @Input() data: any;
  @Input() activeFilters: string[] = [];
  activeData: string;
  @Output() resetFilters = new EventEmitter<void>();
  @Output() selectedFilters = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    // Set active data based on the first active filter
    if (this.activeFilters.length) {
      this.activeData = this.activeFilters[0];
    } else {
      this.activeData = null;
    }
  }

  /**
   * Handle reset filters event
   */
  onResetFilters() {
    this.resetFilters.emit();
  }

  /**
   * Handle selected filters event
   */
  onSelectedFilters() {
    this.selectedFilters.emit();
  }
}
