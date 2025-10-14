import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RecipesItemsComponent } from '../../components/recipes/recipes-items/recipes-items.component';

@Component({
  selector: 'app-recipes-page',
  imports: [
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    RecipesItemsComponent,
  ],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.scss',
})
export class RecipesPageComponent {}
