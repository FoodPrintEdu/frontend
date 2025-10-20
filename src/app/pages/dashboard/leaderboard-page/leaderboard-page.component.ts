import { Component } from '@angular/core';
import { CardsComponent } from './../../../components/leaderboard/cards/cards.component';
import { TopPerformersComponent } from '../../../components/leaderboard/top-performers/top-performers.component';
import { WeeklyChallengesComponent } from '../../../components/leaderboard/weekly-challenges/weekly-challenges.component';

@Component({
  selector: 'app-leaderboard-page',
  imports: [CardsComponent, TopPerformersComponent, WeeklyChallengesComponent],
  templateUrl: './leaderboard-page.component.html',
  styleUrl: './leaderboard-page.component.scss',
})
export class LeaderboardPageComponent {}
