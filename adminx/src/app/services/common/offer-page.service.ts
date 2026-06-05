import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { OfferPage } from '../../interfaces/common/offer-page.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";

const API_BRAND = environment.apiBaseLink + '/api/offer-page/';


@Injectable({
  providedIn: 'root'
})
export class OfferPageService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOfferPage
   * insertManyOfferPage
   * getAllOfferPages
   * getOfferPageById
   * updateOfferPageById
   * updateMultipleOfferPageById
   * deleteOfferPageById
   * deleteMultipleOfferPageById
   */

  addOfferPage(data: OfferPage) {
    return this.httpClient.post<ResponsePayload>
    (API_BRAND + 'add', data);
  }


  getAllOfferPages(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: OfferPage[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop', filterData, {params});
  }

  getOfferPageById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OfferPage, message: string, success: boolean }>(API_BRAND + 'get-by-id/' + id, {params});
  }

  updateOfferPageById(id: string, data: OfferPage) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  updateMultipleOfferPageById(ids: string[], data: OfferPage) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BRAND + 'update-multiple', mData);
  }

  deleteOfferPageById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleOfferPageById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-all-trash-by-shop', {params});
  }
}
