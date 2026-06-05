import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {isPlatformBrowser} from "@angular/common";
import {Wishlist} from '../../interfaces/common/wishlist.interface';
import {ReloadService} from '../core/reload.service';
import {Cart} from "../../interfaces/common/cart.interface";

const API_URL = environment.apiBaseLink + '/api/wishlist/';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  constructor(
    private httpClient: HttpClient,

  ) {

  }


  /**
   * getCartByShopByUserId()
   */


  getWishlistByShopByUserId(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Wishlist,
      message: string,
      success: boolean
    }>(API_URL + 'get-all-wishlist-by-user/' + id, {params});
  }

}
