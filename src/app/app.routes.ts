import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { RootComponent } from './pages/root/root.component';
import { HomePageComponent } from './pages/dashboard/home-page/home-page.component';
import { LeaderboardPageComponent } from './pages/dashboard/leaderboard-page/leaderboard-page.component';
import { MarketplacePageComponent } from './pages/dashboard/marketplace-page/marketplace-page.component';
import { RecipesPageComponent } from './pages/dashboard/recipes-page/recipes-page.component';
import { RecipeDetailPageComponent } from './pages/dashboard/recipe-detail-page/recipe-detail-page.component';
import { AccountPageComponent } from './pages/dashboard/account-page/account-page.component';
import { InitialFormPageComponent } from './pages/dashboard/initial-form-page/initial-form-page.component';
import { NutritionTrackerPageComponent } from './pages/dashboard/nutrition-tracker-page/nutrition-tracker-page.component';
import {currentDietGuard} from './guards/current-diet.guard';
import {authGuard} from './guards/auth.guard';
import {YourOffersPageComponent} from './pages/dashboard/your-offers-page/your-offers-page.component';
import {entrepreneurGuard} from './guards/entrepreneur.guard';
import {subscriptionGuard} from './guards/subscription.guard';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardPageComponent,
        children: [
          {
            path: '',
            component: HomePageComponent,
            canActivate: [currentDietGuard]
          },
          {
            path: 'leaderboard',
            component: LeaderboardPageComponent,
          },
          {
            path: 'marketplace',
            component: MarketplacePageComponent,
          },
          {
            path: 'your-offers',
            component: YourOffersPageComponent,
            canActivate: [entrepreneurGuard]
          },
          {
            path: 'nutrition',
            component: NutritionTrackerPageComponent,
            canActivate: [currentDietGuard, subscriptionGuard]
          },
          {
            path: 'recipes',
            component: RecipesPageComponent,
            canActivate: [currentDietGuard]
          },
          {
            path: 'recipe/:id',
            component: RecipeDetailPageComponent,
          },
          {
            path: 'account',
            component: AccountPageComponent,
          },
          {
            path: 'complete-form',
            component: InitialFormPageComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
];
