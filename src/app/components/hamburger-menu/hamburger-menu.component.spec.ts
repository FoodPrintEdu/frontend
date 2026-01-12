import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HamburgerMenuComponent } from './hamburger-menu.component';
import { MenuService } from '../../service/menu.service';
import { BehaviorSubject } from 'rxjs';

describe('HamburgerMenuComponent', () => {
  let component: HamburgerMenuComponent;
  let fixture: ComponentFixture<HamburgerMenuComponent>;
  let mockMenuService: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MenuService', ['toggleMenu'], {
      isMenuOpen$: new BehaviorSubject(false),
      isMobile$: new BehaviorSubject(false),
    });

    await TestBed.configureTestingModule({
      imports: [HamburgerMenuComponent],
      providers: [{ provide: MenuService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HamburgerMenuComponent);
    component = fixture.componentInstance;
    mockMenuService = TestBed.inject(
      MenuService
    ) as jasmine.SpyObj<MenuService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu when button is clicked', () => {
    component.toggleMenu();
    expect(mockMenuService.toggleMenu).toHaveBeenCalled();
  });
});
