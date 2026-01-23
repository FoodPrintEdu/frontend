import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { MarketplaceItemsComponent } from './marketplace-items.component';

describe('MarketplaceItemsComponent', () => {
  let component: MarketplaceItemsComponent;
  let fixture: ComponentFixture<MarketplaceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceItemsComponent],
      providers: [MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketplaceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
