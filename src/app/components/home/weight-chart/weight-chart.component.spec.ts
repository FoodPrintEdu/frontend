import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeightChartComponent } from './weight-chart.component';
import {ApiService} from '../../../service/api.service';


describe('WeightChartComponent', () => {
  let component: WeightChartComponent;
  let fixture: ComponentFixture<WeightChartComponent>;
  const mockApiService = {
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ data: {} }))
  };

  const mockUser = { id: '123', role: 'USER', email: 'test@test.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightChartComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WeightChartComponent);
    component = fixture.componentInstance;
    component.user = mockUser as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
