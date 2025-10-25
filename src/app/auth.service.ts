import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {
    const userJson = this.cookieService.get('user');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    } else if (this.isLoggedIn()) {
      this.userSubject.next({ token: this.getAccessToken() });
    }
  }

  // ------------------------
  // Token Helpers
  // ------------------------

  setTokens(access: string, refresh: string): void {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, access);
    this.cookieService.set(this.REFRESH_TOKEN_KEY, refresh);
    this.userSubject.next({ token: access });
  }

  getAccessToken(): string | null {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY) || null;
  }

  getRefreshToken(): string | null {
    return this.cookieService.get(this.REFRESH_TOKEN_KEY) || null;
  }

  clearTokens(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY);
    this.cookieService.delete(this.REFRESH_TOKEN_KEY);
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // ------------------------
  // Refresh Token
  // ------------------------

  refreshToken() {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      this.signout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{ access_token: string }>('/api/auth/refresh', {
        refresh_token: refresh,
      })
      .pipe(
        map((res) => {
          const newAccess = res.access_token;
          if (!newAccess) throw new Error('Invalid refresh response');
          this.cookieService.set(this.ACCESS_TOKEN_KEY, newAccess);
          this.userSubject.next({ token: newAccess });
          return newAccess;
        }),
        catchError((err) => {
          this.signout();
          return throwError(() => err);
        })
      );
  }

  // ------------------------
  // Auth Actions
  // ------------------------

  setUser(user: any): void {
    this.userSubject.next(user);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  getRole(): string | null {
    return this.cookieService.get('role') || null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isStaff(): boolean {
    return this.getRole() === 'STAFF';
  }

  signout(): void {
    this.clearTokens();
    this.router.navigate(['/']); // redirect to login page
  }
}
