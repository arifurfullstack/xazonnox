import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {registerLocaleData} from '@angular/common';
import localeBn from '@angular/common/locales/bn';
import {VendorService} from './services/vendor/vendor.service';
import {Router} from '@angular/router';
import {ShopPackageService} from './services/core/shop-package.service';
import {ShopInformationService} from './services/common/shop-information.service';
import {environment} from '../environments/environment';
import {Subscription} from 'rxjs';
import {CountryService} from "./services/core/country.service";
import {SettingService} from "./services/common/setting.service";
import {Setting} from "./interfaces/common/setting.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {

  // Select
  private readonly select: any = {
    name: 1,
    url: 1,
    note: 1,
    version: 1,
    createdAt: 1,
  }
  private readonly paymentBaseLink = environment.paymentBaseLink;
  private subscription: Subscription;
  protected loginSubscription: Subscription;
  // Store Data
  private setting: Setting;
  // Subscriptions
  private subscriptions: Subscription[] = [];

  private isReleaseDialogOpen = false;
  private isShopInfoLoaded = false;

  // Inject
  private readonly shopPackageService = inject(ShopPackageService);
  private readonly shopInfoService = inject(ShopInformationService);
  private readonly vendorService = inject(VendorService);
  private readonly settingService = inject(SettingService);
  private readonly countryService = inject(CountryService);

  constructor(
    private meta: Meta,
    private router: Router,

  ) {
    // Block search engine indexing
    this.googleNoIndex();
    // this.getSetting();
    // Register Bangla locale data
    registerLocaleData(localeBn, 'bn');

    // Attempt auto-login for user
    this.vendorService.autoUserLoggedIn();

    // Subscribe to login status changes
    this.loginSubscription = this.vendorService.getUserStatusListener().subscribe(
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.handleUserLoggedIn('loginSubscription');
        }
      }
    );

    // If already logged in, initialize data
    if (this.vendorService.isUser) {
      this.handleUserLoggedIn('isUser');
    }

  }

  private handleUserLoggedIn(source: string): void {
    if (this.isShopInfoLoaded) {
      console.log(`ShopInfo already loaded. Skipping. (${source})`);
      return;
    }

    this.isShopInfoLoaded = true;

    this.getShopInfo();
    this.getSetting();
  }


  ngOnInit() {

  }


  /**
   * HTTP Req Handle
   * getSetting()
   */

  private getSetting() {
    const subscription = this.settingService.getSetting('currency country orderSetting -_id')
      .subscribe({
        next: (res) => {
          this.setting = res.data;
          if (this.setting.country) {
            this.countryService.setShopCountryInfo(this.setting);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions?.push(subscription);
  }

  /**
   * HTTP REQ HANDLE
   * getShopInfo()
   */

  private getShopInfo() {
    // console.log('getShopInfo called');
    this.shopInfoService.getShopInformation().subscribe({
      next: (response: any) => {
        if (!response) {
          console.warn('No shop information received from API');
          return;
        }

        const shopPackageInfo = {
          currentBalance: response.currentBalance ?? 0,
          expireDay: response.expireDay ?? 0,
          trialPeriod: response.fShopDomain?.trialPeriod ?? 0,
          shopType: response.shopType ?? 'free',
        };

        // console.log('Setting shop package info:', shopPackageInfo);
        this.shopPackageService.setShopPackageInfo(shopPackageInfo);
      },
      error: (err) => {
        console.error('Error fetching shop information:', err);
      }
    });
  }


  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({name: 'robots', content: 'noindex'});
    this.meta.updateTag({name: 'googlebot', content: 'noindex'});
  }


  ngOnDestroy() {
    // Clean up subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
