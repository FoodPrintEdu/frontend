import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietGenerationModalComponent } from './diet-generation-modal.component';

describe('DietGenerationModalComponent', () => {
  let component: DietGenerationModalComponent;
  let fixture: ComponentFixture<DietGenerationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietGenerationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietGenerationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
