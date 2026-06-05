import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from "../../interfaces/gallery/filter-data";
import { SubCategory } from '../../interfaces/common/sub-category.interface';

const API_SUB_CATEGORY = environment.apiBaseLink + '/api/sub-category/';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addSubCategory
   * insertManySubCategory
   * getAllSubCategorys
   * getSubCategoryById
   * updateSubCategoryById
   * updateMultipleSubCategoryById
   * deleteSubCategoryById
   * deleteMultipleSubCategoryById
   */

  addSubCategory(data: SubCategory) {
    return this.httpClient.post<ResponsePayload>
    (API_SUB_CATEGORY + 'add', data);
  }


  getAllSubCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: SubCategory[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-all-by-shop', filterData, {params});
  }

  getSubCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SubCategory, message: string, success: boolean }>(API_SUB_CATEGORY + 'get-by-id/' + id, {params});
  }

  getSubCategoriesByCategoryId(categoryId: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SubCategory[], message: string, success: boolean }>(API_SUB_CATEGORY + 'get-all-by-parent/' + categoryId, { params });
  }


  updateSubCategoryById(id: string, data: SubCategory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_SUB_CATEGORY + 'update/' + id, data);
  }

  updateMultipleSubCategoryById(ids: string[], data: SubCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SUB_CATEGORY + 'update-multiple', mData);
  }

  deleteSubCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_SUB_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultipleSubCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SUB_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SUB_CATEGORY + 'delete-all-trash-by-shop', {params});
  }
}
