import {Component, OnInit} from '@angular/core';
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
export class AccountPageComponent implements OnInit {

  ref: DynamicDialogRef;
  protected currentDiet: ClientDiet;
  highlightDietPreferences: boolean;

  constructor(private dietService: DietService, private dialogService: DialogService) {
  }

  async ngOnInit(): Promise<void> {

    try {
      console.log("GOT CURRENT DIET", this.currentDiet);
      this.currentDiet = (await this.dietService.getCurrentClientDiet()).data;
      console.log("GOT CURRENT DIET", this.currentDiet);
    } catch (error) {
      this.currentDiet = null;
    }
    if (!this.currentDiet) {
      this.showWelcome();
    }
  }


  showWelcome() {
    this.ref = this.dialogService.open(WelcomeModalComponent, {
      header: ' ',
      width: '40%',
      contentStyle: { overflow: 'auto' },
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
      this.currentDiet = (await this.dietService.getCurrentClientDiet()).data;
    } catch (e) {
      console.error('Update-fitness-data failed', e);
    }

  }
}
