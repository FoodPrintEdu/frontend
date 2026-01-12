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
import {combineLatest, filter, Subscription} from 'rxjs';
import {Client} from '../../../types/Client';
import {DietGenerationModalComponent} from '../../../components/diet-generation-modal/diet-generation-modal.component';
import {Router} from '@angular/router';
import {DailyClientDietSummaryObject} from '../../../types/dietTypes';
import {Meal} from '../../../types/Meal';

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
  clientDailySummary: DailyClientDietSummaryObject[];
  highlightDietPreferences: boolean;
  subscription: Subscription;
  clientMeals: Meal[];


  constructor(private dietService: DietService, private dialogService: DialogService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.subscription = combineLatest({
      diet: this.dietService.clientDiet$.pipe(filter(d => !!d)),
      summary: this.dietService.currentDailyDietSummary$,
      client: this.dietService.currentClient$,
      meals: this.dietService.getMeals()
    })
      .subscribe({
        next: ({diet, summary, client, meals}) => {
          this.currentClient = client;
          if (!this.currentClient.fitnessDataPresent) {
            this.showWelcome();
          }
          this.currentDiet = diet;
          this.clientDailySummary = summary;
          this.clientMeals = meals.data;
        }, error: error => {
          this.currentClient = null;
          this.showWelcome();
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

      const newDiet = await this.dietService.setDietPreferences(dietPlan);
      this.showDietGenerationModal(newDiet);
    } catch (e) {
      console.error('Update-fitness-data failed', e);
    }
  }

  showDietGenerationModal(dietData: ClientDiet) {
    this.ref = this.dialogService.open(DietGenerationModalComponent, {
      header: 'Diet generation',
      width: '40%',
      contentStyle: {overflow: 'auto'},
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
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
