import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { PrivacyModalComponent } from './privacy-modal.component';

describe('PrivacyModalComponent', () => {
  let component: PrivacyModalComponent;
  let fixture: ComponentFixture<PrivacyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyModalComponent],
      providers: [
        {
          provide: DynamicDialogRef,
          useValue: { close: jasmine.createSpy('close') }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
