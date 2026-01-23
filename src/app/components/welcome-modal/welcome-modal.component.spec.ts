import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { WelcomeModalComponent } from './welcome-modal.component';

describe('WelcomeModalComponent', () => {
  let component: WelcomeModalComponent;
  let fixture: ComponentFixture<WelcomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeModalComponent],
      providers: [
        {
          provide: DynamicDialogRef,
          useValue: { close: jasmine.createSpy('close') }
        },
        {
          provide: DynamicDialogConfig,
          useValue: { data: {} }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
