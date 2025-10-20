import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthGuardComponent } from './auth-guard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthGuardComponent', () => {
  let component: AuthGuardComponent;
  let fixture: ComponentFixture<AuthGuardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthGuardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
