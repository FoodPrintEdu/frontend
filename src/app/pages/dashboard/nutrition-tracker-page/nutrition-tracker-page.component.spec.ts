import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionTrackerPageComponent } from './nutrition-tracker-page.component';

describe('NutritionTrackerPageComponent', () => {
  let component: NutritionTrackerPageComponent;
  let fixture: ComponentFixture<NutritionTrackerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionTrackerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionTrackerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
