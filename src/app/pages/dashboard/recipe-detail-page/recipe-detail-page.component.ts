import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Recipe } from '../../../types/recipeTypes';
import { RecipeService } from '../../../service/recipe.service';

@Component({
  selector: 'app-recipe-detail-page',
  imports: [CommonModule, ButtonModule, CardModule, TagModule, DividerModule],
  templateUrl: './recipe-detail-page.component.html',
  styleUrl: './recipe-detail-page.component.scss',
})
export class RecipeDetailPageComponent implements OnInit {
  recipe: Recipe | null = null;
  loading: boolean = true;
  error: string | null = null;
  recipeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      this.loadRecipeDetails();
    });
  }

  loadRecipeDetails() {
    this.loading = true;
    this.error = null;

    // Since we don't have a specific endpoint for single recipe,
    // we'll load all recipes and find the specific one
    this.recipeService.getRecipesForClient().subscribe({
      next: (response) => {
        const foundRecipe = response.data?.find(
          (recipe) => recipe.id === this.recipeId
        );
        if (foundRecipe) {
          this.recipe = foundRecipe;
        } else {
          this.error = 'Recipe not found';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load recipe details';
        this.loading = false;
        console.error('Error loading recipe details:', error);
      },
    });
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  getDifficultyText(difficulty: number): string {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }

  getDifficultySeverity(difficulty: number): 'success' | 'warning' | 'danger' {
    switch (difficulty) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      default:
        return 'success';
    }
  }
}
