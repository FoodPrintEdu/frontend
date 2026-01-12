import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle menu state', () => {
    const initialState = service.currentMenuState;
    service.toggleMenu();
    expect(service.currentMenuState).toBe(!initialState);
  });

  it('should open menu', () => {
    service.openMenu();
    expect(service.currentMenuState).toBe(true);
  });

  it('should close menu', () => {
    service.closeMenu();
    expect(service.currentMenuState).toBe(false);
  });
});
