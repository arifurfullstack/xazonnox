import {inject, Pipe, PipeTransform} from '@angular/core';
import {DATABASE_KEY} from "../../core/utils/global-variable";
import {StorageService} from "../../services/core/storage.service";


@Pipe({
  standalone: true,
  name: 'currencyCtr'
})
export class CurrencyCtrPipe implements PipeTransform {
  private readonly storageService = inject(StorageService);
  private currencySymbol: string | null = null;

  constructor() {
    this.loadCurrencySymbol();
  }

  private loadCurrencySymbol(): void {
    const storedCurrency = this.storageService.getDataFromLocalStorage(DATABASE_KEY.currency);
    this.currencySymbol = storedCurrency?.symbol ?? '৳';
  }

  transform(value: number, key?: 'code' | 'symbol' | 'name'): string {
    if (typeof value !== 'number') {
      return '';
    }

    // Default key is 'symbol' if no key is provided
    const defaultKey: 'code' | 'symbol' | 'name' = key || 'symbol';

    // Define default currency object
    const defaultCurrency = {
      code: 'BDT',
      name: 'Bangladesh',
      symbol: '৳'
    };

    // Use fetched currency or fallback to default currency
    const currencyData = this.currencySymbol && Object.keys(this.currencySymbol).length ? this.currencySymbol : defaultCurrency;

    // Format the number with the currency symbol
    return `${currencyData[defaultKey] || defaultCurrency[defaultKey]} ${value}`;
  }
}
