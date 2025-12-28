import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {DietService} from '../service/diet.service';

export const currentDietGuard: CanActivateFn = async (route, state) => {

  const dietService = inject(DietService);
  const router = inject(Router)
  let currentDiet = null;
  try {
    currentDiet = (await dietService.getCurrentClientDiet()).data;
    return !!currentDiet;
  } catch (e) {
    router.navigateByUrl("/account");
    return false;
  }
};
