import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ProgressBarModule} from 'primeng/progressbar';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ClientDiet} from '../../types/ClientDiet';

@Component({
  selector: 'app-diet-generator-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressBarModule, ButtonModule, TagModule],
  templateUrl: './diet-generation-modal.component.html',
  styleUrls: ['./diet-generation-modal.component.scss']
})
export class DietGenerationModalComponent implements OnInit {

  generatedDiet: ClientDiet;
  isFinished: boolean = false;
  progress: number = 0;
  currentStepIndex: number = 0;
  protected readonly Math = Math;
  steps: string[] = [
    'Saving your preferences...',
    'Searching available diets...',
    'Matching nutritional needs...',
    'Calculating final match...'
  ];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    if (this.config.data?.generatedDiet) {
      this.generatedDiet = this.config.data.generatedDiet;
    }

    setTimeout(() => {
      this.startSimulation();
    }, 250);
  }

  private async startSimulation() {
    this.progress = 10;
    this.currentStepIndex = 0;
    await this.delay(2000);

    this.progress = 40;
    this.currentStepIndex = 1;
    await this.delay(2000);

    this.progress = 75;
    this.currentStepIndex = 2;
    await this.delay(2000);

    this.progress = 90;
    this.currentStepIndex = 3;
    await this.delay(2000);

    this.progress = 100;
    await this.delay(500);

    this.isFinished = true;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  closeModal() {
    if (this.isFinished) {
      this.ref.close({action: 'goToDashboard'});
    }
  }


  getDietColorClass(type: string): string {
    switch (type) {
      case 'VEGAN':
        return 'text-green-500';
      case 'VEGETARIAN':
        return 'text-teal-500';
      default:
        return 'text-blue-500';
    }
  }


}
