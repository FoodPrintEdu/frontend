import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cards',
  imports: [ProgressBarModule, ToastModule, NgOptimizedImage],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  standalone: true
})
export class CardsComponent {}
