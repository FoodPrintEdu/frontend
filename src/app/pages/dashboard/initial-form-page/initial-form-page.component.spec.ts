import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFormPageComponent } from './initial-form-page.component';

describe('InitialFormPageComponent', () => {
  let component: InitialFormPageComponent;
  let fixture: ComponentFixture<InitialFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
