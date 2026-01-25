export type MarketplaceOrderOffer = {
  id: string;
  currency: string;
  diet_ingredient_id: number;
  diet_ingredient_name: string;
  seller_name?: string;
  pack_size_g: number;
};

export type MarketplaceOrderItem = {
  id: string;
  seller_user_id: string;
  offer_id: string;
  unit_price_cents: number;
  quantity: number;
  offer: MarketplaceOrderOffer;
};

export type MarketplaceOrder = {
  id: string;
  status: string;
  items: MarketplaceOrderItem[];
  currency: string;
  inserted_at: string;
  updated_at: string;
  buyer_user_id: string;
  total_price_cents: number;
};
