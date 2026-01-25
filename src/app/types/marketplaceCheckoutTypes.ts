export type MarketplaceCheckoutItem = {
  offer_id: string;
  qty: number;
};

export type MarketplaceCheckoutResponseData = {
  checkout_url: string;
  currency: string;
  order_id: string;
  price_cents: number;
  product_data_string: string;
  session_id: string;
};
