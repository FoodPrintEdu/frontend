import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MarketplaceCategoriesComponent } from '../../components/marketplace/marketplace-categories/marketplace-categories.component';
import { MarketplaceItemsComponent } from '../../components/marketplace/marketplace-items/marketplace-items.component';

@Component({
  selector: 'app-marketplace-page',
  imports: [
    ButtonModule,
    MarketplaceCategoriesComponent,
    MarketplaceItemsComponent,
  ],
  templateUrl: './marketplace-page.component.html',
  styleUrl: './marketplace-page.component.scss',
})
export class MarketplacePageComponent {}
