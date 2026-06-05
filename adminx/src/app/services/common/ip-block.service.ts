import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";
import {IpBlock} from "../../interfaces/common/ip-block.interface";

const API_IP_BLOCK = environment.apiBaseLink + '/api/IpBlock/';


@Injectable({
  providedIn: 'root'
})
export class IpBlockService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addIpBlock
   * insertManyIpBlock
   * getAllIpBlocks
   * getIpBlockById
   * updateIpBlockById
   * updateMultipleIpBlockById
   * deleteIpBlockById
   * deleteMultipleIpBlockById
   */

  addIpBlock(data: IpBlock) {
    return this.httpClient.post<ResponsePayload>
    (API_IP_BLOCK + 'add', data);
  }


  getAllIpBlock(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: IpBlock[], count: number, success: boolean }>(API_IP_BLOCK + 'get-all-by-shop', filterData, {params});
  }

  getIpBlockById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: IpBlock, message: string, success: boolean }>(API_IP_BLOCK + 'get-by-id/' + id, {params});
  }

  updateIpBlockById(id: string, data: IpBlock) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_IP_BLOCK + 'update/' + id, data);
  }

  updateMultipleIpBlockById(ids: string[], data: IpBlock) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_IP_BLOCK + 'update-multiple', mData);
  }

  deleteIpBlockById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_IP_BLOCK + 'delete/' + id, {params});
  }

  deleteMultipleIpBlockById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_IP_BLOCK + 'delete-multiple', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_IP_BLOCK + 'delete-all-trash-by-shop', {params});
  }

}
