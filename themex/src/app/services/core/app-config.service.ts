import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { SettingService } from '../common/setting.service';
import { GtmService } from './gtm.service';
import { PixelService } from './pixel.service';
import { ScriptLoaderService } from './script-loader.service';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private config: any;
  private readonly CONFIG_KEY = 'themeConfig'; // LocalStorage key
  private _currency: any;

  private configSubject = new BehaviorSubject<any>(null);
  config$ = this.configSubject.asObservable(); // Expose as Observable

  constructor(
    private http: HttpClient,
    private pixel: PixelService,
    private gtmService: GtmService,
    private scriptLoaderService: ScriptLoaderService,
    private settingService: SettingService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  get currency(): any {
    return this._currency;
  }

  set currency(currency: any) {
    this._currency = currency;
  }

  /**
   * loadConfig()
   * checkForUpdates()
   * getSettingData()
   */
  async loadConfig(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Check if it's running in a browser
      const storedConfig = localStorage.getItem(this.CONFIG_KEY);
      if (storedConfig) {
        this.config = JSON.parse(storedConfig);
        this.configSubject.next(this.config);
        // console.log("✅ Loaded theme from LocalStorage:", this.config);
      }
    }

    // নতুন ডাটা চেক করতে API কল করবে
    await this.checkForUpdates();
  }

  private async checkForUpdates(): Promise<void> {
    try {
      const newConfig = await firstValueFrom(
        this.http.get(`/shop-settings.json?v=${new Date().getTime()}`)
      );

      if (
        !this.config ||
        JSON.stringify(this.config) !== JSON.stringify(newConfig)
      ) {
        // console.log("🔄 New data found! Updating LocalStorage...");
        this.config = newConfig;
        this.configSubject.next(newConfig); // 🔥 Emit new config data

        if (isPlatformBrowser(this.platformId)) {
          // ✅ Only update LocalStorage if in browser
          localStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
          // location.reload(); // নতুন থিম লোড হবে
        }
      } else {
      }

      // Merge remote settings (blog, productSetting, themeColors, etc.) using active shop id
      const shopId = (this.config as any)?.shop;
      if (shopId) {
        try {
          // Fetch remote settings including theme customization
          const remote = await firstValueFrom(
            this.settingService.getSetting('blog productSetting themeColors themeViewSettings searchHints orderLanguage pageViewSettings', shopId)
          );
          if (remote?.success && remote?.data) {
            const remoteData = remote.data as any;

            // Merge remote data into existing config
            this.config = {
              ...(this.config || {}),
              productSetting: {
                ...((this.config as any)?.productSetting || {}),
                ...(remoteData.productSetting || {}),
              },
              blog: remoteData.blog ?? (this.config as any)?.blog,
              // Merge theme customization settings
              themeColors: remoteData.themeColors ?? (this.config as any)?.themeColors,
              themeViewSettings: remoteData.themeViewSettings ?? (this.config as any)?.themeViewSettings,
              pageViewSettings: remoteData.pageViewSettings ?? (this.config as any)?.pageViewSettings,
              searchHints: remoteData.searchHints ?? (this.config as any)?.searchHints,
              orderLanguage: remoteData.orderLanguage ?? (this.config as any)?.orderLanguage,
            };

            this.configSubject.next(this.config);
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem(
                this.CONFIG_KEY,
                JSON.stringify(this.config)
              );
            }
          }
        } catch (e) {
          // Swallow remote setting merge failure; continue with local config
          console.warn('Failed to merge remote settings', e);
        }
      }

      // Setup Pixel & Tag Manager
      const analytics = this.getSettingData('analytics');
      const currency = this.getSettingData('currency');

      if (analytics?.facebookPixelId) {
        this.gtmService.facebookPixelId = analytics?.facebookPixelId;
        this.pixel.init(analytics?.facebookPixelId);
      }

      if (analytics?.tagManagerId) {
        this.gtmService.tagManagerId = analytics?.tagManagerId;
        this.scriptLoaderService.loadGtmScript(analytics?.tagManagerId);
        this.scriptLoaderService.loadGtmNoScript(analytics?.tagManagerId);
      }

      if (analytics?.tagManagerId && analytics?.IsManageFbPixelByTagManager) {
        this.gtmService.isManageFbPixelByTagManager =
          analytics?.IsManageFbPixelByTagManager;
      }

      // Currency
      if (currency) {
        this.currency = this.currency;
      }
    } catch (error) {
      console.error('⚠️ Error fetching config:', error);
    }
  }

  getSettingData(field: string): any {
    return field ? this.config?.[field] : this.config;
  }
}
