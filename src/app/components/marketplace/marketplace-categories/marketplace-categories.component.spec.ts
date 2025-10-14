import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceCategoriesComponent } from './marketplace-categories.component';

describe('MarketplaceCategoriesComponent', () => {
  let component: MarketplaceCategoriesComponent;
  let fixture: ComponentFixture<MarketplaceCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketplaceCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
