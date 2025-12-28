import {Component, OnInit} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {MenuItem} from 'primeng/api';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {UserService} from '../../service/user.service';
import {UserResponse} from '../../types/userTypes';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Router} from '@angular/router';
import {ClientDiet} from '../../types/ClientDiet';
import {DietService} from '../../service/diet.service';

@Component({
  selector: 'app-side-menu',
  imports: [
    MenuModule,
    AvatarModule,
    BadgeModule,
    NgOptimizedImage,
    ProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  standalone: true
})
export class SideMenuComponent implements OnInit {
  user!: UserResponse;
  currentDiet: ClientDiet | null = null;
  items: MenuItem[] = [];

  constructor(
    protected userService: UserService,
    private router: Router,
    private dietService: DietService
  ) {}

  async ngOnInit() {
    try {
      this.currentDiet = (await this.dietService.getCurrentClientDiet()).data;
    } catch (error) {
      this.currentDiet = null;
    } finally {
      this.updateMenu();
    }
  }
  updateMenu() {

    const dietDisabled = !this.currentDiet;

    this.items = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: '/',
            disabled: dietDisabled,
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
            disabled: dietDisabled,
          },
          {
            label: 'Meal Planner',
            icon: 'pi pi-fw pi-calendar',
            routerLink: '/meal-planner',
            disabled: dietDisabled,
          },
          {
            label: 'Nutrition Tracker',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: '/nutrition',
            disabled: dietDisabled,
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
              this.router.navigate(['/login']).then(() => {
                window.location.reload();
              });
            },
          },
        ],
      },
    ];
  }
}
