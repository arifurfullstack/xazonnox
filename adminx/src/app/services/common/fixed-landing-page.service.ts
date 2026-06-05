import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FixedLandingPage } from '../../interfaces/common/fixed-landing-page.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";
import {LandingPage} from "../../interfaces/common/landing-page.interface";

const API_BRAND = environment.apiBaseLink + '/api/fixed-landing-page/';


@Injectable({
  providedIn: 'root'
})
export class FixedLandingPageService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addFixedLandingPage
   * insertManyFixedLandingPage
   * getAllFixedLandingPages
   * getFixedLandingPageById
   * updateFixedLandingPageById
   * updateMultipleFixedLandingPageById
   * deleteFixedLandingPageById
   * deleteMultipleFixedLandingPageById
   */

  addFixedLandingPage(data: FixedLandingPage) {
    return this.httpClient.post<ResponsePayload>
    (API_BRAND + 'add', data);
  }


  getAllFixedLandingPages(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: FixedLandingPage[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop', filterData, {params});
  }

  getFixedLandingPageById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: FixedLandingPage, message: string, success: boolean }>(API_BRAND + 'get-by-id/' + id, {params});
  }

  updateFixedLandingPageById(id: string, data: FixedLandingPage) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  updateMultipleFixedLandingPageById(ids: string[], data: FixedLandingPage) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BRAND + 'update-multiple', mData);
  }

  deleteFixedLandingPageById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleFixedLandingPageById(ids: string[], checkUsage?: boolean) {
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

  cloneSingleProduct(id: string) {
    return this.httpClient.post<ResponsePayload>(
      `${API_BRAND}clone`,
      { id }
    );
  }

  addLandingPageFromGadget() {
    return this.httpClient.post<ResponsePayload>
    (API_BRAND + 'add-from-gatet', {});
  }

  /**
   * getLandingPage()
   */

  getLandingBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: LandingPage,
      message: string,
      success: boolean
    }>(API_BRAND + 'get-by-slug/' + slug, {params});
  }
}
