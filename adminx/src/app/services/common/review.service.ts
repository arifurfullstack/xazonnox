import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Review} from '../../interfaces/common/review.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {ResponsePayload} from "../../interfaces/core/response-payload.interface";

const API_REVIEW_CONTROL = environment.apiBaseLink + '/api/review/';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * Review Control
   */

  addReview(data: Review) {
    return this.httpClient.post<{ message: string,success: boolean }>(API_REVIEW_CONTROL + 'add-review-by-vendor', data);
  }

  addReviewByAdmin(data: Review) {
    return this.httpClient.post<{ message: string }>(API_REVIEW_CONTROL + 'add-by-admin', data);
  }


  getAllReviews() {
    return this.httpClient.get<{data: Review[], message?: string}>(API_REVIEW_CONTROL + 'get-all-review');
  }

  // getReviewByReviewId(id: string) {
  //   return this.httpClient.get<{data: Review, message?: string}>(API_REVIEW_CONTROL + 'get-review-by-review-id/' + id);
  // }


  getReviewByReviewId(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Review, message: string, success: boolean }>(API_REVIEW_CONTROL +'get-by-id/'+ id, {params});
  }

  editReview(data: Review) {
    return this.httpClient.put<{ message: string }>(API_REVIEW_CONTROL + 'update-by-vendor', data);
  }

  getUpdatedProductReviews() {
    let params = new HttpParams();
    return this.httpClient.get<{ success: boolean; message: string }>(
      `${API_REVIEW_CONTROL}get-all-product-review`,
      {params}
    );
  }


  updateReviewAndDelete(data: Review) {
    return this.httpClient.put<{ message: string }>(API_REVIEW_CONTROL + 'update-and-review-remove', data);
  }
  updateReview(data: Review) {
    return this.httpClient.put<{ message: string ,success: boolean}>(API_REVIEW_CONTROL + 'update-vendor', data);
  }
  deleteReviewByReviewId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_REVIEW_CONTROL + 'delete-by-vendor/' + id);
  }

  deleteMultipleReviewById(ids: string[]) {
    let params = new HttpParams();
    return this.httpClient.post<ResponsePayload>(API_REVIEW_CONTROL + 'delete-multiple-by-vendor', {ids: ids},{params});
  }

  updateMultipleReviewById(ids: string[], data: Review) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_REVIEW_CONTROL + 'update-multiple-by-vendor', mData);
  }

  getAllReviewsByQuery(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Review[], count: number, success: boolean }>(API_REVIEW_CONTROL + 'get-all-review-by-vendor', filterData, {params});
  }

getAllReviewsShop(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Review[], count: number, success: boolean }>(API_REVIEW_CONTROL + 'get-all-by-shop', filterData, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_REVIEW_CONTROL + 'delete-all-trash-by-shop', {params});
  }
}
