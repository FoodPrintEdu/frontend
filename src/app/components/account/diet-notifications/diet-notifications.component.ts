import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToggleSwitchModule, ToggleSwitchChangeEvent } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { NotificationService, NotificationSettings } from '../../../service/notification.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diet-notifications',
  imports: [ToggleSwitchModule, FormsModule, CommonModule],
  templateUrl: './diet-notifications.component.html',
  styleUrl: './diet-notifications.component.scss',
  standalone: true
})
export class DietNotificationsComponent implements OnInit, OnDestroy {
  dayCompletionEnabled: boolean = false;
  notificationPermission: NotificationPermission = 'default';
  isNotificationSupported: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.isNotificationSupported = this.notificationService.isSupported();
    this.subscription.add(
      this.notificationService.notificationSettings$.subscribe(settings => {
        this.dayCompletionEnabled = settings.dayCompletion;
      })
    );

    this.subscription.add(
      this.notificationService.permissionState$.subscribe(permission => {
        this.notificationPermission = permission;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async onDayCompletionToggle(event: ToggleSwitchChangeEvent): Promise<void> {
    await this.notificationService.updateSetting('dayCompletion', event.checked);
  }

  async requestPermission(): Promise<void> {
    await this.notificationService.requestPermission();
  }

  get permissionDenied(): boolean {
    return this.notificationPermission === 'denied';
  }

  get permissionGranted(): boolean {
    return this.notificationPermission === 'granted';
  }
}
