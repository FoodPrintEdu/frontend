import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map, first, concat, interval } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  constructor(
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef
  ) {}

  initialize(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker is not enabled.');
      return;
    }

    this.checkForUpdatesRegularly();

    this.listenForUpdates();

    this.handleUnrecoverableState();
  }

  private checkForUpdatesRegularly(): void {
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );

    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        if (updateFound) {
          console.log('Update found for the application');
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    });
  }

  private listenForUpdates(): void {
    const updatesAvailable$ = this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      }))
    );

    updatesAvailable$.subscribe(event => {
      console.log('New version of the application is available!', event);
      this.promptUserToUpdate();
    });
  }

  private promptUserToUpdate(): void {
    const updateMessage = 'A new version of FoodPrintEdu is available! Do you want to update the application now?';
    if (confirm(updateMessage)) {
      this.activateUpdate();
    } else {
      console.log('User declined the update. It will update on the next refresh.');
    }
  }

  async activateUpdate(): Promise<void> {
    try {
      this.saveUserDataBeforeUpdate();

      await this.swUpdate.activateUpdate();

      console.log('Update installed. Reloading the application...');

      setTimeout(() => {
        document.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error activating update:', error);
    }
  }

  private saveUserDataBeforeUpdate(): void {
    localStorage.setItem('lastUpdateTime', new Date().toISOString());

    const unsavedData = sessionStorage.getItem('unsavedFormData');
    if (unsavedData) {
      localStorage.setItem('recoveryData', unsavedData);
    }

    console.log('User data saved before update');
  }

  recoverDataAfterUpdate(): void {
    const recoveryData = localStorage.getItem('recoveryData');
    if (recoveryData) {
      console.log('Recovering data after update...');
      sessionStorage.setItem('unsavedFormData', recoveryData);
      localStorage.removeItem('recoveryData');
    }
  }

  private handleUnrecoverableState(): void {
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('Application is in an unrecoverable state:', event.reason);

      const reloadMessage = 'A critical error occurred in the application. The page will be reloaded.';

      alert(reloadMessage);
      window.location.reload();
    });
  }

  async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      return false;
    }

    try {
      return await this.swUpdate.checkForUpdate();
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  async getCurrentVersion(): Promise<any> {
    if (!this.swUpdate.isEnabled) {
      return null;
    }
    return {
      version: environment.version,
      buildDate: environment.buildDate
    };
  }
}
