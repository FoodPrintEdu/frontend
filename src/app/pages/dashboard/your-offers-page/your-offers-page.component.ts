import {Component, effect, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {MarketplaceService} from '../../../service/marketplace.service';
import {UserService} from '../../../service/user.service';

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
  private userId: string;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ingredientService: IngredientService,
    private marketplaceService: MarketplaceService,
    private userService: UserService,
  ) {
    effect(async () => {
      const user = this.userService.getCurrentUser();
      if (user && user.id) {
        this.userId = user.id;
      }
    });
    this.initForm();
  }

  async ngOnInit() {
    try {
      this.availableIngredients = (await this.ingredientService.getAvailableIngredients()).data;
    } catch (error) {
      this.availableIngredients = [];
    }
    try {
      this.offers = (await this.marketplaceService.getAvailableOffers({sellerId: this.userId})).data;
      console.log("AVAILABLE OFFERS: ", this.offers);
    } catch (error) {
      this.offers = [];
    }
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
      dietIngredient: {id: offer.diet_ingredient_id, name: offer.diet_ingredient_name},
      price: offer.price_cents / 100,
      packSizeG: offer.pack_size_g,
      packTotalCount: offer.pack_count_total
    });

    this.offerForm.get('dietIngredient')?.disable();
    this.offerDialog = true;
  }

  deleteOffer(offer: Offer) {
    this.confirmationService.confirm({
      message: 'Do you want to delete the offer for: ' + offer.diet_ingredient_name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.marketplaceService.archiveOffer(offer);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Offer deleted successfully'});
          this.offers = this.offers.filter(o => o.id !== offer.id);
        } catch (e) {
          this.messageService.add({severity: 'danger', summary: 'Error', detail: 'Failed to delete the offer'});
        }
        this.applyFilters();
      }
    });
  }

  async saveOffer() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }
    const ingredient = this.offerForm.get('dietIngredient').value as Ingredient
    const priceCents: number = Math.round((this.offerForm.get('price').value as number) * 100)
    const offerToSave: Offer = {
      diet_ingredient_id: ingredient.id,
      price_cents: priceCents,
      currency: 'PLN',
      pack_size_g: this.offerForm.get('packSizeG').value as number,
      pack_count_total: this.offerForm.get('packTotalCount').value as number,
      pack_count_remaining: this.offerForm.get('packTotalCount').value as number
    }
    if (this.isEditMode) {
      try {
        console.log("OFFER TO EDIT", offerToSave);
        offerToSave.id = this.currentOfferId;
        const editedOffer = (await this.marketplaceService.editOffer(offerToSave)).data;
        this.offers = (await this.marketplaceService.getAvailableOffers({sellerId: this.userId})).data;
        console.log("AVAILABLE OFFERS: ", this.offers);
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Offer edited successfully'});
      } catch (e) {
        this.messageService.add({severity: 'danger', summary: 'Error', detail: 'Failed to edit offer'});
      }
    } else {
      try {
        console.log("NEW OFFER", offerToSave);
        const createdOffer = (await this.marketplaceService.createOffer(offerToSave)).data;
        this.offers = (await this.marketplaceService.getAvailableOffers({sellerId: this.userId})).data;
        console.log("AVAILABLE OFFERS: ", this.offers);
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'New offer created successfully'});
      } catch (e) {
        this.messageService.add({severity: 'danger', summary: 'Error', detail: 'Failed to create offer'});
      }
    }

    this.offerDialog = false;
    this.applyFilters();
  }


  applyFilters() {
    this.filteredOffers = this.offers.filter(offer => {
      const matchesName = !this.filterName ||
        offer.diet_ingredient_name.toLowerCase().includes(this.filterName.toLowerCase());

      const pricePln = offer.price_cents / 100;
      const matchesMinPrice = this.filterMinPrice === null || pricePln >= this.filterMinPrice;
      const matchesMaxPrice = this.filterMaxPrice === null || pricePln <= this.filterMaxPrice;

      const matchesStock = this.filterMinStock === null || offer.pack_count_remaining >= this.filterMinStock;

      return matchesName && matchesMinPrice && matchesMaxPrice && matchesStock;
    });
  }
}
