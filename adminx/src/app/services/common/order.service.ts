import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Order} from '../../interfaces/common/order.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_ORDER = environment.apiBaseLink + '/api/order/';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOrder
   * insertManyOrder
   * getAllOrders
   * getOrderById
   * updateOrderById
   * updateMultipleOrderById
   * deleteOrderById
   * deleteMultipleOrderById
   */

  addOrder(data: Order) {
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'add', data);
  }

  insertManyOrder(data: Order, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'insert-many', mData);
  }

  getAllOrders(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Order[],
      count: number,
      totalProfit: number,
      success: boolean
    }>(API_ORDER + 'get-all-by-shop', filterData, {params});
  }

  getAllIncompleteOrders(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Order[],
      count: number,
      totalProfit: number,
      success: boolean
    }>(API_ORDER + 'get-all-incomplete-order-by-shop', filterData, {params});
  }

  // getAllOrders(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: Order[], count: number, totalProfit: number, success: boolean }>(API_ORDER + 'get-all', filterData, {params});
  // }

  getOrdersByUser(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Order[];
      count: number;
      success: boolean;
    }>(API_ORDER + 'get-orders-by-user-id', filterData, {params});
  }


  getAllOrdersByProductId(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Order[],
      count: number,
      success: boolean,
      calculation: any
    }>(API_ORDER + 'get-all-order-by-product', filterData, {params});
  }

  getAllOrdersByProductCategoryId(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Order[],
      count: number,
      success: boolean,
      calculation: any
    }>(API_ORDER + 'get-all-order-by-product-category', filterData, {params});
  }


  getOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Order,
      message: string,
      success: boolean
    }>(API_ORDER + 'get-by-id/' + id, {params});
  }

  getIncompleteOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Order,
      message: string,
      success: boolean
    }>(API_ORDER + 'get-incomplete-order-by-id/' + id, {params});
  }

  updateOrderById(id: string, data: Order) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'update/' + id, data);
  }

  updateOrderByDeliveryAssignStatusById(id: string, data: Order) {
    return this.httpClient.put<{
      message: string,
      success: boolean
    }>(API_ORDER + 'update-by-delivery-assign-status/' + id, data);
  }

  changeOrderStatus(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'change-status/' + id, data);
  }

  updateMultipleOrderById(ids: string[], data: Order) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_ORDER + 'update-multiple', mData);
  }

  deleteOrderById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_ORDER + 'delete/' + id, {params});
  }

  deleteMultipleOrderById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-multiple', {ids: ids}, {params});
  }


  deleteMultipleIncompleteOrderById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-multiple-incomplete-orders', {ids: ids}, {params});
  }

  deleteMultipleOrdersById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-multiple-orders', {ids: ids}, {params});
  }

  deleteAllTrashByShop( checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-all-trash-by-shop', {params});
  }


  generateInvoiceById(id: string) {
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_ORDER + 'generate-invoice/' + id);
  }

  checkedFraudOrder(mobile: string) {
    return this.httpClient.get<{
      data: any,
      message: string,
      success: boolean
    }>(API_ORDER + 'check-fraud-order/' + mobile);
  }


  getUserDataByPhoneNo(data: Order) {
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'get-users-data-by-phone-no', data);
  }
}
