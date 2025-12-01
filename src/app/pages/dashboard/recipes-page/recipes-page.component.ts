import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RecipesItemsComponent } from '../../../components/recipes/recipes-items/recipes-items.component';
import { RecipeService } from '../../../service/recipe.service';
import { Recipe, RecipeResponse } from '../../../types/recipeTypes';

@Component({
  selector: 'app-recipes-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    RecipesItemsComponent,
  ],
  templateUrl: './recipes-page.component.html',
  styleUrls: ['./recipes-page.component.scss'],
})
export class RecipesPageComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  loading: boolean = true;
  error: string | null = null;
  noRecipesMessage: string = '';
  searchTerm: string = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.loading = true;
    this.error = null;

    this.recipeService.getRecipesForClient().subscribe({
      next: (response: RecipeResponse) => {
        this.recipes = response.data || [];
        this.filteredRecipes = [...this.recipes];
        this.noRecipesMessage = response.message;
        this.loading = false;
        console.log('Recipes loaded:', this.recipes);
      },
      error: (error) => {
        this.error = error.message || 'Failed to load recipes';
        this.loading = false;
        console.error('Error loading recipes:', error);
      },
    });
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
