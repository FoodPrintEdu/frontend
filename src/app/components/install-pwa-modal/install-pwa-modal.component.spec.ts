import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { InstallPwaModalComponent } from './install-pwa-modal.component';

describe('InstallPwaModalComponent', () => {
  let component: InstallPwaModalComponent;
  let fixture: ComponentFixture<InstallPwaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallPwaModalComponent],
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

    fixture = TestBed.createComponent(InstallPwaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
