import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {environment} from '../../environments/environment';
import {VendorService} from '../services/vendor/vendor.service';

export const userAuthStateGuard = async (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const userService = inject(VendorService);
  const router = inject(Router);

  const token = state.root.queryParams['token'];
  const secret = state.root.queryParams['secret'];

  if (token && secret) {
    // Logout existing user if any
    await userService.userLogOut(false);

    // Try to login with token
    const loginSuccess = await userService.loginWithToken(token,secret); // ei method tumi toiri korte hobe

    if (loginSuccess) {
      // Navigate to dashboard or intended page
      return router.parseUrl(environment.userBaseUrl); // e.g. '/dashboard'
    } else {
      // If login fails, redirect to login with token
      return router.createUrlTree([environment.userLoginUrl], {
        queryParams: {token},
        queryParamsHandling: 'merge'
      });
    }
  } else {
    if (!userService.isUser) {
      return true;
    }
    return router.parseUrl(environment.userBaseUrl);
  }
};
