import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private isMenuOpen = new BehaviorSubject<boolean>(false);
  public isMenuOpen$ = this.isMenuOpen.asObservable();

  private isMobile = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobile.asObservable();

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth < 1080;
    this.isMobile.next(isMobile);

    // Set initial menu state based on screen size
    if (!isMobile) {
      // Desktop: menu is always open
      this.isMenuOpen.next(true);
    } else {
      // Mobile: menu starts closed
      this.isMenuOpen.next(false);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.next(!this.isMenuOpen.value);
  }

  openMenu(): void {
    this.isMenuOpen.next(true);
  }

  closeMenu(): void {
    this.isMenuOpen.next(false);
  }

  get currentMenuState(): boolean {
    return this.isMenuOpen.value;
  }

  get currentMobileState(): boolean {
    return this.isMobile.value;
  }
}
