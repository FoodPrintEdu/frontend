import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [CommonModule, AccordionModule, TabViewModule, ButtonModule, Textarea],
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements OnInit {
  modalReady: any;
  constructor(public ref: DynamicDialogRef) {}

  sendTicket() {
    this.ref.close();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.modalReady = true;
    }, 1);
  }
}
