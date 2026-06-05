import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";
import {SkinConcern} from "../../interfaces/common/skin-concern.interface";

const API_BRAND = environment.apiBaseLink + '/api/skin-concern/';


@Injectable({
  providedIn: 'root'
})
export class SkinConcernService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addSkinConcern
   * insertManySkinConcern
   * getAllSkinConcerns
   * getSkinConcernById
   * updateSkinConcernById
   * updateMultipleSkinConcernById
   * deleteSkinConcernById
   * deleteMultipleSkinConcernById
   */

  addSkinConcern(data: SkinConcern) {
    return this.httpClient.post<ResponsePayload>
    (API_BRAND + 'add', data);
  }


  getAllSkinConcerns(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: SkinConcern[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop', filterData, {params});
  }

  getSkinConcernById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SkinConcern, message: string, success: boolean }>(API_BRAND + 'get-by-id/' + id, {params});
  }

  updateSkinConcernById(id: string, data: SkinConcern) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  updateMultipleSkinConcernById(ids: string[], data: SkinConcern) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BRAND + 'update-multiple', mData);
  }

  deleteSkinConcernById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleSkinConcernById(ids: string[], checkUsage?: boolean) {
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
