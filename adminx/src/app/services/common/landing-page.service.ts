import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { LandingPage } from '../../interfaces/common/landing-page.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";

const API_BRAND = environment.apiBaseLink + '/api/landing-page/';


@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addLandingPage
   * insertManyLandingPage
   * getAllLandingPages
   * getLandingPageById
   * updateLandingPageById
   * updateMultipleLandingPageById
   * deleteLandingPageById
   * deleteMultipleLandingPageById
   */

  addLandingPage(data: LandingPage) {
    return this.httpClient.post<ResponsePayload>
    (API_BRAND + 'add', data);
  }


  getAllLandingPages(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: LandingPage[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop', filterData, {params});
  }

  getLandingPageById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: LandingPage, message: string, success: boolean }>(API_BRAND + 'get-by-id/' + id, {params});
  }

  updateLandingPageById(id: string, data: LandingPage) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  updateMultipleLandingPageById(ids: string[], data: LandingPage) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BRAND + 'update-multiple', mData);
  }

  deleteLandingPageById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleLandingPageById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  deleteMultiplePageById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple-page', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-all-trash-by-shop', {params});
  }
}
