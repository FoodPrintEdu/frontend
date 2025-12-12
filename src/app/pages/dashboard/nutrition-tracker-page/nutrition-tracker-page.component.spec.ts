import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionTrackerPageComponent } from './nutrition-tracker-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NutritionTrackerPageComponent', () => {
  let component: NutritionTrackerPageComponent;
  let fixture: ComponentFixture<NutritionTrackerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionTrackerPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NutritionTrackerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
