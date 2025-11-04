import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

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
})
export class InitialFormPageComponent {
  initialForm: FormGroup;

  constructor() {
    this.initialForm = new FormGroup({
      gender: new FormControl(''),
      age: new FormControl(''),
      weight: new FormControl(''),
      height: new FormControl(''),
      activity: new FormControl(''),
      goal: new FormControl(''),
      diet: new FormControl(''),
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
}
