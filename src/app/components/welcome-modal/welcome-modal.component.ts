import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss']
})
export class WelcomeModalComponent {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  handleCta() {
    this.ref.close({ action: 'completeProfile' });
  }
}
