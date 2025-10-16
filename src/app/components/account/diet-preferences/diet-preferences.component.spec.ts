import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietPreferencesComponent } from './diet-preferences.component';

describe('DietPreferencesComponent', () => {
  let component: DietPreferencesComponent;
  let fixture: ComponentFixture<DietPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
