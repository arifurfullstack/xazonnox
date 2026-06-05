import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../../../interfaces/common/category.interface';
import { ChildCategory } from '../../../interfaces/common/child-category.interface';
import { SubCategory } from '../../../interfaces/common/sub-category.interface';
import { FilterData } from '../../../interfaces/core/filter-data';
import { CategoryService } from '../../../services/common/category.service';
import { ChildCategoryService } from '../../../services/common/child-category.service';
import { SubCategoryService } from '../../../services/common/sub-category.service';

@Component({
  standalone: true,
  selector: 'app-products-category-view',
  templateUrl: './products-category-view.component.html',
  styleUrl: './products-category-view.component.scss',
})
export class ProductsCategoryViewComponent implements OnInit, OnDestroy {
  // Input/Output for communication with parent component
  @Input() selectedCategories: string[] = [];
  @Input() selectedSubCategories: string[] = [];
  @Input() selectedChildCategories: string[] = [];
  @Input() isLoading: boolean = false;

  @Output() categorySelectionChange = new EventEmitter<string[]>();
  @Output() subCategorySelectionChange = new EventEmitter<string[]>();
  @Output() childCategorySelectionChange = new EventEmitter<string[]>();
  @Output() clearAllFiltersEvent = new EventEmitter<void>();

  // Data arrays
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  childCategories: ChildCategory[] = [];

  // Services
  private readonly categoryService = inject(CategoryService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly childCategoryService = inject(ChildCategoryService);
  private readonly router = inject(Router);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.getAllCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((sub) => sub?.unsubscribe());
  }

  /**
   * Load all categories with priority-based sorting
   */
  private getAllCategories() {
    const filterData: FilterData = {
      pagination: null,
      filter: { status: 'publish' },
      select: { name: 1, images: 1, slug: 1, priority: 1 },
      sort: { priority: -1 },
    };

    const subscription = this.categoryService
      .getAllCategories(filterData, null)
      .subscribe({
        next: (res) => {
          this.categories = res.data;
          if (this.selectedCategories.length) {
            const fCat = this.categories.find(
              (f) => f.slug === this.selectedCategories[0]
            );
            if (fCat?._id) {
              this.getSubCategoriesByCategoryId(fCat._id);
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions.push(subscription);
  }

  /**
   * Load subcategories by category ID
   */
  private getSubCategoriesByCategoryId(categoryId: string) {
    const select = 'name slug images';
    const subscription = this.subCategoryService
      .getSubCategoriesByCategoryId(categoryId, select)
      .subscribe({
        next: (res) => {
          this.subCategories = res.data;
          this.loadChildCategoriesForSelectedSubCategory();
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions.push(subscription);
  }

  /**
   * Load child categories for the currently selected sub-category
   */
  private loadChildCategoriesForSelectedSubCategory() {
    if (
      this.selectedSubCategories.length > 0 &&
      this.subCategories.length > 0
    ) {
      const selectedSubCategorySlug = this.selectedSubCategories[0];
      const subCategory = this.subCategories.find(
        (sub) => sub.slug === selectedSubCategorySlug
      );

      if (subCategory && subCategory._id) {
        this.getChildCategoriesBySubCategoryId(subCategory._id);
      }
    }
  }

  /**
   * Get child categories by sub-category ID
   */
  private getChildCategoriesBySubCategoryId(subCategoryId: string) {
    const select = 'name slug images';
    const subscription = this.childCategoryService
      .getChildCategoriesBySubCategoryId(subCategoryId, select)
      .subscribe({
        next: (res) => {
          this.childCategories = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions.push(subscription);
  }

  /**
   * Toggle category selection
   */
  toggleCategorySelection(categorySlug: string) {
    // Clear existing selections
    this.selectedSubCategories = [];
    this.selectedChildCategories = [];
    this.subCategories = [];
    this.childCategories = [];

    // Toggle category selection
    if (this.selectedCategories.includes(categorySlug)) {
      // If already selected, deselect it
      this.selectedCategories = [];
    } else {
      // Select this category
      this.selectedCategories = [categorySlug];

      // Find the category and load its subcategories
      const category = this.categories.find((cat) => cat.slug === categorySlug);
      if (category && category._id) {
        this.getSubCategoriesByCategoryId(category._id);
      }
    }

    // Emit changes to parent
    this.categorySelectionChange.emit(this.selectedCategories);
    this.subCategorySelectionChange.emit(this.selectedSubCategories);
    this.childCategorySelectionChange.emit(this.selectedChildCategories);

    // Update URL
    this.updateUrlParams();
  }

  /**
   * Toggle subcategory selection
   */
  toggleSubCategorySelection(subCategorySlug: string) {
    // Clear existing child category selections
    this.selectedChildCategories = [];
    this.childCategories = [];

    // Toggle subcategory selection
    if (this.selectedSubCategories.includes(subCategorySlug)) {
      // If already selected, deselect it
      this.selectedSubCategories = [];
    } else {
      // Select this subcategory
      this.selectedSubCategories = [subCategorySlug];

      // Find the subcategory and load its child categories
      const subCategory = this.subCategories.find(
        (sub) => sub.slug === subCategorySlug
      );
      if (subCategory && subCategory._id) {
        this.getChildCategoriesBySubCategoryId(subCategory._id);
      }
    }

    // Emit changes to parent
    this.subCategorySelectionChange.emit(this.selectedSubCategories);
    this.childCategorySelectionChange.emit(this.selectedChildCategories);

    // Update URL
    this.updateUrlParams();
  }

  /**
   * Toggle child category selection
   */
  toggleChildCategorySelection(childCategorySlug: string) {
    // Toggle child category selection
    if (this.selectedChildCategories.includes(childCategorySlug)) {
      // If already selected, deselect it
      this.selectedChildCategories = [];
    } else {
      // Select this child category
      this.selectedChildCategories = [childCategorySlug];
    }

    // Emit changes to parent
    this.childCategorySelectionChange.emit(this.selectedChildCategories);

    // Update URL
    this.updateUrlParams();
  }

  /**
   * Clear all filters
   */
  clearAllFilters() {
    this.selectedCategories = [];
    this.selectedSubCategories = [];
    this.selectedChildCategories = [];
    this.subCategories = [];
    this.childCategories = [];

    // Emit changes to parent
    this.categorySelectionChange.emit(this.selectedCategories);
    this.subCategorySelectionChange.emit(this.selectedSubCategories);
    this.childCategorySelectionChange.emit(this.selectedChildCategories);
    this.clearAllFiltersEvent.emit();

    // Update URL
    this.updateUrlParams();
  }

  /**
   * Update URL parameters
   */
  private updateUrlParams() {
    this.router.navigate(['/products'], {
      queryParams: {
        categories:
          this.selectedCategories.length > 0 ? this.selectedCategories : null,
        subCategories:
          this.selectedSubCategories.length > 0
            ? this.selectedSubCategories
            : null,
        childCategories:
          this.selectedChildCategories.length > 0
            ? this.selectedChildCategories
            : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
