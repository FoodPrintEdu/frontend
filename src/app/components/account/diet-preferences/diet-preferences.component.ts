import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DietPlan} from '../../../types/DietPlan';
import {ClientDiet} from '../../../types/ClientDiet';

@Component({
  selector: 'app-diet-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    CardModule
  ],
  templateUrl: './diet-preferences.component.html',
  styleUrls: ['./diet-preferences.component.scss']
})
export class DietPreferencesComponent implements OnInit, OnChanges {

  @Input() currentDiet: ClientDiet | null = null;
  @Input() highlight: boolean = false;
  @Output() saveDiet = new EventEmitter<DietPlan>();

  initialForm!: FormGroup;
  isEditing: boolean = false;

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
  constructor(private el: ElementRef) {
  }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDiet'] && this.currentDiet) {
      this.isEditing = false;
      this.initForm();
      this.initialForm.patchValue(this.currentDiet);
    } else {
      this.isEditing = true;
    }
    if (changes['highlight'] && this.highlight) {
      this.scrollToComponent();
    }
  }

  private initForm() {
    if (this.currentDiet) {
      this.initialForm = new FormGroup({
        sex: new FormControl(this.currentDiet.client.sex, Validators.required),
        age: new FormControl(this.currentDiet.client.age, [Validators.required, Validators.min(1)]),
        weightInKg: new FormControl(this.currentDiet.client.weightInKg, [Validators.required, Validators.min(1)]),
        heightInCm: new FormControl(this.currentDiet.client.heightInCm, [Validators.required, Validators.min(1)]),
        activityLevel: new FormControl(this.currentDiet.client.activityLevel, Validators.required),
        goal: new FormControl(this.currentDiet.client.goal, Validators.required),
        preferredDietType: new FormControl(this.currentDiet.client.preferredDietType, Validators.required),
      });
    } else {
      this.initialForm = new FormGroup({
        sex: new FormControl('', Validators.required),
        age: new FormControl(null, [Validators.required, Validators.min(1)]),
        weightInKg: new FormControl(null, [Validators.required, Validators.min(1)]),
        heightInCm: new FormControl(null, [Validators.required, Validators.min(1)]),
        activityLevel: new FormControl('', Validators.required),
        goal: new FormControl('', Validators.required),
        preferredDietType: new FormControl('', Validators.required),
      });
    }

  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.currentDiet) {
      this.initialForm.patchValue(this.currentDiet);
    }
  }

  onSubmit() {
    if (this.initialForm.valid) {
      this.saveDiet.emit(this.initialForm.value);
    } else {
      this.initialForm.markAllAsTouched();
    }
  }

  get buttonLabel(): string {
    return this.currentDiet ? 'Update diet plan' : 'Get diet plan';
  }

  getHeaderText() {
    return this.currentDiet ? "Update your dietary requirements and goals": "Define your dietary requirements and goals";
  }
  getTitleText() {
    return this.currentDiet ? "Diet Preferences": "Complete your profile - Define diet preferences";
  }

  private scrollToComponent() {
    setTimeout(() => {
      this.el.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  }


  getGoalLabel(currentDiet: ClientDiet) {
    return this.goals.find(g => g.value === currentDiet.client.goal).label;
  }
  getActivityLabel(currentDiet: ClientDiet) {
    return this.activityLevels.find(g => g.value === currentDiet.client.activityLevel).label;
  }
}
