import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserProfile } from '../../models/compass.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api/auth'
    : 'http://localhost:3000/api/auth';
  private readonly userStorageKey = 'compass_user';
  private readonly tokenStorageKey = 'compass_token';
  private readonly guestIdKey = 'compass_guest_id';

  currentUser = signal<UserProfile | null>(null);

  constructor() {
    this.initUser();
  }

  private initUser() {
    const stored = localStorage.getItem(this.userStorageKey);
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(this.userStorageKey);
      }
    }
  }

  getEffectiveUserId(): string {
    if (this.currentUser()) {
      return this.currentUser()!.id;
    }
    let guestId = localStorage.getItem(this.guestIdKey);
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem(this.guestIdKey, guestId);
    }
    return guestId;
  }

  register(data: { name: string; email: string; password?: string; language?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, data).pipe(
      tap(res => {
        if (res?.user) {
          this.currentUser.set(res.user);
          localStorage.setItem(this.userStorageKey, JSON.stringify(res.user));
        }
        if (res?.token) {
          localStorage.setItem(this.tokenStorageKey, res.token);
        }
      })
    );
  }

  login(email: string, password?: string, channel: 'email' | 'sms' = 'email'): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password, channel }).pipe(
      tap(res => {
        if (!res?.requires2FA && res?.user) {
          this.currentUser.set(res.user);
          localStorage.setItem(this.userStorageKey, JSON.stringify(res.user));
        }
        if (res?.token) {
          localStorage.setItem(this.tokenStorageKey, res.token);
        }
      })
    );
  }

  verify2FA(userId: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-2fa`, { userId, otp }).pipe(
      tap(res => {
        if (res?.user) {
          this.currentUser.set(res.user);
          localStorage.setItem(this.userStorageKey, JSON.stringify(res.user));
        }
        if (res?.token) {
          localStorage.setItem(this.tokenStorageKey, res.token);
        }
      })
    );
  }

  resend2FA(userId: string, channel: 'email' | 'sms' = 'email'): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resend-2fa`, { userId, channel });
  }

  isSuperAdmin(): boolean {
    return this.currentUser()?.role === 'super_admin';
  }

  loginWithGoogle(googleData: { googleId: string; email: string; name: string; avatarUrl?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/google`, googleData).pipe(
      tap(res => {
        if (res?.user) {
          this.currentUser.set(res.user);
          localStorage.setItem(this.userStorageKey, JSON.stringify(res.user));
        }
        if (res?.token) {
          localStorage.setItem(this.tokenStorageKey, res.token);
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.userStorageKey);
    localStorage.removeItem(this.tokenStorageKey);
  }

  isSaved(slug: string): boolean {
    const user = this.currentUser();
    if (!user || !user.savedPaths) return false;
    return user.savedPaths.includes(slug);
  }

  updateSavedPaths(paths: string[]) {
    const user = this.currentUser();
    if (user) {
      const updated = { ...user, savedPaths: paths };
      this.currentUser.set(updated);
      localStorage.setItem(this.userStorageKey, JSON.stringify(updated));
    }
  }
}
