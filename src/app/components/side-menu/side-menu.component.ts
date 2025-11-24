import {Component, OnInit} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {MenuItem} from 'primeng/api';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {UserService} from '../../service/user.service';
import {UserResponse} from '../../types/userTypes';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [
    MenuModule,
    AvatarModule,
    BadgeModule,
    NgOptimizedImage,
    ProgressSpinnerModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  standalone: true
})
export class SideMenuComponent implements OnInit {
  user!: UserResponse;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  items: MenuItem[] = [
    {
      label: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: '/',
        },
      ],
    },
    {
      label: 'Diet & Nutrition',
      items: [
        {
          label: 'Recipes',
          icon: 'pi pi-fw pi-book',
          routerLink: '/recipes',
        },
        {
          label: 'Meal Planner',
          icon: 'pi pi-fw pi-calendar',
          routerLink: '/meal-planner',
        },
        {
          label: 'Nutrition Tracker',
          icon: 'pi pi-fw pi-chart-line',
          routerLink: '/nutrition',
        },
      ],
    },
    {
      label: 'Community',
      items: [
        {
          label: 'Marketplace',
          icon: 'pi pi-fw pi-shopping-cart',
          routerLink: '/marketplace',
        },
        {
          label: 'Leaderboard',
          icon: 'pi pi-fw pi-star',
          routerLink: '/leaderboard',
        },
        {
          label: 'Forums',
          icon: 'pi pi-fw pi-comments',
          routerLink: '/forums',
        },
      ],
    },
    {
      label: 'Account',
      items: [
        {
          icon: 'pi pi-fw pi-user',
          routerLink: '/account',
          label: 'Account Settings',
        },
        {
          icon: 'pi pi-fw pi-sign-out',
          label: 'Log Out',
          command: () => {
            this.userService.clearTokens();
            this.router.navigate(['/login']);
          },
        },
      ],
    },
  ];
}
