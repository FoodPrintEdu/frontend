export interface Offer {
  id?: string;
  diet_ingredient_id: number;
  diet_ingredient_name?: string;
  seller_name?: string;
  seller_user_id?: string;
  price_cents: number;
  currency: string;
  pack_size_g: number;
  pack_count_total: number;
  pack_count_remaining?: number;
  status?: string;
}
