import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputSwitchModule, FormsModule, Divider],
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss']
})
export class PrivacyModalComponent {
  // todo remove mock
  settings = {
    publicProfile: true,
  };

  constructor(public ref: DynamicDialogRef) {}

  save() {
    console.log('Saving privacy settings:', this.settings);
    this.ref.close();
  }
}
