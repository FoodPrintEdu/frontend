import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ProfileInformationComponent
} from '../../../components/account/profile-information/profile-information.component';
import {DietPreferencesComponent} from '../../../components/account/diet-preferences/diet-preferences.component';
import {DietNotificationsComponent} from '../../../components/account/diet-notifications/diet-notifications.component';
import {AccountSettingsComponent} from '../../../components/account/account-settings/account-settings.component';
import {WelcomeModalComponent} from '../../../components/welcome-modal/welcome-modal.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DietService} from '../../../service/diet.service';
import {ClientDiet} from '../../../types/ClientDiet';
import {DietPlan} from '../../../types/DietPlan';
import {Subscription} from 'rxjs';
import {Client} from '../../../types/Client';
import {DietGenerationModalComponent} from '../../../components/diet-generation-modal/diet-generation-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-page',
  imports: [
    ProfileInformationComponent,
    DietPreferencesComponent,
    DietNotificationsComponent,
    AccountSettingsComponent,
  ],
  providers: [DialogService],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  standalone: true
})
export class AccountPageComponent implements OnInit, OnDestroy {

  ref: DynamicDialogRef;
  protected currentDiet: ClientDiet;
  private currentClient: Client;
  highlightDietPreferences: boolean;
  private clientSub: Subscription;
  private dietSub: Subscription;


  constructor(private dietService: DietService, private dialogService: DialogService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {

    this.clientSub = this.dietService.currentClient$.subscribe({
      next: (currentClient) => {
        this.currentClient = currentClient;
        if (!this.currentClient.fitnessDataPresent) {
          this.showWelcome();
        }
      }, error: err => {
        this.currentClient = null;
        this.showWelcome();
      }
    });

    this.dietSub = this.dietService.clientDiet$.subscribe({
      next: (clientDiet) => {
        this.currentDiet = clientDiet;
      }, error: err => {
        this.currentDiet = null;
      }
    });

  }


  showWelcome() {
    this.ref = this.dialogService.open(WelcomeModalComponent, {
      header: ' ',
      width: '40%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      maximizable: false,
      closable: true,
      modal: true
    });

    this.ref.onClose.subscribe((result) => {
      if (result?.action === 'completeProfile') {
        this.highlightDietPreferences = true;
      }
    });
  }


  async onSaveDiet(dietPlan: DietPlan) {
    try {

      await this.dietService.setDietPreferences(dietPlan);
      this.showDietGenerationModal(this.currentDiet);
    } catch (e) {
      console.error('Update-fitness-data failed', e);
    }
  }

  showDietGenerationModal(dietData: ClientDiet) {
    this.ref = this.dialogService.open(DietGenerationModalComponent, {
      header: 'Diet generation',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: true,
      modal: true,
      data: {
        generatedDiet: dietData
      }
    });

    this.ref.onClose.subscribe((result) => {
      if (result?.action === 'goToDashboard') {
        this.router.navigateByUrl("/");
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dietSub) {
      this.dietSub.unsubscribe();
    }
    if (this.clientSub) {
      this.clientSub.unsubscribe();
    }
  }
}
