import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInformationComponent } from './profile-information.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileInformationComponent', () => {
  let component: ProfileInformationComponent;
  let fixture: ComponentFixture<ProfileInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInformationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
