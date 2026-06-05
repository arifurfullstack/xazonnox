import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {VendorService} from '../services/vendor/vendor.service';

export const authUserInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(VendorService);
  const authToken = userService.getUserToken();
  const shopId = userService.getShopId();

// Parse the current query parameters
  let queryParams = req.params;

  if (!queryParams.has('shop')) {
    queryParams = queryParams.append('shop', shopId);
  }

  // Clone the request with the updated query parameters
  const authRequest = req.clone({
    params: queryParams,
    setHeaders: authToken ? { 'vendor': `${authToken}` } : {}
  });

  return next(authRequest);
};
