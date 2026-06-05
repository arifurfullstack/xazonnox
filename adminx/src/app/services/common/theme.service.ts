import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Theme} from "../../interfaces/common/theme.interface";
import {FilterData} from "../../interfaces/core/filter-data";
import {NewReleaseReport} from "../../interfaces/common/new-release-report.interface";


const API_URL = environment.apiBaseLink + '/api/theme/';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getShopTheme()
   */

  getShopTheme(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Theme,
      message: string,
      success: boolean
    }>(API_URL + 'get-shop-theme', {params});
  }

  getAllNewReleaseReport(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: NewReleaseReport[], count: number, success: boolean }>(API_URL + 'get-all-new-release-report/', filterData, {params});
  }

}
