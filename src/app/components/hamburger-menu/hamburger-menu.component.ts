import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuService } from '../../service/menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './hamburger-menu.component.html',
  styleUrl: './hamburger-menu.component.scss',
})
export class HamburgerMenuComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isMobile = false;
  private subscriptions: Subscription[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.menuService.isMenuOpen$.subscribe((isOpen) => {
        this.isMenuOpen = isOpen;
      }),
      this.menuService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleMenu(): void {
    this.menuService.toggleMenu();
  }
}
