import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardPageComponent} from './dashboard-page.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {UserService} from '../../service/user.service';
import {SubscriptionService} from '../../service/subscription.service';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  const mockUserService = {
    getCurrentUser: () => ({ id: '123', role: 'USER', name: 'Test User' }),
    isAuthenticated: () => true
  };

  const mockSubscriptionService = {
    hasActiveSubscription: () => false,
    userSubscription: () => null,
    plans: () => []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),

        provideNoopAnimations(),

        { provide: UserService, useValue: mockUserService },
        { provide: SubscriptionService, useValue: mockSubscriptionService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
