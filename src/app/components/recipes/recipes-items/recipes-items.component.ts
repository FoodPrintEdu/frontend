import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Recipe } from '../../../types/recipeTypes';
import {environment} from '../../../../environments/environment';
import {Paginator} from 'primeng/paginator';

@Component({
  selector: 'app-recipes-items',
  imports: [CommonModule, Paginator],
  templateUrl: './recipes-items.component.html',
  styleUrl: './recipes-items.component.scss',
  standalone: true
})
export class RecipesItemsComponent implements OnInit, OnChanges {
  @Input() recipes: Recipe[] = [];
  @Input() noRecipesMessage: string = '';
  visibleRecipes: Recipe[] = [];
  firstRecipeIndex: number = 0;
  recipesPerPage: number = 12;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateVisibleRecipes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recipes']) {
      this.firstRecipeIndex = 0;
      this.updateVisibleRecipes();
    }
  }

  private updateVisibleRecipes() {
    if (!this.recipes) return;

    const start = this.firstRecipeIndex;
    const end = this.firstRecipeIndex + this.recipesPerPage;
    this.visibleRecipes = this.recipes.slice(start, end);
  }

  onPageChange(event: any) {
    this.firstRecipeIndex = event.first;
    this.recipesPerPage = event.rows;
    this.updateVisibleRecipes();
  }

  onRecipeClick(recipeId: number) {
    this.router.navigate(['/recipe', recipeId]);
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

  getDisplayTags(tags: string[]): { visible: string[]; extra: number } {
    if (tags.length <= 2) {
      return { visible: tags, extra: 0 };
    }
    return { visible: tags.slice(0, 2), extra: tags.length - 2 };
  }

  truncateInstructions(instructions: string, maxLength: number = 80): string {
    if (instructions.length <= maxLength) {
      return instructions;
    }
    return instructions.substring(0, maxLength).trim() + '...';
  }

  getRecipeSrc(recipe: Recipe) {
    return `${environment.API_URL}/diet/api/v1/recipes/${recipe.id}/image`;
  }

}
