import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../service/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (userService.checkLoggedIn()) {
    return true;
  }
  if (userService.checkRefreshToken()) {
    try {
      await userService.refreshTokens();
      if (userService.checkLoggedIn()) {
        return true;
      }
    } catch (err) {
      console.error('Token refresh failed', err);
    }
  }
  return router.createUrlTree(['/login']);
};
