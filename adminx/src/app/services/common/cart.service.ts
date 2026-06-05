import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Cart} from '../../interfaces/common/cart.interface';

const API_URL = environment.apiBaseLink + '/api/cart/';

@Injectable({
  providedIn: 'root',
})
export class CartService {


  // Inject

  private readonly httpClient = inject(HttpClient);


  /**
   * getCartByShopByUserId()
   */


  getCartByShopByUserId(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Cart,
      message: string,
      success: boolean
    }>(API_URL + 'get-all-carts-by-user/' + id, {params});
  }


}
