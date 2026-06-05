import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ShopPackageInfo {
  currentBalance: number;
  expireDay: number;
  trialPeriod: number;
  shopType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopPackageService {
  private shopPackageInfoSubject = new BehaviorSubject<ShopPackageInfo>({
    currentBalance: 0,
    expireDay: 0,
    trialPeriod: 0,
    shopType: 'free'
  });

  shopPackageInfo$ = this.shopPackageInfoSubject.asObservable();

  constructor() {}

  setShopPackageInfo(info: ShopPackageInfo) {
    this.shopPackageInfoSubject.next(info);
  }

  getShopPackageInfo(): Observable<ShopPackageInfo> {
    return this.shopPackageInfo$;
  }

  checkExpiration() {
    const currentInfo = this.shopPackageInfoSubject.value;
    return currentInfo.expireDay < 0;
  }
} 