import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {RefreshResponse} from '../types/authTypes';
import {firstValueFrom, of, tap} from 'rxjs';
import {UserResponse} from '../types/userTypes';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ACCESS_EXPIRY = 30 * 60 * 1000; // 30 minutes
  private REFRESH_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenType: string | null = null;
  private apiUrl = environment.API_URL;
  private user = signal<UserResponse | null>(null);

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
    localStorage.removeItem('user');
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

  async refreshTokens() {
    try {
      const refreshResponse = await firstValueFrom(this.http
        .post<RefreshResponse>(`${this.apiUrl}/user/api/v1/auth/refresh`, null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${this.tokenType} ${this.refreshToken}`,
          },
          responseType: 'json',
        }));
      this.token = refreshResponse.access_token;
      localStorage.setItem('token', refreshResponse.access_token);
      localStorage.setItem(
        'tokenExpiry',
        (Date.now() + this.ACCESS_EXPIRY).toString()
      );
    } catch (e) {
      console.error('Failed to refresh tokens', e);
      this.clearTokens();
    }
  }

  setUser(user: UserResponse = null) {
    if (user) {
      this.user.set(user);
      localStorage.setItem("user", JSON.stringify(user));
      return of(user);
    }
    return this.http.get<UserResponse>(
      `${this.apiUrl}/user/api/v1/auth/profile`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${this.tokenType} ${this.token}`,
        },
        responseType: 'json',
      }
    ).pipe(
      tap((user) => {
        this.user.set(user);
        console.log("SETTING USER IN TAP");
        localStorage.setItem("user", JSON.stringify(user));
      })
    );
  }

  getCurrentUser() {
    return this.user();
  }
}
