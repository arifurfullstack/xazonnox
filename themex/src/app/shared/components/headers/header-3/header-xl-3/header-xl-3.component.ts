import {
  CommonModule,
  isPlatformBrowser,
  NgOptimizedImage,
} from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from '../../../../../interfaces/common/cart.interface';
import { Category } from '../../../../../interfaces/common/category.interface';
import { User } from '../../../../../interfaces/common/user.interface';
import { Wishlist } from '../../../../../interfaces/common/wishlist.interface';
import { CategoryService } from '../../../../../services/common/category.service';
import { ProductService } from '../../../../../services/common/product.service';
import { UserDataService } from '../../../../../services/common/user-data.service';
import { UserService } from '../../../../../services/common/user.service';
import { ReloadService } from '../../../../../services/core/reload.service';
import { UtilsService } from '../../../../../services/core/utils.service';
import { ImgCtrlPipe } from '../../../../pipes/img-ctrl.pipe';
import { PricePipe } from '../../../../pipes/price.pipe';
import { HeaderCart1Component } from '../../header-1/header-xl-1/header-cart-1/header-cart-1.component';
import { Search1Component } from '../../header-1/header-xl-1/search-1/search-1.component';

@Component({
  selector: 'app-header-xl-3',
  imports: [
    RouterLink,
    CommonModule,
    Search1Component,
    HeaderCart1Component,
    NgOptimizedImage,
    ImgCtrlPipe,
    RouterLinkActive,
  ],
  providers: [PricePipe],
  standalone: true,
  templateUrl: './header-xl-3.component.html',
  styleUrl: './header-xl-3.component.scss',
})
export class HeaderXl3Component implements OnInit, OnDestroy {
  // Decorator
  @Input() carts: Cart[] = [];
  @Input() cartAnimate: boolean = false;
  @Input() wishlistAnimate: boolean = false;
  @Input() wishlists: Wishlist[];
  @Input() shopInfo: any;

  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';
  isVisible: boolean;
  user: User;
  isHydrated = false;
  compareListV2: string[] | any[] = [];
  category: Category[] = null;

  // Scroll
  isHeaderFixed: boolean = false;
  isHeaderTopHidden: boolean = false;

  // Inject
  private readonly router = inject(Router);
  private readonly utilsService = inject(UtilsService);
  protected readonly userService = inject(UserService);
  private readonly userDataService = inject(UserDataService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly reloadService = inject(ReloadService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const subscription1 = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.utilsService.removeUrlQuery(
          event.urlAfterRedirects
        );
        this.isVisible = this.utilsService.routeBaseVisibility(currentUrl);
      }
    });
    this.subscriptions?.push(subscription1);

    const subscription2 = this.reloadService.refreshCompareList$.subscribe(
      () => {
        this.getCompareList();
      }
    );
    this.subscriptions?.push(subscription2);

    if (this.userService.isUser) {
      this.getLoggedInUserData();
    }

    // Base data
    this.checkHydrated();
    this.getCompareList();
    this.getAllCategory();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isHeaderTopHidden = window.scrollY > 250;
  }

  /**
   * HTTP REQUEST CONTROLL
   * getAllCategory()
   */
  private getAllCategory() {
    const subscription = this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.category = res.data;
      },
      error: () => {},
    });
    this.subscriptions?.push(subscription);
  }

  /**
   * Hydrated Manage
   * checkHydrated()
   */

  protected checkHydrated() {
    if (isPlatformBrowser(this.platformId)) {
      this.isHydrated = true;
    }
  }

  /**
   * HTTP REQ
   * getLoggedInUserData()
   */

  getCompareList() {
    this.compareListV2 = this.productService.getCompareList();
  }

  private getLoggedInUserData() {
    const subscription = this.userDataService
      .getLoggedInUserData('name username')
      .subscribe({
        next: (res) => {
          this.user = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.subscriptions?.push(subscription);
  }

  navigateToHome(): void {
    // Check if already on the home page
    if (this.router.url === '/') {
      // Reload the home page
      window.location.reload();
    } else {
      // Navigate to the home page
      this.router.navigate(['/']).then();
    }
  }

  /**
   * HTTP REQUEST
   * getSocialLink()
   */

  getSocialLink(type: string): string {
    switch (type) {
      case 'facebook':
        return (
          this.shopInfo?.socialLinks.find((f) => f.type === 0)?.value ?? null
        );

      case 'youtube':
        return (
          this.shopInfo?.socialLinks.find((f) => f.type === 1)?.value ?? null
        );

      case 'twitter':
        return (
          this.shopInfo?.socialLinks.find((f) => f.type === 2)?.value ?? null
        );

      case 'instagram':
        return (
          this.shopInfo?.socialLinks.find((f) => f.type === 3)?.value ?? null
        );

      case 'linkedin':
        return (
          this.shopInfo?.socialLinks.find((f) => f.type === 4)?.value ?? null
        );

      case 'tiktok':
        return (
          this.shopInfo?.socialLinks.find((f) => f.type === 5)?.value ?? null
        );

      default:
        return null;
    }
  }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach((sub) => sub?.unsubscribe());
  }
}
