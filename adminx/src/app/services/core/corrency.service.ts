import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import {DATABASE_KEY} from "../../core/utils/global-variable";
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private symbol: string = '৳';

  constructor(private storageService: StorageService) {
    this.loadCurrencySymbol();
  }

  private loadCurrencySymbol(): void {
    const storedCurrency = this.storageService.getDataFromLocalStorage(DATABASE_KEY.currency);
    this.symbol = storedCurrency?.symbol ?? '৳';
  }

  public getCurrencySymbol(): string {
    return this.symbol;
  }
}
