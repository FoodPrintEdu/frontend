export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type RefreshResponse = {
  access_token: string;
  token_type: string;
};
