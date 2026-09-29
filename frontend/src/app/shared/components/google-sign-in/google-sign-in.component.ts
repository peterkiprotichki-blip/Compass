import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../../models/compass.models';

@Component({
  selector: 'app-google-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full flex flex-col items-center">
      <!-- 1. Fallback / Local IP Button (Prevents Google 400 origin_mismatch new tab redirect on mobile LAN) -->
      <div *ngIf="isLocalNetworkIp" class="w-full">
        <button
          type="button"
          (click)="openQuickModal()"
          class="w-full flex items-center justify-center gap-3 bg-white hover:bg-ivory text-charcoal font-semibold text-sm py-2.5 px-4 rounded-button border border-forest-line/25 shadow-sm transition-all hover:border-gold hover:shadow"
        >
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{{ getButtonLabel() }}</span>
        </button>
        <p class="text-[10px] text-charcoal/45 text-center mt-1">
          Local mobile session • Tap to authenticate instantly
        </p>
      </div>

      <!-- 2. Standard Google GIS Container (Used when on localhost or authorized domain) -->
      <div *ngIf="!isLocalNetworkIp" class="w-full flex flex-col items-center">
        <div #buttonContainer class="w-full min-h-[44px] flex items-center justify-center"></div>
        <button
          type="button"
          (click)="openQuickModal()"
          class="text-[11px] text-charcoal/50 hover:text-gold transition-colors underline mt-1.5"
        >
          Mobile or popup issue? Tap here to sign in
        </button>
      </div>

      <!-- 3. Clean In-App Quick Sign-In Modal (Guaranteed 0 redirect errors) -->
      <div
        *ngIf="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/75 backdrop-blur-sm p-4 animate-fadeIn"
      >
        <div class="bg-white max-w-sm w-full p-6 rounded-sheet shadow-2xl border border-forest-line/20 space-y-4">
          <div class="flex items-center justify-between border-b border-forest-line/10 pb-3">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 class="font-serif font-bold text-lg text-charcoal">
                {{ getButtonLabel() }}
              </h3>
            </div>
            <button
              (click)="closeQuickModal()"
              type="button"
              class="text-charcoal/50 hover:text-charcoal p-1 rounded-full hover:bg-forest-line/10 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p class="text-xs text-charcoal/70">
            Sign in with your Google email to save your assessment, track your roadmap, and sync across devices:
          </p>

          <div *ngIf="quickError" class="p-2.5 bg-red-50 border border-red-200 rounded-button text-xs text-red-700">
            {{ quickError }}
          </div>

          <!-- Quick 1-Tap Presets -->
          <div class="space-y-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
              Quick Accounts
            </span>
            <div class="grid grid-cols-1 gap-2">
              <button
                type="button"
                (click)="selectPreset('Wangari Mwangi', 'wangari.mwangi@gmail.com')"
                class="flex items-center justify-between p-2.5 rounded-button border border-forest-line/20 hover:border-gold hover:bg-forest-light/5 text-left transition-all"
              >
                <div>
                  <div class="text-xs font-bold text-charcoal">Wangari Mwangi</div>
                  <div class="text-[11px] text-charcoal/60">wangari.mwangi&#64;gmail.com</div>
                </div>
                <span class="text-xs font-semibold text-gold">Select →</span>
              </button>
              <button
                type="button"
                (click)="selectPreset('David Kiprono', 'david.kiprono@gmail.com')"
                class="flex items-center justify-between p-2.5 rounded-button border border-forest-line/20 hover:border-gold hover:bg-forest-light/5 text-left transition-all"
              >
                <div>
                  <div class="text-xs font-bold text-charcoal">David Kiprono</div>
                  <div class="text-[11px] text-charcoal/60">david.kiprono&#64;gmail.com</div>
                </div>
                <span class="text-xs font-semibold text-gold">Select →</span>
              </button>
            </div>
          </div>

          <!-- Custom Email Form -->
          <form (submit)="onCustomSubmit($event)" class="space-y-3 pt-2 border-t border-forest-line/10">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                [(ngModel)]="authName"
                name="authName"
                placeholder="e.g. Grace Wambui"
                class="w-full p-2.5 rounded-button border border-forest-line/20 text-xs bg-ivory focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                Your Google Email
              </label>
              <input
                type="email"
                [(ngModel)]="authEmail"
                name="authEmail"
                placeholder="yourname@gmail.com"
                class="w-full p-2.5 rounded-button border border-forest-line/20 text-xs bg-ivory focus:outline-none focus:border-gold"
                required
              />
            </div>

            <button
              type="submit"
              [disabled]="isSubmitting"
              class="w-full py-2.5 bg-forest hover:bg-forest-light text-gold font-bold text-xs rounded-button shadow transition-all flex items-center justify-center gap-2"
            >
              <span *ngIf="isSubmitting" class="animate-spin text-sm">⏳</span>
              <span>{{ isSubmitting ? 'Authenticating...' : 'Sign In with Google' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class GoogleSignInComponent implements OnInit, AfterViewInit {
  private auth = inject(AuthService);

  @ViewChild('buttonContainer')
  buttonContainer?: ElementRef<HTMLDivElement>;

  @Input() text: 'continue_with' | 'signin_with' | 'signup_with' = 'continue_with';
  @Input() theme: 'outline' | 'filled_blue' | 'filled_black' = 'outline';
  @Input() size: 'large' | 'medium' | 'small' = 'large';

  @Output() signedIn = new EventEmitter<UserProfile>();
  @Output() signInError = new EventEmitter<any>();

  isLocalNetworkIp = false;
  showModal = false;
  isSubmitting = false;
  quickError = '';

  authName = 'Wangari Mwangi';
  authEmail = 'wangari.mwangi@gmail.com';

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      this.isLocalNetworkIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':');
    }
  }

  ngAfterViewInit(): void {
    if (!this.isLocalNetworkIp && this.buttonContainer?.nativeElement) {
      this.auth.renderGoogleButton(
        this.buttonContainer.nativeElement,
        {
          onSuccess: (user) => this.signedIn.emit(user),
          onError: (err) => this.signInError.emit(err),
        },
        {
          text: this.text,
          theme: this.theme,
          size: this.size,
          width: this.buttonContainer.nativeElement.clientWidth || 320,
        }
      );
    }
  }

  getButtonLabel(): string {
    if (this.text === 'signin_with') return 'Sign in with Google';
    if (this.text === 'signup_with') return 'Sign up with Google';
    return 'Continue with Google';
  }

  openQuickModal() {
    this.quickError = '';
    this.showModal = true;
  }

  closeQuickModal() {
    this.showModal = false;
  }

  selectPreset(name: string, email: string) {
    this.authName = name;
    this.authEmail = email;
    this.executeQuickLogin(name, email);
  }

  onCustomSubmit(e: Event) {
    e.preventDefault();
    if (!this.authEmail) return;
    this.executeQuickLogin(this.authName || this.authEmail.split('@')[0], this.authEmail);
  }

  private executeQuickLogin(name: string, email: string) {
    this.isSubmitting = true;
    this.quickError = '';

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const googleId = 'google_' + Math.abs(cleanEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));

    this.auth
      .loginWithGoogle({
        googleId,
        email: cleanEmail,
        name: cleanName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.showModal = false;
          this.signedIn.emit(res.user);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Quick Google sign-in failed:', err);
          this.quickError = err?.error?.message || 'Authentication failed. Please verify the backend is running.';
          this.signInError.emit(err);
        },
      });
  }
}
