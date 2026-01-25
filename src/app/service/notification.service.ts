import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificationSettings {
  dayCompletion: boolean;
  leaderboardUpdates: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly NOTIFICATION_SETTINGS_KEY = 'notification-settings';
  private readonly PERMISSION_REQUESTED_KEY = 'notification-permission-requested';

  private notificationSettingsSubject = new BehaviorSubject<NotificationSettings>(
    this.loadSettings()
  );
  public notificationSettings$: Observable<NotificationSettings> =
    this.notificationSettingsSubject.asObservable();

  private permissionStateSubject = new BehaviorSubject<NotificationPermission>(
    this.getCurrentPermissionState()
  );
  public permissionState$: Observable<NotificationPermission> =
    this.permissionStateSubject.asObservable();

  constructor() {
    this.initializeNotifications();
  }

  private initializeNotifications(): void {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            this.permissionStateSubject.next(Notification.permission);
          };
        })
        .catch(err => console.error('Permission query failed:', err));
    }
  }

  public getCurrentPermissionState(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  private loadSettings(): NotificationSettings {
    const stored = localStorage.getItem(this.NOTIFICATION_SETTINGS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse notification settings:', e);
      }
    }
    return {
      dayCompletion: true,
      leaderboardUpdates: false
    };
  }

  private saveSettings(settings: NotificationSettings): void {
    localStorage.setItem(this.NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    this.notificationSettingsSubject.next(settings);
  }

  getSettings(): NotificationSettings {
    return this.notificationSettingsSubject.value;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionStateSubject.next(permission);
      localStorage.setItem(this.PERMISSION_REQUESTED_KEY, 'true');

      if (permission === 'granted') {
        console.log('Notification permission granted');
        await this.subscribeToPushNotifications();
      }

      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  hasRequestedPermission(): boolean {
    return localStorage.getItem(this.PERMISSION_REQUESTED_KEY) === 'true';
  }

  async updateSetting(key: keyof NotificationSettings, value: boolean): Promise<void> {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, [key]: value };

    if (value && Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Cannot enable notifications without permission');
        return;
      }
    }

    this.saveSettings(newSettings);
  }

  private async subscribeToPushNotifications(): Promise<void> {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Already subscribed to push notifications');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          environment.vapidPublicKey || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37gp2Vp3HI5VwUqVDjBYSg6UPSALBhvK-b4vtHOZVYuJsKjEqXaVSYrns'
        ) as BufferSource
      });

      console.log('Push subscription:', subscription);

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async showLocalNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const iconPath = '/assets/icons/android/android-launchericon-192-192.png';
    const badgePath = '/assets/icons/android/android-launchericon-72-72.png';

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const notificationOptions: NotificationOptions = {
          icon: iconPath,
          badge: badgePath,
          ...options
        };
        await registration.showNotification(title, notificationOptions);
      } else {
        new Notification(title, {
          icon: iconPath,
          ...options
        });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async notifyDayCompletion(caloriesConsumed: number, caloriesGoal: number): Promise<void> {
    const settings = this.getSettings();
    if (!settings.dayCompletion) {
      return;
    }

    const percentage = Math.round((caloriesConsumed / caloriesGoal) * 100);

    await this.showLocalNotification(
      'Daily Goal Achieved!',
      {
        body: `Congratulations! You've reached ${percentage}% of your daily calorie goal (${caloriesConsumed}/${caloriesGoal} kcal)`,
        tag: 'day-completion',
        data: { type: 'day-completion', url: '/dashboard/home' }
      }
    );
  }

  getPermissionState(): NotificationPermission {
    return this.permissionStateSubject.value;
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }
}
