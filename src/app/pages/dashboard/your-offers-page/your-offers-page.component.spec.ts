import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { YourOffersPageComponent } from './your-offers-page.component';

describe('YourOffersPageComponent', () => {
  let component: YourOffersPageComponent;
  let fixture: ComponentFixture<YourOffersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourOffersPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourOffersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
