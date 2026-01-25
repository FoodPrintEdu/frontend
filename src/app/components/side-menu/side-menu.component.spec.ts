import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SideMenuComponent} from './side-menu.component';
import {UserService} from '../../service/user.service';
import {of} from 'rxjs';
import {SubscriptionService} from '../../service/subscription.service';
import {DietService} from '../../service/diet.service';
import {RouterModule} from '@angular/router';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  const mockUserService = {
    getCurrentUser: () => ({
      id: '123',
      role: 'USER',
      email: 'test@test.com',
      name: 'Test User'
    })
  };

  const mockSubService = {
    hasActiveSubscription: () => false,
  };

  const mockDietService = {
    currentDiet$: of(null)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SideMenuComponent,
        RouterModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SubscriptionService, useValue: mockSubService },
        { provide: DietService, useValue: mockDietService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
