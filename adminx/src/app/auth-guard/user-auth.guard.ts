import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {environment} from '../../environments/environment';
import {VendorService} from '../services/vendor/vendor.service';

export const userAuthGuard = async (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const userService = inject(VendorService);
  const router = inject(Router);

  const token = state.root.queryParams['token'];
  const secret = state.root.queryParams['secret'];

  // Jodi token thake
  if (token) {
    await userService.userLogOut(false);

    const loginSuccess = await userService.loginWithToken(token,secret);

    if (loginSuccess) {
      return true; // allow route
    } else {
      return router.createUrlTree([environment.userLoginUrl], {
        queryParams: {token, navigateFrom: state.url, cartSlide: false},
        queryParamsHandling: 'merge'
      });
    }
  }

  // jodi user logged in na thake
  if (!userService.isUser) {
    return router.createUrlTree([environment.userLoginUrl], {
      queryParams: {navigateFrom: state.url, cartSlide: false},
      queryParamsHandling: 'merge'
    });
  }

  return true;
};
