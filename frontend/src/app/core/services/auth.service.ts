import { Injectable, signal, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { UserProfile } from '../../models/compass.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private baseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api/auth'
    : 'http://localhost:3000/api/auth';
  private readonly userStorageKey = 'compass_user';
  private readonly tokenStorageKey = 'compass_token';
  private readonly guestIdKey = 'compass_guest_id';

  private cachedGoogleClientId: string | null = null;
  currentUser = signal<UserProfile | null>(null);

  constructor() {
    this.initUser();
  }

  getAuthConfig(): Observable<{ googleClientId: string }> {
    if (this.cachedGoogleClientId !== null) {
      return of({ googleClientId: this.cachedGoogleClientId });
    }
    return this.http.get<{ googleClientId: string }>(`${this.baseUrl}/config`).pipe(
      tap(cfg => {
        this.cachedGoogleClientId = cfg?.googleClientId || '';
      }),
      catchError(() => of({ googleClientId: '' }))
    );
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

  register(data: { name: string; email: string; phone?: string; password?: string; language?: string }): Observable<any> {
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

  loginWithGoogle(payload: {
    credential?: string;
    googleId?: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/google`, payload).pipe(
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

  renderGoogleButton(
    container: HTMLElement,
    callbacks: {
      onSuccess: (user: UserProfile) => void;
      onError?: (err: any) => void;
    },
    buttonOptions?: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with';
      width?: number;
    }
  ) {
    if (!container) return;

    this.getAuthConfig().subscribe({
      next: (config) => {
        const clientId = config.googleClientId;
        const google = typeof window !== 'undefined' ? (window as any).google : null;

        if (clientId && google?.accounts?.id) {
          try {
            google.accounts.id.initialize({
              client_id: clientId,
              callback: (response: any) => {
                this.ngZone.run(() => {
                  if (response?.credential) {
                    this.loginWithGoogle({ credential: response.credential }).subscribe({
                      next: (res) => callbacks.onSuccess(res.user),
                      error: (err) => callbacks.onError?.(err) || console.error('Google Sign-In failed', err),
                    });
                  }
                });
              },
            });

            container.innerHTML = '';
            google.accounts.id.renderButton(container, {
              type: 'standard',
              theme: buttonOptions?.theme || 'outline',
              size: buttonOptions?.size || 'large',
              text: buttonOptions?.text || 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: buttonOptions?.width || Math.min(container.clientWidth || 300, 360),
            });
            return;
          } catch (e) {
            console.warn('Google Identity Services renderButton failed:', e);
          }
        }

        // Fallback button if clientId not configured or script blocked
        this.renderFallbackGoogleButton(container, callbacks, buttonOptions);
      },
      error: () => {
        this.renderFallbackGoogleButton(container, callbacks, buttonOptions);
      }
    });
  }

  private renderFallbackGoogleButton(
    container: HTMLElement,
    callbacks: {
      onSuccess: (user: UserProfile) => void;
      onError?: (err: any) => void;
    },
    buttonOptions?: {
      text?: 'signin_with' | 'signup_with' | 'continue_with';
    }
  ) {
    if (!container) return;
    container.innerHTML = '';

    const labelText =
      buttonOptions?.text === 'signin_with'
        ? 'Sign in with Google'
        : buttonOptions?.text === 'signup_with'
        ? 'Sign up with Google'
        : 'Continue with Google';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'w-full flex items-center justify-center gap-3 bg-white hover:bg-ivory text-charcoal font-semibold text-sm py-3 px-4 rounded-button border border-forest-line/25 shadow-sm transition-all hover:border-gold';
    btn.innerHTML = `
      <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
      <span>${labelText}</span>
    `;

    btn.onclick = () => {
      this.ngZone.run(() => {
        const email = window.prompt(
          'Google Cloud OAuth client ID is not configured yet in .env.\nEnter your Google email to test sign-in flow:',
          'entrepreneur@gmail.com'
        );
        if (!email) return;

        const namePart = email.split('@')[0].replace(/[._]/g, ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        this.loginWithGoogle({
          googleId: 'google_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
          email: email,
          name: formattedName,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
        }).subscribe({
          next: (res) => callbacks.onSuccess(res.user),
          error: (err) => callbacks.onError?.(err) || console.error(err),
        });
      });
    };

    container.appendChild(btn);
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
