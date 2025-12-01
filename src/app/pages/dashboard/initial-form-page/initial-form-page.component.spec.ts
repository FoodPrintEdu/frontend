import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFormPageComponent } from './initial-form-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('InitialFormPageComponent', () => {
  let component: InitialFormPageComponent;
  let fixture: ComponentFixture<InitialFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialFormPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
