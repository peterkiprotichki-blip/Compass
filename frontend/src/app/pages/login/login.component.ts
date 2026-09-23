import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { GoogleSignInComponent } from '../../shared/components/google-sign-in/google-sign-in.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleSignInComponent],
  template: `
    <div class="min-h-[calc(100vh-5rem)] bg-ivory flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      <!-- Back to home -->
      <div class="w-full max-w-md mb-4 flex items-center justify-between">
        <a routerLink="/" class="text-xs font-semibold text-charcoal/60 hover:text-gold flex items-center gap-1.5 transition-colors">
          <span>←</span>
          <span>{{ lang.isSwahili() ? 'Rudi Nyumbani' : 'Back to Home' }}</span>
        </a>

        <!-- Language Switcher -->
        <button
          (click)="lang.toggleLanguage()"
          type="button"
          class="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white border border-forest-line/20 text-xs font-semibold hover:border-gold transition-colors"
        >
          <span [class.text-gold]="lang.currentLang() === 'en'" [class.text-charcoal/60]="lang.currentLang() !== 'en'">EN</span>
          <span class="text-forest-line/30">|</span>
          <span [class.text-gold]="lang.currentLang() === 'sw'" [class.text-charcoal/60]="lang.currentLang() !== 'sw'">SW</span>
        </button>
      </div>

      <!-- Main Container -->
      <div class="w-full max-w-md bg-white rounded-sheet border border-forest-line/15 shadow-xl p-6 sm:p-10 space-y-6">

        <!-- ================= SCENARIO A: ALREADY SIGNED IN ================= -->
        <div *ngIf="auth.currentUser() as user" class="space-y-6 text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-forest text-gold border-2 border-gold flex items-center justify-center font-serif font-bold text-2xl">
            <img *ngIf="user.avatarUrl" [src]="user.avatarUrl" [alt]="user.name" class="w-full h-full rounded-full object-cover" />
            <span *ngIf="!user.avatarUrl">{{ user.name.charAt(0).toUpperCase() }}</span>
          </div>

          <div class="space-y-1">
            <span class="text-xs uppercase tracking-wider font-bold text-gold">
              {{ lang.isSwahili() ? 'Umeingia Kikamilifu' : 'Currently Signed In' }}
            </span>
            <h2 class="text-2xl font-serif font-bold text-charcoal">{{ user.name }}</h2>
            <p class="text-xs text-charcoal/60">{{ user.email }}</p>
          </div>

          <div class="space-y-3 pt-2">
            <a
              routerLink="/profile"
              class="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-soft text-charcoal font-bold text-sm py-3.5 px-4 rounded-button shadow transition-all"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ lang.isSwahili() ? 'Nenda kwenye Dashibodi Yangu' : 'Go to My Dashboard' }}</span>
            </a>

            <a
              routerLink="/pathfinder"
              class="w-full inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-light text-ivory font-semibold text-sm py-3 px-4 rounded-button transition-all"
            >
              <span>{{ lang.isSwahili() ? 'Anza Tathmini ya Pathfinder' : 'Open Pathfinder Assessment' }}</span>
              <span>→</span>
            </a>

            <button
              (click)="onSignOut()"
              class="w-full inline-flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold text-xs py-3 px-4 rounded-button transition-all"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{{ lang.isSwahili() ? 'Toka kwenye Akaunti (Sign Out)' : 'Sign Out of Account' }}</span>
            </button>
          </div>
        </div>

        <!-- ================= SCENARIO B: SIGN IN / REGISTER FORM ================= -->
        <div *ngIf="!auth.currentUser()" class="space-y-6">
          
          <!-- Header -->
          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-forest text-gold flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 class="text-2xl font-serif font-bold text-charcoal">
              {{ isRegisterMode
                ? (lang.isSwahili() ? 'Fungua Akaunti ya Compass' : 'Create Your Compass Account')
                : (lang.isSwahili() ? 'Karibu Tena kwenye Compass' : 'Welcome Back to Compass')
              }}
            </h1>
            <p class="text-xs text-charcoal/65">
              {{ isRegisterMode
                ? (lang.isSwahili() ? 'Hifadhi safari zako za biashara, mpango kazi na tathmini ya nguvu.' : 'Save your entrepreneurial roadmaps, strengths profile and action plans.')
                : (lang.isSwahili() ? 'Ingia ili uendelee na mipango yako ya kuanzisha au kukuza biashara.' : 'Sign in to access your roadmaps, recommendations and business progress.')
              }}
            </p>
          </div>

          <!-- Mode Toggle Tabs (Sign In / Sign Up) -->
          <div class="flex rounded-button p-1 bg-ivory border border-forest-line/15">
            <button
              type="button"
              (click)="isRegisterMode = false; authError = ''"
              class="w-1/2 py-2 text-xs font-bold rounded-button transition-all"
              [ngClass]="!isRegisterMode ? 'bg-forest text-gold shadow-sm' : 'text-charcoal/60 hover:text-charcoal'"
            >
              {{ lang.isSwahili() ? 'Ingia (Sign In)' : 'Sign In' }}
            </button>
            <button
              type="button"
              (click)="isRegisterMode = true; authError = ''"
              class="w-1/2 py-2 text-xs font-bold rounded-button transition-all"
              [ngClass]="isRegisterMode ? 'bg-forest text-gold shadow-sm' : 'text-charcoal/60 hover:text-charcoal'"
            >
              {{ lang.isSwahili() ? 'Jisajili (Sign Up)' : 'Sign Up' }}
            </button>
          </div>

          <!-- 1. Google 1-Click Authentication -->
          <div class="space-y-3">
            <app-google-sign-in
              [text]="isRegisterMode ? 'signup_with' : 'signin_with'"
              (signedIn)="onGoogleSuccess()"
              (signInError)="authError = $event?.message || 'Google sign-in was cancelled or encountered an error'"
            ></app-google-sign-in>

            <div class="flex items-center my-3">
              <div class="flex-grow border-t border-forest-line/15"></div>
              <span class="px-3 text-[11px] text-charcoal/40 uppercase font-bold tracking-wider">
                {{ lang.isSwahili() ? 'Au tumia barua pepe na nenosiri' : 'Or continue with email' }}
              </span>
              <div class="flex-grow border-t border-forest-line/15"></div>
            </div>
          </div>

          <!-- 2. Email and Password Form -->
          <form (submit)="onSubmit($event)" class="space-y-3.5 text-left">
            <div *ngIf="isRegisterMode" class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Jina Kamili' : 'Full Name' }} *
              </label>
              <input
                type="text"
                [(ngModel)]="authForm.name"
                name="name"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                [placeholder]="lang.isSwahili() ? 'mfano: Wangari Mwangi' : 'e.g. Wangari Mwangi'"
                [required]="isRegisterMode"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Barua Pepe' : 'Email Address' }} *
              </label>
              <input
                type="email"
                [(ngModel)]="authForm.email"
                name="email"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div *ngIf="isRegisterMode" class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Nambari ya Simu (Hiari)' : 'Phone Number (Optional)' }}
              </label>
              <input
                type="tel"
                [(ngModel)]="authForm.phone"
                name="phone"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                [placeholder]="lang.isSwahili() ? 'mfano: 0712 345 678' : 'e.g. 0712 345 678'"
              />
            </div>

            <div class="space-y-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Nenosiri' : 'Password' }} *
              </label>
              <input
                type="password"
                [(ngModel)]="authForm.password"
                name="password"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                [placeholder]="lang.isSwahili() ? 'Weka nenosiri' : 'Enter password'"
                required
              />
            </div>

            <!-- Error Notification -->
            <div *ngIf="authError" class="p-3 rounded-button bg-red-50 border border-red-200 text-xs text-rose-700 font-semibold animate-fadeIn">
              {{ authError }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isSubmitting"
              class="w-full bg-gold hover:bg-gold-soft text-charcoal font-bold text-sm py-3.5 rounded-button shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg *ngIf="isSubmitting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>
                {{ isRegisterMode
                  ? (lang.isSwahili() ? 'Fungua Akaunti Sasa →' : 'Create Free Account →')
                  : (lang.isSwahili() ? 'Ingia kwenye Akaunti →' : 'Sign In to Account →')
                }}
              </span>
            </button>
          </form>

          <!-- Bottom Switcher -->
          <div class="text-center pt-2 border-t border-forest-line/10">
            <button
              type="button"
              (click)="isRegisterMode = !isRegisterMode; authError = ''"
              class="text-xs text-forest hover:text-gold font-semibold transition-colors"
            >
              {{ isRegisterMode
                ? (lang.isSwahili() ? 'Tayari una akaunti? Ingia hapa' : 'Already have an account? Sign in')
                : (lang.isSwahili() ? 'Huna akaunti bado? Jisajili bila malipo' : 'Don\'t have an account? Sign up for free')
              }}
            </button>
          </div>

        </div>

      </div>

    </div>
  `
})
export class LoginComponent implements OnInit {
  auth = inject(AuthService);
  lang = inject(LanguageService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isRegisterMode = false;
  isSubmitting = false;
  authError = '';

  authForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'register' || params['mode'] === 'signup') {
        this.isRegisterMode = true;
      }
    });
  }

  onGoogleSuccess(): void {
    this.authError = '';
    const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/profile';
    this.router.navigateByUrl(redirectUrl);
  }

  onSignOut(): void {
    this.auth.logout();
    this.authError = '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.authForm.email || !this.authForm.password) return;

    this.authError = '';
    this.isSubmitting = true;

    if (this.isRegisterMode) {
      if (!this.authForm.name) {
        this.authError = this.lang.isSwahili() ? 'Tafadhali weka jina lako kamili' : 'Please provide your full name';
        this.isSubmitting = false;
        return;
      }

      this.auth.register({
        name: this.authForm.name,
        email: this.authForm.email,
        phone: this.authForm.phone,
        password: this.authForm.password,
        language: this.lang.currentLang(),
      }).subscribe({
        next: () => {
          this.isSubmitting = false;
          const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/profile';
          this.router.navigateByUrl(redirectUrl);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.authError = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.auth.login(this.authForm.email, this.authForm.password).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res?.requires2FA) {
            this.router.navigate(['/admin']);
            return;
          }
          const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/profile';
          this.router.navigateByUrl(redirectUrl);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.authError = err.error?.message || 'Invalid email or password. Please try again.';
        }
      });
    }
  }
}
