import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RefreshResponse } from '../types/authTypes';
import { Subscription } from 'rxjs';
import { UserResponse } from '../types/userTypes';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ACCESS_EXPIRY = 30 * 60 * 1000; // 30 minutes
  private REFRESH_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenType: string | null = null;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.tokenType = localStorage.getItem('tokenType');
  }

  get Token(): string | null {
    return this.token;
  }

  get RefreshToken(): string | null {
    return this.refreshToken;
  }

  get TokenType(): string | null {
    return this.tokenType;
  }

  checkLoggedIn(): boolean {
    return (
      this.token !== null &&
      Date.now() < Number(localStorage.getItem('tokenExpiry'))
    );
  }

  checkRefreshToken(): boolean {
    return (
      this.refreshToken !== null &&
      Date.now() < Number(localStorage.getItem('refreshTokenExpiry'))
    );
  }

  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    this.tokenType = null;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiry');
    localStorage.removeItem('tokenType');
  }

  setTokens(token: string, refreshToken: string, tokenType: string): void {
    this.token = token;
    this.refreshToken = refreshToken;
    this.tokenType = tokenType;

    // Set token information in local storage
    localStorage.setItem('token', token);
    localStorage.setItem(
      'tokenExpiry',
      (Date.now() + this.ACCESS_EXPIRY).toString()
    );
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem(
      'refreshTokenExpiry',
      (Date.now() + this.REFRESH_EXPIRY).toString()
    );
    localStorage.setItem('tokenType', tokenType);
  }

  refreshTokens(): Subscription {
    return this.http
      .post<RefreshResponse>(`${this.apiUrl}/user/api/v1/auth/refresh`, null, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${this.tokenType} ${this.refreshToken}`,
        },
        responseType: 'json',
      })
      .subscribe({
        next: (response) => {
          this.token = response.access_token;
          localStorage.setItem('token', response.access_token);
          localStorage.setItem(
            'tokenExpiry',
            (Date.now() + this.ACCESS_EXPIRY).toString()
          );
        },
        error: (err) => {
          console.error('Failed to refresh tokens', err);
        },
      });
  }

  getUser() {
    return this.http.get<UserResponse>(
      `${this.apiUrl}/user/api/v1/auth/profile`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${this.tokenType} ${this.token}`,
        },
        responseType: 'json',
      }
    );
  }
}
