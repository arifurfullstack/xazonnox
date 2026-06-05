import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {map, Observable, switchMap, takeWhile, timer} from "rxjs";
import {Shop} from "../../interfaces/common/shop.interface";
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';


const API_URL = environment.apiBaseLink + '/api/shop/';


@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addShop
   * insertManyShop
   * getAllShops
   * getShopById
   * updateShopById
   * updateMultipleShopById
   * deleteShopById
   * deleteMultipleShopById
   */

  getAllShop(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Shop[],
      count: number,
      success: boolean
    }>(API_URL + 'get-all/', filterData, {params});
  }

  getShopById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Shop, message: string, success: boolean }>(API_URL + 'get-by/' + id, {params});
  }

  updateShopById(id: string, data: Shop) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-shop-vendor-by-id/' + id, data);
  }


  checkShopUpdateStatusByInterval(interval: number): Observable<any> {
    return new Observable(observer => {
      timer(0, interval).pipe(
        switchMap(() => this.httpClient.get<{
          data: { updateStatus: string },
          success: boolean
        }>(API_URL + 'check-build-status-by-shop')),
        takeWhile(response => response?.data?.updateStatus !== 'updated', true),
        map(response => {
          if (response?.data?.updateStatus === 'updated') {
            return response;
          }
          return response;
        })
      ).subscribe({
        next: data => observer.next(data),
        error: error => observer.error(error),
        complete: () => observer.complete()
      })
    });
  }

  changeDomainByVendor(data: any) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'change-domain-by-vendor', data);
  }


}
