// import { Injectable } from '@angular/core';
// import { StorageService } from './storage.service';
// import {DATABASE_KEY} from "../../core/utils/global-variable";
// @Injectable({
//   providedIn: 'root'
// })
// export class CountryService {
//   private country: string = 'Bangladesh';
//
//   constructor(private storageService: StorageService) {
//     this.loadCountryName();
//   }
//
//   private loadCountryName(): void {
//     const storedCurrency = this.storageService.getDataFromLocalStorage(DATABASE_KEY.currency);
//     this.country = storedCurrency?.name ?? 'Bangladesh';
//   }
//
//   public getCountryName(): string {
//     return this.country;
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private shopCountrySubject = new BehaviorSubject<any>({});

  shopCountry$ = this.shopCountrySubject.asObservable();

  constructor() {}

  setShopCountryInfo(info: any) {

    this.shopCountrySubject.next(info);
  }

  getShopCountryInfo(): Observable<any> {
    return this.shopCountry$;
  }

}
