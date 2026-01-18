import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-install-pwa-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './install-pwa-modal.component.html',
  styleUrls: ['./install-pwa-modal.component.scss']
})
export class InstallPwaModalComponent {

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  install() {
    this.ref.close({ action: 'install' });
  }

  dismiss() {
    this.ref.close({ action: 'dismiss' });
  }
}
