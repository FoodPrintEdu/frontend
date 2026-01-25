import { Injectable, ApplicationRef, Optional } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map, first, concat, interval } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { PwaUpdateModalComponent } from '../components/pwa-update-modal/pwa-update-modal.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  private updateModalRef: DynamicDialogRef | undefined;
  private isModalOpen: boolean = false;

  constructor(
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef,
    private router: Router,
    @Optional() private dialogService: DialogService,
    @Optional() private messageService: MessageService
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
      this.promptUserToUpdate();
    });
  }

  private promptUserToUpdate(): void {
    if (this.isModalOpen) {
      return;
    }
    
    this.showUpdateToast();
    
    setTimeout(() => {
      this.showUpdateModal();
    }, 2000);
  }

  private showUpdateToast(): void {
    if (!this.messageService) {
      return;
    }
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Update Available',
        detail: 'A new version of the application is ready to install',
        life: 5000,
        icon: 'pi pi-download'
      });
    } catch (error) {
      console.warn('MessageService not available for toast:', error);
    }
  }

  private showUpdateModal(): void {
    
    if (this.isModalOpen) {
      return;
    }
    
    try {
      this.isModalOpen = true;
      
      this.updateModalRef = this.dialogService.open(PwaUpdateModalComponent, {
        header: 'Application Update',
        width: '550px',
        modal: true,
        closable: false,
        dismissableMask: false,
        data: {
          currentVersion: environment.version || '1.0.0',
          newVersion: 'Latest',
          changelog: [
            'New features and improvements',
            'Bug fixes',
            'Increased performance',
            'Security updates'
          ],
          autoUpdateSeconds: 30
        }
      });
      
      this.updateModalRef.onClose.subscribe((result) => {
        this.isModalOpen = false;
        
        if (result?.action === 'update') {
          this.activateUpdate();
        } else if (result?.action === 'later') {
          this.scheduleUpdateReminder();
          this.showReminderToast();
        }
      });
    } catch (error) {
      console.error('Error details:', error);
      this.isModalOpen = false;
    }
  }

  private scheduleUpdateReminder(): void {
    localStorage.setItem('updateReminderTime', new Date().toISOString());
  }

  private showReminderToast(): void {
    if (!this.messageService) {
      console.warn('MessageService not available');
      return;
    }
    try {
      this.messageService.add({
        severity: 'warn',
        summary: 'Update Postponed',
        detail: 'The update will be installed on the next launch',
        life: 4000
      });
    } catch (error) {
      console.warn('MessageService not available:', error);
    }
  }

  async activateUpdate(): Promise<void> {
    try {
      this.saveUserDataBeforeUpdate();

      await this.swUpdate.activateUpdate();

      setTimeout(() => {
        document.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error activating update:', error);
    }
  }

  private saveUserDataBeforeUpdate(): void {
    try {
      localStorage.setItem('lastUpdateTime', new Date().toISOString());

      const unsavedData = sessionStorage.getItem('unsavedFormData');
      if (unsavedData) {
        localStorage.setItem('recoveryData', unsavedData);
      }

      const cartData = localStorage.getItem('cartItems');
      if (cartData) {
        localStorage.setItem('recovery_cart', cartData);
      }

      try {
        const currentUrl = this.router.url;
        const navigationState = {
          url: currentUrl,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('recovery_navigation', JSON.stringify(navigationState));
      } catch (error) {
        console.warn('Could not save navigation state:', error);
      }

      const uiPreferences = {
        theme: localStorage.getItem('theme'),
        language: localStorage.getItem('language'),
        sideMenuState: sessionStorage.getItem('sideMenuState'),
        filterSettings: sessionStorage.getItem('filterSettings'),
      };
      localStorage.setItem('recovery_preferences', JSON.stringify(uiPreferences));

      const sessionKeys = ['authToken', 'refreshToken', 'sessionData'];
      const sessionBackup: {[key: string]: string} = {};
      sessionKeys.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value) {
          sessionBackup[key] = value;
        }
      });
      if (Object.keys(sessionBackup).length > 0) {
        localStorage.setItem('recovery_session', JSON.stringify(sessionBackup));
      }

      this.saveIndexedDBState();

      localStorage.setItem('update_recovery_needed', 'true');

    } catch (error) {
      console.error('Error saving data before update:', error);
    }
  }

  private async saveIndexedDBState(): Promise<void> {
    try {
      const syncStatus = {
        pendingSyncExists: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('recovery_sync_status', JSON.stringify(syncStatus));
    } catch (error) {
      console.warn('Could not save IndexedDB state:', error);
    }
  }

  recoverDataAfterUpdate(): void {
    const needsRecovery = localStorage.getItem('update_recovery_needed');
    if (!needsRecovery) {
      return;
    }

    try {
      const recoveryData = localStorage.getItem('recoveryData');
      if (recoveryData) {
        sessionStorage.setItem('unsavedFormData', recoveryData);
        localStorage.removeItem('recoveryData');
      }

      const cartData = localStorage.getItem('recovery_cart');
      if (cartData) {
        localStorage.setItem('cartItems', cartData);
        localStorage.removeItem('recovery_cart');
      }

      const preferences = localStorage.getItem('recovery_preferences');
      if (preferences) {
        try {
          const prefs = JSON.parse(preferences);
          if (prefs.theme) localStorage.setItem('theme', prefs.theme);
          if (prefs.language) localStorage.setItem('language', prefs.language);
          if (prefs.sideMenuState) sessionStorage.setItem('sideMenuState', prefs.sideMenuState);
          if (prefs.filterSettings) sessionStorage.setItem('filterSettings', prefs.filterSettings);
          localStorage.removeItem('recovery_preferences');
        } catch (error) {
          console.warn('Error restoring preferences:', error);
        }
      }

      const sessionBackup = localStorage.getItem('recovery_session');
      if (sessionBackup) {
        try {
          const sessionData = JSON.parse(sessionBackup);
          Object.entries(sessionData).forEach(([key, value]) => {
            sessionStorage.setItem(key, value as string);
          });
          localStorage.removeItem('recovery_session');
        } catch (error) {
          console.warn('Error restoring session:', error);
        }
      }

      const syncStatus = localStorage.getItem('recovery_sync_status');
      if (syncStatus) {
        localStorage.removeItem('recovery_sync_status');
      }

      const navigationState = localStorage.getItem('recovery_navigation');
      if (navigationState) {
        try {
          const navData = JSON.parse(navigationState);
          const savedTime = new Date(navData.timestamp).getTime();
          const now = Date.now();
          if (now - savedTime < 5 * 60 * 1000) {
            console.log('Last page:', navData.url);
          }
          localStorage.removeItem('recovery_navigation');
        } catch (error) {
          console.warn('Error restoring navigation:', error);
        }
      }

      localStorage.removeItem('update_recovery_needed');

      this.showRecoverySuccessToast();

    } catch (error) {
      console.error('Error during data recovery:', error);
    }
  }

  private showRecoverySuccessToast(): void {
    setTimeout(() => {
      if (!this.messageService) {
        console.warn('MessageService not available');
        return;
      }
      try {
        this.messageService.add({
          severity: 'success',
          summary: 'Update Completed',
          detail: 'The application has been updated. Your data has been restored.',
          life: 5000,
          icon: 'pi pi-check-circle'
        });
      } catch (error) {
        console.warn('MessageService not available:', error);
      }
    }, 1000);
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
