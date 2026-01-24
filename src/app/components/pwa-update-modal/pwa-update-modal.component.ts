import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export interface UpdateModalData {
  currentVersion?: string;
  newVersion?: string;
  changelog?: string[];
  autoUpdateSeconds?: number;
}

@Component({
  selector: 'app-pwa-update-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule],
  templateUrl: './pwa-update-modal.component.html',
  styleUrls: ['./pwa-update-modal.component.scss']
})
export class PwaUpdateModalComponent implements OnInit, OnDestroy {
  currentVersion: string = '';
  newVersion: string = '';
  changelog: string[] = [];
  
  autoUpdateSeconds: number = 30;
  remainingSeconds: number = 30;
  progressValue: number = 100;
  
  private countdownSubscription?: Subscription;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    const data = this.config.data as UpdateModalData;
    this.currentVersion = data?.currentVersion || 'unknown';
    this.newVersion = data?.newVersion || 'new version';
    this.changelog = data?.changelog || [
      'Bug fixes and performance improvements',
      'New application features',
      'Security updates'
    ];
    this.autoUpdateSeconds = data?.autoUpdateSeconds || 30;
    this.remainingSeconds = this.autoUpdateSeconds;
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }

  private startCountdown(): void {
    this.countdownSubscription = interval(1000)
      .pipe(take(this.autoUpdateSeconds))
      .subscribe({
        next: (elapsed) => {
          this.remainingSeconds = this.autoUpdateSeconds - elapsed - 1;
          this.progressValue = (this.remainingSeconds / this.autoUpdateSeconds) * 100;
          
          if (this.remainingSeconds <= 0) {
            this.updateNow();
          }
        }
      });
  }

  updateNow(): void {
    this.countdownSubscription?.unsubscribe();
    this.ref.close({ action: 'update' });
  }

  updateLater(): void {
    this.countdownSubscription?.unsubscribe();
    this.ref.close({ action: 'later' });
  }
}
