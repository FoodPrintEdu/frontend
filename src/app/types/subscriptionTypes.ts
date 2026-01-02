export type SubscriptionPlan = {
  id: number;
  name: string;
  description: string;
  price: number;
  interval: string;
  active: boolean;
};

export type UserSubscription = {
  id: number;
  user_id: string;
  plan_id: number;
  start_date: string;
  end_date: string;
  active: boolean;
  auto_renew: boolean;
};

export type SubscriptionCheckoutResponse = {
  checkout_url: string;
  session_id: string;
};
