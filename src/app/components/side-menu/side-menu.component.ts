import {Component, effect, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {MenuItem} from 'primeng/api';
import {CommonModule, NgIf, NgOptimizedImage} from '@angular/common';
import {UserService} from '../../service/user.service';
import {UserResponse} from '../../types/userTypes';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Router, RouterLink} from '@angular/router';
import {ClientDiet} from '../../types/ClientDiet';
import {DietService} from '../../service/diet.service';
import {MenuService} from '../../service/menu.service';
import {Subscription} from 'rxjs';
import {SubscriptionService} from '../../service/subscription.service';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-side-menu',
  imports: [
    MenuModule,
    AvatarModule,
    BadgeModule,
    NgOptimizedImage,
    ProgressSpinnerModule,
    NgIf,
    CommonModule,
    Ripple,
    RouterLink,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  standalone: true,
  host: {
    '[class.mobile-hidden]': 'isMobile && !isMenuOpen',
    '[class.mobile-open]': 'isMobile && isMenuOpen',
  },
})
export class SideMenuComponent implements OnInit, OnDestroy {
  user!: UserResponse;
  currentDiet: ClientDiet | null = null;
  items: MenuItem[] = [];
  dietSub: Subscription;
  isMenuOpen = false;
  isMobile = false;
  private subscriptions: Subscription[] = [];

  constructor(
    protected userService: UserService,
    private dietService: DietService,
    private menuService: MenuService,
    private subService: SubscriptionService,
    private router: Router
  ) {
    effect(() => {
      const user = this.userService.getCurrentUser();
      if (user) {
        this.user = user;
      }
      this.updateMenu();
    });
  }

  async ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.dietSub = this.dietService.clientDiet$.subscribe({
      next: (diet) => {
        this.currentDiet = diet;
        this.updateMenu();
      },
      error: (error) => {
        this.updateMenu();
      },
    });

    this.subscriptions.push(
      this.menuService.isMenuOpen$.subscribe((isOpen) => {
        this.isMenuOpen = isOpen;
      }),
      this.menuService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      })
    );
  }

  updateMenu() {
    const dietDisabled = !this.currentDiet;
    const trackerDisabled = !this.subService.hasActiveSubscription();

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
            label: 'Nutrition Tracker',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: '/nutrition',
            disabled: dietDisabled || trackerDisabled,
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
            label: 'Your Offers',
            icon: 'pi pi-fw pi-dollar',
            routerLink: '/your-offers',
            visible: this.user.role === 'entrepreneur'
          },
          // {
          //   label: 'Leaderboard',
          //   icon: 'pi pi-fw pi-star',
          //   routerLink: '/leaderboard',
          // },

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
              this.userService.logout();
            },
          },
        ],
      },
    ];
  }

  ngOnDestroy(): void {
    if (this.dietSub) {
      this.dietSub.unsubscribe();
    }
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const sideMenu = document.querySelector('.side-menu-wrapper');
    const hamburgerButton = document.querySelector('.hamburger-button');

    // Close menu if clicking outside on mobile
    if (
      this.isMobile &&
      this.isMenuOpen &&
      sideMenu &&
      !sideMenu.contains(target) &&
      hamburgerButton &&
      !hamburgerButton.contains(target)
    ) {
      this.menuService.closeMenu();
    }
  }

  onMenuItemClick(): void {
    // Close menu on mobile when menu item is clicked
    if (this.isMobile) {
      this.menuService.closeMenu();
    }
  }
}
