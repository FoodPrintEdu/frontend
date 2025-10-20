import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietNotificationsComponent } from './diet-notifications.component';

describe('DietNotificationsComponent', () => {
  let component: DietNotificationsComponent;
  let fixture: ComponentFixture<DietNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
