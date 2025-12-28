import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {DietService} from '../service/diet.service';
import {firstValueFrom, take} from 'rxjs';

export const currentDietGuard: CanActivateFn = async (route, state) => {
  const dietService = inject(DietService);
  const router = inject(Router);

  const currentClient = await firstValueFrom(
    dietService.currentClient$.pipe(
      take(1)
    )
  );
  const canActivate = currentClient.fitnessDataPresent;

  if (!canActivate) {
    return router.createUrlTree(['/account']);
  }

  return true;
};
