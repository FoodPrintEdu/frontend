import {TestBed} from '@angular/core/testing';

import {SubscriptionService} from './subscription.service';
import {UserService} from './user.service';
import {ApiService} from './api.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;

  const mockUserService = {
    getCurrentUser: () => ({ id: '123', role: 'USER' })
  };

  const mockApiService = {
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve([]))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        { provide: UserService, useValue: mockUserService },
        { provide: ApiService, useValue: mockApiService }
      ]
    });
    service = TestBed.inject(SubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
