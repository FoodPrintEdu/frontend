import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from './service/user.service';
import { PwaUpdateService } from './service/pwa-update.service';
import { SyncService } from './service/sync.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InstallPwaModalComponent } from './components/install-pwa-modal/install-pwa-modal.component';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  providers: [DialogService]
})
export class AppComponent implements OnInit {
  private deferredPrompt: any = null;
  private installModalRef: DynamicDialogRef | undefined;

  constructor(
    private userService: UserService,
    private pwaUpdateService: PwaUpdateService,
    private syncService: SyncService,
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    if (this.userService.checkLoggedIn()) {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      this.userService.setUser(user);
    }
    this.initializePWA();
  }

  private initializePWA(): void {
    this.pwaUpdateService.initialize();
    this.pwaUpdateService.recoverDataAfterUpdate();

    this.syncService.isOnline$.subscribe(isOnline => {
      console.log(isOnline ? 'Online' : 'Offline');
    });

    this.setupInstallPrompt();
    this.initializeNotifications();

    console.log('PWA initialized');
  }

  private initializeNotifications(): void {
    if (this.userService.checkLoggedIn() && !this.notificationService.hasRequestedPermission()) {
      setTimeout(() => {
        if (this.notificationService.getCurrentPermissionState() === 'default') {
          console.log('Notification permission can be requested from settings');
        }
      }, 5000);
    }
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('PWA can be installed');
      
      if (!this.isAppInstalled() && !this.hasUserDismissedInstall()) {
        this.showInstallModal();
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      this.deferredPrompt = null;
      localStorage.setItem('pwa-installed', 'true');
    });
  }

  private isAppInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true ||
           localStorage.getItem('pwa-installed') === 'true';
  }

  private hasUserDismissedInstall(): boolean {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed) return false;
    
    const dismissedDate = new Date(dismissed);
    const minutesSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60);
    return minutesSinceDismissed < 5;
  }

  private showInstallModal(): void {
    setTimeout(() => {
      this.installModalRef = this.dialogService.open(InstallPwaModalComponent, {
        header: 'Instalacja aplikacji',
        width: '90%',
        modal: true,
        dismissableMask: false,
        closeOnEscape: true
      });

      this.installModalRef.onClose.subscribe((result: any) => {
        if (result?.action === 'install') {
          this.installPwa();
        } else if (result?.action === 'dismiss') {
          localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
        }
      });
    }, 3000);
  }

  private async installPwa(): Promise<void> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return;
    }

    this.deferredPrompt.prompt();
    const result = await this.deferredPrompt.choiceResult;
    console.log('Install result:', result.outcome);

    if (result.outcome === 'dismissed') {
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    }

    this.deferredPrompt = null;
  }

  title = 'team_project';
}

// 1. Add registration form error info
// 2. Add http client to register user
// 3. Add registration form validation
// 4. Add registration form submit button
// 5. Add registration form success message
