import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesItemsComponent } from './recipes-items.component';

describe('RecipesItemsComponent', () => {
  let component: RecipesItemsComponent;
  let fixture: ComponentFixture<RecipesItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
