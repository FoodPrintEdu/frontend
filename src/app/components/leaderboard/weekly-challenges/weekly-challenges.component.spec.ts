import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyChallengesComponent } from './weekly-challenges.component';

describe('WeeklyChallengesComponent', () => {
  let component: WeeklyChallengesComponent;
  let fixture: ComponentFixture<WeeklyChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyChallengesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
