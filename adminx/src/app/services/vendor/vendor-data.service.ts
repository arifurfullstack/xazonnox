import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from "../../interfaces/gallery/filter-data";
import {Vendor} from "../../interfaces/common/vendor.interface";

const API_URL = environment.apiBaseLink + '/api/vendor/';


@Injectable({
  providedIn: 'root'
})
export class VendorDataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getLoggedInVendorData
   * updateLoggedInVendorInfo
   * changeLoggedInVendorPassword
   * getAllVendors
   * getVendorById
   * updateVendorById
   * updateMultipleVendorById
   * deleteVendorById
   * deleteMultipleVendorById
   */

  addVendor(data: any) {
    return this.httpClient.post<ResponsePayload>
    (API_URL + 'add', data);
  }

  getLoggedInVendorData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: Vendor }>(API_URL + 'logged-in-vendor-data', {params});
  }

  updateLoggedInVendorInfo(data: Vendor) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-vendor', data);
  }

  changeLoggedInVendorPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-vendor-password', data);
  }

  checkUserWithPhoneNoForResetPassword(data: {username: string}) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'check-vendor-with-phone-no-for-reset-password', data);
  }

  getAllVendors(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }

    return this.httpClient.post<{ data: Vendor[], count: number, success: boolean }>(API_URL + 'all-vendors-by-shop', filterData, {params});
  }

  getVendorById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Vendor, message: string, success: boolean }>(API_URL + 'get-by/' + id, {params});
  }

  updateVendorById(id: string, data: Vendor) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-vendor/' + id, data);
  }

  resetUserPassword(data: {phoneNo: string, countryCode: string}) {
    return this.httpClient.put<{ message: string; success: boolean }>(API_URL + 'reset-vendor-password', data);
  }

  updateMultipleVendorById(ids: string[], data: Vendor) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple-vendor-by-id', mData);
  }

  deleteVendorById(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-vendor/' + id);
  }

  deleteMultipleVendorById(ids: string[]) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-vendor-by-id', {ids: ids});
  }

  getSessions() {
    return this.httpClient.get<ResponsePayload>(API_URL + 'get-all-vendor-session');

  }

  logoutDevice(deviceId: string) {
    return this.httpClient.post<any>(API_URL + 'vendor-session-logout', { deviceId });
  }


}
