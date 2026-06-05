import {inject, Pipe, PipeTransform} from '@angular/core';
import {StorageService} from "../../services/core/storage.service";
import {DATABASE_KEY} from "../../core/utils/global-variable";


@Pipe({
  name: 'shopCurrency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {

  private readonly storageService = inject(StorageService);
  private currencySymbol: string | null = null;

  constructor() {
    this.loadCurrencySymbol();
  }


  private loadCurrencySymbol(): void {
    const storedCurrency = this.storageService.getDataFromLocalStorage(DATABASE_KEY.currency);
    this.currencySymbol = storedCurrency?.symbol ?? '৳';
  }

  transform(value?: any): string {
    if (!value && value !== 0) {
      return this.currencySymbol;
    }

    if (typeof value !== 'number') {
      try {
        value = Number(value);
        if (isNaN(value)) throw new Error('Invalid number');
      } catch {
        return `${this.currencySymbol} 0`;
      }
    }

    //   return this.currencySymbol === 'AED'
    //     ? `${this.currencySymbol} ${value.toFixed(2)}`
    //     : `${this.currencySymbol}${value}`;

    return this.currencySymbol === 'AED'
      ? `${this.currencySymbol} ${value.toFixed(2)}`
      : `${this.currencySymbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }


}
