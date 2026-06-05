import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';

import { FilterData } from "../../interfaces/gallery/filter-data";
import {SkinType} from "../../interfaces/common/skin-type.interface";

const API_BRAND = environment.apiBaseLink + '/api/skin-type/';


@Injectable({
  providedIn: 'root'
})
export class SkinTypeService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addSkinType
   * insertManySkinType
   * getAllSkinTypes
   * getSkinTypeById
   * updateSkinTypeById
   * updateMultipleSkinTypeById
   * deleteSkinTypeById
   * deleteMultipleSkinTypeById
   */

  addSkinType(data: SkinType) {
    return this.httpClient.post<ResponsePayload>
    (API_BRAND + 'add', data);
  }


  getAllSkinTypes(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: SkinType[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop', filterData, {params});
  }

  getSkinTypeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SkinType, message: string, success: boolean }>(API_BRAND + 'get-by-id/' + id, {params});
  }

  updateSkinTypeById(id: string, data: SkinType) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  updateMultipleSkinTypeById(ids: string[], data: SkinType) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BRAND + 'update-multiple', mData);
  }

  deleteSkinTypeById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleSkinTypeById(ids: string[], checkUsage?: boolean) {
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
