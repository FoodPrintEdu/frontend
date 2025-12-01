import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Recipe } from '../../../types/recipeTypes';

@Component({
  selector: 'app-recipes-items',
  imports: [CommonModule],
  templateUrl: './recipes-items.component.html',
  styleUrl: './recipes-items.component.scss',
})
export class RecipesItemsComponent {
  @Input() recipes: Recipe[] = [];
  @Input() noRecipesMessage: string = '';

  constructor(private router: Router) {}

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
}
