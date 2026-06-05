import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { User } from '../../interfaces/common/user.interface';
import {DATABASE_KEY} from "../../core/utils/global-variable";
import {StorageService} from "../core/storage.service";

const API_URL = environment.apiBaseLink + '/api/user/';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userLocalSavedData: any;


  private readonly storageService = inject(StorageService);

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * userSignup()
   * getLoggedInUserData()
   * getAllUsers()
   * getUserById()
   * updateUserById()
   * updateMultipleUserById()
   * deleteUserById()
   * deleteMultipleUserById()
   * updateLoggedInUserInfo()
   * changeLoggedInUserPassword()
   */

  userSignup(data: User) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'user-signup-vendor', data);
  }

  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: User }>(API_URL + 'logged-in-user-data', { params });
  }

  getAllUser(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_URL + 'get-all-by-shop', filterData, { params });
  }

  // getAllUser(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_URL + 'get-all', filterData, { params });
  // }

  getUserById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User, message: string, success: boolean }>(API_URL + 'get-by/' + id, { params });
  }

  getUserByPhoneNo(id: string, select?: string, userId?: boolean) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User, message: string, success: boolean }>(API_URL + (userId ? 'get-by/' : 'get-by-phone/') + id, { params });
  }

  updateUserById(id: string, data: User) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-vendor-user/' + id, data);
  }

  updateMultipleUserById(ids: string[], data: User) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }

  deleteUserById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-data/' + id, { params });
  }

  deleteMultipleUserById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', { ids: ids }, { params });
  }

  deleteMultipleUsersById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-user', { ids: ids }, { params });
  }


  updateLoggedInUserInfo(data: User) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-logged-in-user', data);
  }

  changeLoggedInUserPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_URL + 'change-logged-in-user-password', data);
  }


  getUserDataByPhoneNo(data: User) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'get-users-data-by-phone-no', data);
  }

  /**
   * Get User Data
   */


  getUserDataFromLocal() {
    this.userLocalSavedData = this.storageService.getDataFromEncryptLocal(DATABASE_KEY.userInfoForPixel);
  }

  getUserLocalDataByField(field: string) {
    if (this.userLocalSavedData) {
      if (this.userLocalSavedData[field]) {
        return this.userLocalSavedData[field];
      }
    } else {
      return null;
    }
  }
}
