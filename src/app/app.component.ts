import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from './service/user.service';
import { PwaUpdateService } from './service/pwa-update.service';
import { SyncService } from './service/sync.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private pwaUpdateService: PwaUpdateService,
    private syncService: SyncService
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

    console.log('PWA initialized');
  }

  private setupInstallPrompt(): void {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('PWA can be installed');
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      deferredPrompt = null;
    });
  }

  title = 'team_project';
}

// 1. Add registration form error info
// 2. Add http client to register user
// 3. Add registration form validation
// 4. Add registration form submit button
// 5. Add registration form success message
