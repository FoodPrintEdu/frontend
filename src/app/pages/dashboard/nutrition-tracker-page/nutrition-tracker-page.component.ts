import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { DietService } from '../../../service/diet.service';
import { DailyClientDietSummaryObject } from '../../../types/dietTypes';
import { Observable, Subscription } from 'rxjs';
import { DecimalPipePipe } from '../../../pipes/decimal-pipe.pipe';

@Component({
  selector: 'app-nutrition-tracker-page',
  imports: [CommonModule, DecimalPipePipe, FormsModule, DatePickerModule],
  templateUrl: './nutrition-tracker-page.component.html',
  providers: [DatePipe],
  styleUrl: './nutrition-tracker-page.component.scss',
  standalone: true
})
export class NutritionTrackerPageComponent implements OnInit, OnDestroy {
  dailyDietSummary$: Observable<DailyClientDietSummaryObject[] | null>;
  dailyDietSummary: DailyClientDietSummaryObject[] | null = null;
  selectedDate: Date = new Date();
  today: Date = new Date();
  currentDayData: any = null;
  private subscription?: Subscription;

  constructor(private dietService: DietService, private datePipe: DatePipe) {
    this.dailyDietSummary$ = this.dietService.currentDailyDietSummary$;
  }

  async ngOnInit(): Promise<void> {
    this.subscription = this.dietService.currentDailyDietSummary$.subscribe(summary => {
      this.dailyDietSummary = summary;
      this.updateCurrentDayData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateCurrentDayData(): void {
    if (
      !this.dailyDietSummary ||
      this.dailyDietSummary.length === 0
    ) {
      this.currentDayData = null;
      return;
    }

    const selectedDateString = this.datePipe.transform(
      this.selectedDate,
      'yyyy-MM-dd'
    );

    console.log('NutritionTrackerPageComponent initialized');
    const selectedData = this.dailyDietSummary.find(
      (item) => item.date === selectedDateString
    );

    this.currentDayData = selectedData || null;
  }

  getCurrentDayData() {
    return this.currentDayData;
  }

  onDateChange(): void {
    this.updateCurrentDayData();
  }

  getKcalProgress(): number {
    if (!this.currentDayData) return 0;
    return Math.round(
      (this.currentDayData.totalKcal /
        this.currentDayData.clientDiet.dailyKcalTarget) *
        100
    );
  }

  getProteinProgress(): number {
    if (!this.currentDayData) return 0;
    return Math.round(
      (this.currentDayData.totalProtein /
        this.currentDayData.clientDiet.dailyProteinTarget) *
        100
    );
  }

  formatEnum(type: string): string {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
