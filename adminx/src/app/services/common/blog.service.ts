import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Blog} from '../../interfaces/common/blog.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';

const API_BANNER = environment.apiBaseLink + '/api/blog/';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addBlog
   * insertManyBlog
   * getAllBlogs
   * getBlogById
   * updateBlogById
   * updateMultipleBlogById
   * deleteBlogById
   * deleteMultipleBlogById
   */

  addBlog(data: Blog) {
    return this.httpClient.post<ResponsePayload>
    (API_BANNER + 'add', data);
  }


  getAllBlog(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Blog[], count: number, success: boolean }>(API_BANNER + 'get-all-by-shop', filterData, {params});
  }

  getBlogById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Blog, message: string, success: boolean }>(API_BANNER + 'get-by-id/' + id, {params});
  }

  updateBlogById(id: string, data: Blog) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BANNER + 'update/' + id, data);
  }

  updateMultipleBlogById(ids: string[], data: Blog) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_BANNER + 'update-multiple', mData);
  }

  deleteBlogById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BANNER + 'delete/' + id, {params});
  }

  deleteMultipleBlogById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BANNER + 'delete-multiple', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BANNER + 'delete-all-trash-by-shop', {params});
  }
}
