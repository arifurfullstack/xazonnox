import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges {
  @Input() totalData: number = 1;
  @Input() dataPerPage: number = 1;
  @Input() currentPage: number = 1;  // Ensure two-way binding
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 1;

  ngOnChanges(changes: SimpleChanges) {
    // Use bracket notation to access properties safely
    if (changes['totalData'] || changes['dataPerPage']) {
      this.calculateTotalPages();
    }

    if (changes['currentPage']) {
      this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
    }
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalData / this.dataPerPage) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitPageChange();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPageChange();
    }
  }

  onPageInputChange() {
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
    this.emitPageChange();
  }

  private emitPageChange() {
    this.pageChange.emit(this.currentPage);
  }
}
