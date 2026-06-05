import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Popup} from '../../interfaces/common/popup.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';

const API_POPUP = environment.apiBaseLink + '/api/popup/';


@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPopup
   * insertManyPopup
   * getAllPopups
   * getPopupById
   * updatePopupById
   * updateMultiplePopupById
   * deletePopupById
   * deleteMultiplePopupById
   */

  addPopup(data: Popup) {
    return this.httpClient.post<ResponsePayload>
    (API_POPUP + 'add', data);
  }


  getAllPopup(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Popup[], count: number, success: boolean }>(API_POPUP + 'get-all-by-shop', filterData, {params});
  }

  getPopupById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Popup, message: string, success: boolean }>(API_POPUP + 'get-by-id/' + id, {params});
  }

  updatePopupById(id: string, data: Popup) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_POPUP + 'update/' + id, data);
  }

  updateMultiplePopupById(ids: string[], data: Popup) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_POPUP + 'update-multiple', mData);
  }

  deletePopupById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_POPUP + 'delete/' + id, {params});
  }

  deleteMultiplePopupById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_POPUP + 'delete-multiple', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_POPUP + 'delete-all-trash-by-shop', {params});
  }

}
