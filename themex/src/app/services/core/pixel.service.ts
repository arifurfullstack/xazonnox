import {inject, Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {HttpClient} from '@angular/common/http';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    PIXEL_ID: string;
  }
}

const API_URL = environment.apiBaseLink + '/api/gtag';

@Injectable({providedIn: 'root'})
export class PixelService {

  private initialized = false;
  private currentId: string | null = null;
  private readonly http = inject(HttpClient);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
  }


  init(pixelId: string | null) {
    if (!this.isBrowser || !pixelId) return;
    if (this.initialized && this.currentId === pixelId) return;

    this.ensureFbqLoaded();

    try {
      const w: any = window;

      // ⛔ stop automatic PageView + SPA auto tracking
      // must be BEFORE init()
      w.fbq?.('set', 'autoConfig', false, pixelId);
      w.fbq && (w.fbq.disablePushState = true);

      // normal init (no auto PageView now)
      w.fbq?.('init', pixelId);

      w.fbq?.fbq('set', 'allowAutomaticEvents', false);

      this.initialized = true;
      this.currentId = pixelId;
    } catch {}
  }


  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private ensureFbqLoaded() {
    if (!this.isBrowser) return;
    if ((window as any).fbq) return; // already loaded

    (function (f: any, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Node) {
      if (f.fbq) return;
      n = function (this: any) {
        // @ts-ignore
        n.callMethod ? n.callMethod.apply(n, arguments) : (n.queue = n.queue || []).push(arguments);
      };
      f._fbq = f.fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, this.document, 'script', ''); // v arg unused in snippet
  }


  // ----- cookie utils -----
  private getCookie(name: string): any {
    if (!this.isBrowser) return;
    const value = `; ${this.document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift();
    return;
  }

  private setCookie(name: string, value: string, days: number): void {
    if (!this.isBrowser) return;
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    this.document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  }

  private getParam(name: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return new URL(this.document.defaultView!.location.href).searchParams.get(name);
    } catch {
      return null;
    }
  }

  private ensureFbp(): string {
    let fbp = this.getCookie('_fbp');
    if (!fbp) {
      const ts = Date.now();
      const rand = Math.floor(Math.random() * 1e10);
      fbp = `fb.1.${ts}.${rand}`;
      this.setCookie('_fbp', fbp, 90);
    }
    return fbp!;
  }

  private ensureFbc(): string | null {
    const fbclid = this.getParam('fbclid');
    if (!fbclid) {
      const existing = this.getCookie('_fbc');
      return existing || null;
    }
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    this.setCookie('_fbc', fbc, 90);
    return fbc;
  }

  private makeEventId(): string {
    return 'pv_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
  }

  /**
   * Fires the SAME PageView event to:
   * 1) Browser Pixel (fbq), with eventID
   * 2) Your backend /track/pageview with fbp/fbc + event_id
   */
  sendPageView(fullUrl?: string){
    console.log('>>> sendPageView');
    if (!this.isBrowser) return;

    const fbp = this.ensureFbp();
    const fbc = this.ensureFbc();
    const eventId = this.makeEventId();



    // const data: any = {
    //   url: fullUrl || this.document.defaultView?.location.href,
    //   fbp,
    //   fbc,
    //   event_id: eventId
    // }

    // 3️⃣ Prepare custom_data
    const page_url = location.href;
    const page_title = document.title;
    const referrer = document.referrer || 'N/A';

    const custom_data = {
      page_url,
      page_title,
      referrer,
    };

    // 4️⃣ Server-side data for Conversions API
    const pageViewData: any = {
      event_name: 'PageView',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: page_url,
      // url: fullUrl || this.document.defaultView?.location.href,
      // fbp,
      // fbc,
      // custom_data,
    };

    window.fbq?.('track', 'PageView', {}, {eventID: eventId});

    this.http.post<ResponsePayload>(`${API_URL}/track-theme-page-view`, pageViewData)
      .subscribe(res => {
        console.log('>>> sendPageView', res);
      })


  }

}
