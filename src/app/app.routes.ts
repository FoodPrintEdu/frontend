import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AuthGuardComponent } from './pages/auth-guard/auth-guard.component';
import { HomePageComponent } from './pages/dashboard/home-page/home-page.component';
import { LeaderboardPageComponent } from './pages/dashboard/leaderboard-page/leaderboard-page.component';
import { MarketplacePageComponent } from './pages/marketplace-page/marketplace-page.component';
import { RecipesPageComponent } from './pages/recipes-page/recipes-page.component';

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
