import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AuthGuardComponent } from './pages/auth-guard/auth-guard.component';
import { HomePageComponent } from './pages/dashboard/home-page/home-page.component';
import { LeaderboardPageComponent } from './pages/dashboard/leaderboard-page/leaderboard-page.component';
import { MarketplacePageComponent } from './pages/dashboard/marketplace-page/marketplace-page.component';
import { RecipesPageComponent } from './pages/dashboard/recipes-page/recipes-page.component';
import { RecipeDetailPageComponent } from './pages/dashboard/recipe-detail-page/recipe-detail-page.component';
import { AccountPageComponent } from './pages/dashboard/account-page/account-page.component';
import { InitialFormPageComponent } from './pages/dashboard/initial-form-page/initial-form-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthGuardComponent,
    children: [
      {
        path: '',
        component: DashboardPageComponent,
        children: [
          {
            path: '',
            component: HomePageComponent,
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
            path: 'recipes',
            component: RecipesPageComponent,
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
