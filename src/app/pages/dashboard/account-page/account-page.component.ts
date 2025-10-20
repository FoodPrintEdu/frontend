import { Component } from '@angular/core';
import { ProfileInformationComponent } from '../../../components/account/profile-information/profile-information.component';
import { DietPreferencesComponent } from '../../../components/account/diet-preferences/diet-preferences.component';
import { DietNotificationsComponent } from '../../../components/account/diet-notifications/diet-notifications.component';
import { AccountSettingsComponent } from '../../../components/account/account-settings/account-settings.component';

@Component({
  selector: 'app-account-page',
  imports: [
    ProfileInformationComponent,
    DietPreferencesComponent,
    DietNotificationsComponent,
    AccountSettingsComponent,
  ],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent {}
