export interface Offer {
  id: string;
  dietIngredientId: number;
  dietIngredientName: string;
  sellerUserId?: string;
  priceCents: number;
  currency: string;
  packSizeG: number;
  packCountTotal: number;
  packCountRemaining: number;
  status: string;
}
