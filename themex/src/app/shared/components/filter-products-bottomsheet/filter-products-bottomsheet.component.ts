import {
  Component,
  EventEmitter,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../../../interfaces/common/category.interface';
import { ChildCategory } from '../../../interfaces/common/child-category.interface';
import { ThemeViewSetting } from '../../../interfaces/common/setting.interface';
import { CategoryService } from '../../../services/common/category.service';
import { ChildCategoryService } from '../../../services/common/child-category.service';
import { SubCategoryService } from '../../../services/common/sub-category.service';
import { AppConfigService } from '../../../services/core/app-config.service';
import { ProductDetailsCategoryLoaderComponent } from '../../loader/product-details-category-loader/product-details-category-loader.component';
import { FilterBrandModule } from '../filter-brand/filter-brand.module';
import { FilterChildCategoryModule } from '../filter-child-category/filter-child-category.module';
import { FilterSubCategoryModule } from '../filter-sub-category/filter-sub-category.module';
import { ProductsCategoryComponent } from '../products-category-filter/products-category.component';

@Component({
  selector: 'app-filter-products-bottomsheet',
  templateUrl: './filter-products-bottomsheet.component.html',
  styleUrl: './filter-products-bottomsheet.component.scss',
  standalone: true,
  imports: [
    FilterBrandModule,
    FilterSubCategoryModule,
    ProductDetailsCategoryLoaderComponent,
    ProductsCategoryComponent,
    FilterChildCategoryModule,
  ],
})
export class FilterProductsBottomsheetComponent implements OnInit, OnDestroy {
  @Output() dataEmitter = new EventEmitter<any>();

  // Theme Views
  filterBottomsheetCategoryViews: string;

  categories: Category[] = [];
  brands: any[] = [];
  subCategories: any[] = [];
  childCategories: ChildCategory[] = []; // Child categories for filtering
  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];
  selectedChildCategories: string[] = []; // Selected child categories for filtering
  selectedBrands: string[] = [];
  selectedTags: string[] = [];

  // Loading
  isLoading = false;

  // Complex Filter
  categoryFilterArray: any[] = [];
  subCategoryFilterArray: any[] = [];
  childCategoryFilterArray: any[] = []; // Child category filter array
  brandFilterArray: any[] = [];
  tagFilterArray: any[] = [];

  // FilterData
  filter: any = null;

  // Inject
  private readonly categoryService = inject(CategoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly childCategoryService = inject(ChildCategoryService);
  private readonly router = inject(Router);
  private readonly appConfigService = inject(AppConfigService);

  // Subscription
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<FilterProductsBottomsheetComponent>
  ) {
    this.categories = data.category;
    this.brands = data.brands;
    this.subCategories = data.subCategories;
    this.childCategories = data.childCategories || []; // Add child categories support
  }

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    const subscription = this.activatedRoute.queryParams.subscribe((qParam) => {
      // Filter Query
      this.filterQueryFromQueryParam(qParam);
    });

    this.subscriptions?.push(subscription);

    // Theme Settings
    this.getSettingData();
  }

  /**
   * Get Theme Settings Data
   */
  private getSettingData() {
    const themeViewSettings: ThemeViewSetting[] =
      this.appConfigService.getSettingData('themeViewSettings');
    if (themeViewSettings) {
      // Get filter bottomsheet category views setting
      const filterBottomsheetCategorySetting = themeViewSettings.find(
        (f) => f.type === 'filterBottomsheetCategoryViews'
      );
      if (filterBottomsheetCategorySetting) {
        this.filterBottomsheetCategoryViews =
          filterBottomsheetCategorySetting.value.join();
      } else {
        // Default to original category view if setting doesn't exist
        this.filterBottomsheetCategoryViews =
          'Filter Bottomsheet Category View 1';
      }
    }
  }

  private filterQueryFromQueryParam(qParam: any) {
    if (qParam && !qParam['subCategories'] && qParam && qParam['categories']) {
      if (typeof qParam['categories'] === 'string') {
        this.selectedCategories = [qParam['categories']];
      } else {
        this.selectedCategories = qParam['categories'];
      }
      this.categoryFilterArray = this.selectedCategories.map((m) => {
        return { 'category.slug': m };
      });
      if (this.selectedCategories) {
        if (this.selectedCategories.length) {
          const fCat = this.categories.find(
            (f) => f.slug === this.selectedCategories[0]
          );
          this.getSubCategoriesByCategoryId(fCat._id);
        }
      }
    }

    if (qParam && qParam['subCategories']) {
      if (typeof qParam['subCategories'] === 'string') {
        this.selectedSubCategories = [qParam['subCategories']];
      } else {
        this.selectedSubCategories = qParam['subCategories'];
      }
      this.subCategoryFilterArray = this.selectedSubCategories.map((m) => {
        return { 'subCategory.slug': m };
      });
      if (this.selectedSubCategories) {
        if (this.selectedSubCategories.length) {
          const fSubCat = this.subCategories.find(
            (f) => f.slug === this.selectedSubCategories[0]
          );
          if (fSubCat) {
            this.getChildCategoriesBySubCategoryId(fSubCat._id);
          }
        }
      }
    }

    if (qParam && qParam['childCategories']) {
      if (typeof qParam['childCategories'] === 'string') {
        this.selectedChildCategories = [qParam['childCategories']];
      } else {
        this.selectedChildCategories = qParam['childCategories'];
      }
      this.childCategoryFilterArray = this.selectedChildCategories.map((m) => {
        return { 'childCategory.slug': m };
      });
    }

    if (qParam && qParam['brand']) {
      if (typeof qParam['brand'] === 'string') {
        this.selectedBrands = [qParam['brand']];
      } else {
        this.selectedBrands = qParam['brand'];
      }
      this.brandFilterArray = this.selectedBrands.map((m) => {
        return { 'brand.slug': m };
      });
    }

    if (qParam && qParam['tag']) {
      if (typeof qParam['tag'] === 'string') {
        this.selectedTags = [qParam['tag']];
      } else {
        this.selectedTags = qParam['tag'];
      }
      this.tagFilterArray = this.selectedTags.map((m) => {
        return { 'tags.name': m };
      });
    }
  }

  /**
   * RESET FILTER
   * resetCategoryFilter()
   * resetSubCategoryFilter()
   * resetBrandFilter()
   */

  resetCategoryFilter() {
    this.selectedCategories = [];
    this.categoryFilterArray = [];

    // Also clear subcategories and child categories when category is reset
    this.selectedSubCategories = [];
    this.subCategoryFilterArray = [];
    this.subCategories = [];

    this.selectedChildCategories = [];
    this.childCategoryFilterArray = [];
    this.childCategories = [];

    this.dataEmitter.emit({
      resetCategory: true,
    });
    this.router.navigate(['/products'], {
      queryParams: { categories: [], subCategories: [], childCategories: [] },
      queryParamsHandling: 'merge',
    });
  }

  resetSubCategoryFilter() {
    this.selectedSubCategories = [];
    this.subCategoryFilterArray = [];

    // Also clear child categories when subcategory is reset
    this.selectedChildCategories = [];
    this.childCategoryFilterArray = [];
    this.childCategories = [];

    this.dataEmitter.emit({
      resetSubCategory: true,
    });
    this.router.navigate(['/products'], {
      queryParams: { subCategories: [], childCategories: [] },
      queryParamsHandling: 'merge',
    });
  }

  resetChildCategoryFilter() {
    this.selectedChildCategories = [];
    this.childCategoryFilterArray = [];
    this.dataEmitter.emit({
      resetChildCategory: true,
    });
    this.router.navigate(['/products'], {
      queryParams: { childCategories: [] },
      queryParamsHandling: 'merge',
    });
  }

  resetBrandFilter() {
    this.selectedBrands = [];
    this.brandFilterArray = [];
    this.dataEmitter.emit({
      resetBrand: true,
    });
    this.router.navigate(['/products'], {
      queryParams: { brand: [] },
      queryParamsHandling: 'merge',
    });
  }

  resetTagFilter() {
    this.selectedTags = [];
    this.tagFilterArray = [];
    this.dataEmitter.emit({
      resetTag: true,
    });
    this.router.navigate(['/products'], {
      queryParams: { tag: [] },
      queryParamsHandling: 'merge',
    });
  }

  private getSubCategoriesByCategoryId(categoryId: string) {
    const select = 'name slug images';
    const subscription = this.subCategoryService
      .getSubCategoriesByCategoryId(categoryId, select)
      .subscribe({
        next: (res) => {
          this.subCategories = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions.push(subscription);
  }

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

  selectedFilter() {
    // When category changes, clear subcategories and child categories first
    if (this.selectedCategories.length > 0) {
      // Clear existing child categories
      this.childCategories = [];
      this.selectedChildCategories = [];
      this.childCategoryFilterArray = [];

      const selectedCategorySlug = this.selectedCategories[0];
      const category = this.categories.find(
        (cat) => cat.slug === selectedCategorySlug
      );

      if (category && category._id) {
        this.getSubCategoriesByCategoryId(category._id);
      }
    } else {
      // If no category selected, clear subcategories and child categories
      this.subCategories = [];
      this.selectedSubCategories = [];
      this.subCategoryFilterArray = [];
      this.childCategories = [];
      this.selectedChildCategories = [];
      this.childCategoryFilterArray = [];
    }

    // When subcategory changes, clear child categories first, then load if subcategory selected
    if (this.selectedSubCategories.length > 0) {
      // Clear existing child categories first
      this.childCategories = [];
      this.selectedChildCategories = [];
      this.childCategoryFilterArray = [];

      const selectedSubCategorySlug = this.selectedSubCategories[0];
      const subCategory = this.subCategories.find(
        (sub) => sub.slug === selectedSubCategorySlug
      );

      if (subCategory && subCategory._id) {
        this.getChildCategoriesBySubCategoryId(subCategory._id);
      }
    } else if (this.selectedCategories.length > 0) {
      // If no subcategory selected but category is selected, clear child categories
      this.childCategories = [];
      this.selectedChildCategories = [];
      this.childCategoryFilterArray = [];
    }
  }

  /**
   * Manual toggle methods for nested category functionality (exact replica of ProductsCategoryViewComponent logic)
   */
  toggleCategorySelection(categorySlug: string) {
    // Toggle category selection
    if (this.selectedCategories.includes(categorySlug)) {
      this.selectedCategories = this.selectedCategories.filter(
        (slug) => slug !== categorySlug
      );
      // Clear subcategories and child categories when deselecting category
      this.selectedSubCategories = [];
      this.selectedChildCategories = [];
      this.subCategories = [];
      this.childCategories = [];
    } else {
      this.selectedCategories = [categorySlug]; // Single selection
      // Clear subcategories and child categories when selecting new category
      this.selectedSubCategories = [];
      this.selectedChildCategories = [];
      this.childCategories = [];

      // Load subcategories for selected category
      const category = this.categories.find((cat) => cat.slug === categorySlug);
      if (category && category._id) {
        this.getSubCategoriesByCategoryId(category._id);
      }
    }

    // Update filter arrays
    this.categoryFilterArray = this.selectedCategories.map((slug) => ({
      'category.slug': slug,
    }));
    this.subCategoryFilterArray = [];
    this.childCategoryFilterArray = [];

    // Emit filter data to parent (DO NOT dismiss bottomsheet)
    this.dataEmitter.emit({
      categoryFilter: this.categoryFilterArray,
      subCategoryFilter: this.subCategoryFilterArray,
      childCategoryFilter: this.childCategoryFilterArray,
      brandFilter: this.brandFilterArray,
    });

    // Update URL (this should NOT close bottomsheet)
    this.router.navigate(['/products'], {
      queryParams: {
        categories: this.selectedCategories,
        subCategories: [],
        childCategories: [],
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleSubCategorySelection(subCategorySlug: string) {
    // Toggle subcategory selection
    if (this.selectedSubCategories.includes(subCategorySlug)) {
      this.selectedSubCategories = this.selectedSubCategories.filter(
        (slug) => slug !== subCategorySlug
      );
      // Clear child categories when deselecting subcategory
      this.selectedChildCategories = [];
      this.childCategories = [];
    } else {
      this.selectedSubCategories = [subCategorySlug]; // Single selection
      // Clear child categories when selecting new subcategory
      this.selectedChildCategories = [];

      // Load child categories for selected subcategory
      const subCategory = this.subCategories.find(
        (sub) => sub.slug === subCategorySlug
      );
      if (subCategory && subCategory._id) {
        this.getChildCategoriesBySubCategoryId(subCategory._id);
      }
    }

    // Update filter arrays
    this.subCategoryFilterArray = this.selectedSubCategories.map((slug) => ({
      'subCategory.slug': slug,
    }));
    this.childCategoryFilterArray = [];

    // Emit filter data to parent (DO NOT dismiss bottomsheet)
    this.dataEmitter.emit({
      categoryFilter: this.categoryFilterArray,
      subCategoryFilter: this.subCategoryFilterArray,
      childCategoryFilter: this.childCategoryFilterArray,
      brandFilter: this.brandFilterArray,
    });

    // Update URL (this should NOT close bottomsheet)
    this.router.navigate(['/products'], {
      queryParams: {
        subCategories: this.selectedSubCategories,
        childCategories: [],
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleChildCategorySelection(childCategorySlug: string) {
    // Toggle child category selection
    if (this.selectedChildCategories.includes(childCategorySlug)) {
      this.selectedChildCategories = this.selectedChildCategories.filter(
        (slug) => slug !== childCategorySlug
      );
    } else {
      this.selectedChildCategories = [childCategorySlug]; // Single selection
    }

    // Update filter arrays
    this.childCategoryFilterArray = this.selectedChildCategories.map(
      (slug) => ({ 'childCategory.slug': slug })
    );

    // Emit filter data to parent (DO NOT dismiss bottomsheet)
    this.dataEmitter.emit({
      categoryFilter: this.categoryFilterArray,
      subCategoryFilter: this.subCategoryFilterArray,
      childCategoryFilter: this.childCategoryFilterArray,
      brandFilter: this.brandFilterArray,
    });

    // Update URL (this should NOT close bottomsheet)
    this.router.navigate(['/products'], {
      queryParams: { childCategories: this.selectedChildCategories },
      queryParamsHandling: 'merge',
    });
  }

  clearAllFilters() {
    // Reset all filter arrays and selections
    this.categoryFilterArray = [];
    this.subCategoryFilterArray = [];
    this.childCategoryFilterArray = [];
    this.selectedCategories = [];
    this.selectedSubCategories = [];
    this.selectedChildCategories = [];
    this.subCategories = [];
    this.childCategories = [];

    // Emit filter data to parent (DO NOT dismiss bottomsheet)
    this.dataEmitter.emit({
      categoryFilter: [],
      subCategoryFilter: [],
      childCategoryFilter: [],
      brandFilter: this.brandFilterArray,
    });

    // Update URL to clear all filters (this should NOT close bottomsheet)
    this.router.navigate(['/products'], {
      queryParams: { categories: [], subCategories: [], childCategories: [] },
      queryParamsHandling: 'merge',
    });
  }

  onHideCategory() {
    this.bottomSheetRef.dismiss();
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach((sub) => sub?.unsubscribe());
  }
}
