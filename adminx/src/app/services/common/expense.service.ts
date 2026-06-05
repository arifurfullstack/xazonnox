import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";
import {Expense} from "../../interfaces/common/expense.interface";

const API_EXPENSE = environment.apiBaseLink + '/api/expense/';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addCategory
   * insertManyCategory
   * getAllCategorys
   * getCategoryById
   * updateCategoryById
   * updateMultipleCategoryById
   * deleteCategoryById
   * deleteMultipleCategoryById
   */

  addCategory(data: Expense) {
    return this.httpClient.post<ResponsePayload>
    (API_EXPENSE + 'add', data);
  }


  getAllCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Expense[], count: number, success: boolean }>(API_EXPENSE + 'get-all-by-shop', filterData, {params});
  }

  getCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Expense, message: string, success: boolean }>(API_EXPENSE + 'get-by-id/' + id, {params});
  }

  updateCategoryById(id: string, data: Expense) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_EXPENSE + 'update/' + id, data);
  }

  updateMultipleCategoryById(ids: string[], data: Expense) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_EXPENSE + 'update-multiple', mData);
  }

  deleteCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_EXPENSE + 'delete/' + id, {params});
  }

  deleteMultipleCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_EXPENSE + 'delete-multiple', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_EXPENSE + 'delete-all-trash-by-shop', {params});
  }

}
