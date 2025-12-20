import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {IftaLabelModule} from 'primeng/iftalabel';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {ButtonModule} from 'primeng/button';
import {LoginResponse} from '../../../types/authTypes';
import {UserService} from '../../../service/user.service';
import {ApiService} from '../../../service/api.service';
import {ApiResponse} from '../../../types/ApiResponse';

@Component({
  selector: 'app-initial-form-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupAddonModule,
    InputTextModule,
    InputGroupModule,
    IftaLabelModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './initial-form-page.component.html',
  styleUrl: './initial-form-page.component.scss',
  standalone: true
})
export class InitialFormPageComponent {
  initialForm: FormGroup;

  constructor(private apiService: ApiService,
              private userService: UserService) {
    this.initialForm = new FormGroup({
      sex: new FormControl(''),
      age: new FormControl(''),
      weightInKg: new FormControl(''),
      heightInCm: new FormControl(''),
      activityLevel: new FormControl(''),
      goal: new FormControl(''),
      preferredDietType: new FormControl(''),
    });
  }

  sexes = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
  ];

  activityLevels = [
    { label: 'Sedentary', value: 'NO_ACTIVITY' },
    { label: 'Lightly Active', value: 'LOW_ACTIVITY' },
    { label: 'Medium Activity', value: 'MEDIUM_ACTIVITY' },
    { label: 'Very Active', value: 'HIGH_ACTIVITY' },
    { label: 'Extra Active', value: 'ATHLETE_ACTIVITY' },
  ];

  goals = [
    { label: 'Cut', value: 'CUT' },
    { label: 'Maintain', value: 'MAINTAIN' },
    { label: 'Gain a bit', value: 'MAINGAIN' },
    { label: 'Bulk', value: 'BULK' },
  ];

  diets = [
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Vegetarian', value: 'VEGETARIAN' },
    { label: 'Vegan', value: 'VEGAN' },
  ];

  async onSubmit() {
    console.log(this.initialForm.getRawValue());
    const fitnessRequestBody = this.initialForm.getRawValue();
    const user = this.userService.getCurrentUser();
    if (!user) {
      console.warn('User not loaded yet!');
      return;
    }
    try {
      const updateResponse = await this.apiService
        .put<ApiResponse<LoginResponse>>(
          `/diet/api/v1/clients/${user.id}/update-fitness-data`,
          fitnessRequestBody,
        );
      console.log(updateResponse);
    } catch (e) {
      console.error('Update-fitness-data failed', e);
    }
  }

}
