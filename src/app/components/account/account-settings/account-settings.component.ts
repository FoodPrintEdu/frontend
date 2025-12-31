import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PrivacyModalComponent} from '../../privacy-modal/privacy-modal.component';
import {HelpModalComponent} from '../../help-modal/help-modal.component';

@Component({
  selector: 'app-account-settings',
  imports: [],
  templateUrl: './account-settings.component.html',
  standalone: true,
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
  constructor(protected userService: UserService, private dialogService: DialogService) {
  }

  ref: DynamicDialogRef;

  showPrivacyModal() {
    this.ref = this.dialogService.open(PrivacyModalComponent, {
      header: 'Privacy & Security',
      width: '40%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      maximizable: false,
      closable: true,
      modal: true
    });

    this.ref.onClose.subscribe((result) => {
      if (result?.action) {
        console.log("PRIVACY MODAL CLOSED");
      }
    });
  }

  showHelpModal() {
    this.ref = this.dialogService.open(HelpModalComponent, {
      header: 'Help & Support',
      width: '40%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      maximizable: false,
      closable: true,
      modal: true
    });

    this.ref.onClose.subscribe((result) => {
      if (result?.action) {
        console.log("HELP MODAL CLOSED");
      }
    });
  }
}
