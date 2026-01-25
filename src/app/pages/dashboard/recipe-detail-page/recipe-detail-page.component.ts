import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {DividerModule} from 'primeng/divider';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Ingredient, Recipe} from '../../../types/recipeTypes';
import {RecipeService} from '../../../service/recipe.service';
import {environment} from '../../../../environments/environment';
import {DietService} from '../../../service/diet.service';
import {Popover} from 'primeng/popover';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-recipe-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    InputNumberModule,
    ToastModule,
    Popover,
    Tooltip,
  ],
  templateUrl: './recipe-detail-page.component.html',
  styleUrl: './recipe-detail-page.component.scss',
  providers: [MessageService],
  standalone: true
})
export class RecipeDetailPageComponent implements OnInit, OnDestroy {
  recipe: Recipe | null = null;
  loading: boolean = true;
  error: string | null = null;
  recipeId: number = 0;
  currentNutritionInfo: string[] = [];
  // Meal preparation properties
  selectedServings: number = 1;
  cookingInProgress: boolean = false;
  
  wakeLock: any = null;
  wakeLockEnabled: boolean = false;
  wakeLockSupported: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private messageService: MessageService,
    private dietService: DietService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      this.loadRecipeDetails();
    });
    
    this.checkWakeLockSupport();
    
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  ngOnDestroy() {
    this.releaseWakeLock();
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private checkWakeLockSupport() {
    this.wakeLockSupported = 'wakeLock' in navigator;
    if (!this.wakeLockSupported) {
      console.warn('Screen Wake Lock API is not supported in this browser');
    }
  }

  async toggleWakeLock() {
    if (!this.wakeLockSupported) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Not Supported',
        detail: 'Screen Wake Lock is not supported in your browser',
      });
      return;
    }

    if (this.wakeLockEnabled) {
      await this.releaseWakeLock();
    } else {
      await this.requestWakeLock();
    }
  }

  private async requestWakeLock() {
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLockEnabled = true;

      this.wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock was released');
        this.wakeLockEnabled = false;
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Screen Active',
        detail: 'Your screen will stay on while viewing this recipe',
      });

      console.log('Screen Wake Lock is active');
    } catch (err: any) {
      console.error('Failed to activate Screen Wake Lock:', err);
      this.wakeLockEnabled = false;
      
      this.messageService.add({
        severity: 'error',
        summary: 'Wake Lock Failed',
        detail: err.message || 'Failed to keep screen active',
      });
    }
  }

  private async releaseWakeLock() {
    if (this.wakeLock !== null) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        this.wakeLockEnabled = false;
        console.log('Screen Wake Lock released');
      } catch (err) {
        console.error('Failed to release Wake Lock:', err);
      }
    }
  }

  private handleVisibilityChange = async () => {
    if (this.wakeLock !== null && document.visibilityState === 'visible') {
      await this.requestWakeLock();
    }
  };

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
          this.selectedServings = foundRecipe.servings; // Initialize with recipe's default servings
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

  getRecipeSrc(recipe: Recipe) {
    return `${environment.API_URL}/diet/api/v1/recipes/${recipe.id}/image`;
  }

  showNutritionInfo(event: Event, info: string[], popover: Popover) {
    this.currentNutritionInfo = info;
    popover.toggle(event);
  }

  goToMarketplace(ingredient: Ingredient) {
    this.router.navigate(['/marketplace'], {
      queryParams: {
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.name
      }
    });
  }

  onMealPrepared() {
    if (!this.recipe) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Recipe not found',
      });
      return;
    }

    if (this.selectedServings < 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Input',
        detail: 'Please select at least 1 serving',
      });
      return;
    }

    this.cookingInProgress = true;

    this.recipeService
      .cookRecipe(this.recipe.id, this.selectedServings)
      .subscribe({
        next: async (response) => {
          this.cookingInProgress = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Meal Prepared!',
            detail: `Successfully logged ${this.selectedServings} serving(s) of ${this.recipe?.name}`,
          });
          console.log('Meal logged successfully:', response);
          await this.dietService.loadDailyDietSummary();
        },
        error: (error) => {
          this.cookingInProgress = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to log meal',
          });
          console.error('Error logging meal:', error);
        },
      });
  }
}
