import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../service/user.service';

export const entrepreneurGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const user = userService.getCurrentUser();

  return user && user.role === 'entrepreneur';
};
