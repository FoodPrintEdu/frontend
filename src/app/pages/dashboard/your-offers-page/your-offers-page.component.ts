import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {Offer} from '../../../types/Offer';
import {Tooltip} from 'primeng/tooltip';
import {Ingredient} from '../../../types/recipeTypes';
import {IngredientService} from '../../../service/ingredient.service';

@Component({
  selector: 'app-your-offers-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DialogModule,
    CardModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    Tooltip
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './your-offers-page.component.html',
  styleUrl: './your-offers-page.component.scss'
})
export class YourOffersPageComponent implements OnInit {
  // Dane
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];

  availableIngredients: Ingredient[];

  filterName: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;
  filterMinStock: number | null = null;


  offerDialog: boolean = false;
  offerForm: FormGroup;
  isEditMode: boolean = false;
  currentOfferId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ingredientService: IngredientService
  ) {
    this.initForm();
  }

  async ngOnInit() {
    try {
      this.availableIngredients = (await this.ingredientService.getAvailableIngredients()).data;
    } catch (error) {
      this.availableIngredients = [];
    }
    this.loadMockData();
    this.applyFilters();
  }

  private initForm() {
    this.offerForm = this.fb.group({
      dietIngredient: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      packSizeG: [null, [Validators.required, Validators.min(1)]],
      packTotalCount: [null, [Validators.required, Validators.min(1)]]
    });
  }


  openNew() {
    this.offerForm.reset();
    this.offerForm.get('dietIngredient')?.enable();
    this.isEditMode = false;
    this.currentOfferId = null;
    this.offerDialog = true;
  }

  openEdit(offer: Offer) {
    this.isEditMode = true;
    this.currentOfferId = offer.id!;
    this.offerForm.patchValue({
      dietIngredient: { id: offer.dietIngredientId, name: offer.dietIngredientName },
      price: offer.priceCents / 100,
      packSizeG: offer.packSizeG,
      packCountTotal: offer.packCountTotal
    });

    this.offerForm.get('dietIngredient')?.disable();
    this.offerDialog = true;
  }

  deleteOffer(offer: Offer) {
    this.confirmationService.confirm({
      message: 'Do you want to delete the offer for: ' + offer.dietIngredientName + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offers = this.offers.filter(val => val.id !== offer.id);
        this.applyFilters();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Offer deleted successfully' });
      }
    });
  }

  saveOffer() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }
    // todo make backend request
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New offer created successfully' });
    this.offerDialog = false;
    this.applyFilters();
  }


  applyFilters() {
    this.filteredOffers = this.offers.filter(offer => {
      const matchesName = !this.filterName ||
        offer.dietIngredientName.toLowerCase().includes(this.filterName.toLowerCase());

      const pricePln = offer.priceCents / 100;
      const matchesMinPrice = this.filterMinPrice === null || pricePln >= this.filterMinPrice;
      const matchesMaxPrice = this.filterMaxPrice === null || pricePln <= this.filterMaxPrice;

      const matchesStock = this.filterMinStock === null || offer.packCountRemaining >= this.filterMinStock;

      return matchesName && matchesMinPrice && matchesMaxPrice && matchesStock;
    });
  }


  // todo demock
  loadMockData() {
    this.offers = [
      { id: '1', dietIngredientId: 1, dietIngredientName: 'Carrots', priceCents: 450, currency: 'PLN', packSizeG: 1000, packCountTotal: 50, packCountRemaining: 12, status: 'active' },
      { id: '2', dietIngredientId: 3, dietIngredientName: 'AP Flour', priceCents: 320, currency: 'PLN', packSizeG: 1000, packCountTotal: 100, packCountRemaining: 85, status: 'active' },
      { id: '3', dietIngredientId: 4, dietIngredientName: 'Cherry Tomatoes', priceCents: 1299, currency: 'PLN', packSizeG: 500, packCountTotal: 20, packCountRemaining: 0, status: 'active' },
    ];
  }
}
