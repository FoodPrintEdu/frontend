import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AuthGuardComponent } from './pages/auth-guard/auth-guard.component';
import { HomePageComponent } from './pages/dashboard/home-page/home-page.component';

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
