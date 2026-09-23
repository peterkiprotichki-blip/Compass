import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleSignInComponent } from '../google-sign-in/google-sign-in.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GoogleSignInComponent],
  host: {
    class: 'block w-full'
  },
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 w-full bg-forest/95 backdrop-blur-md border-b border-forest-line text-ivory">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Brand Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <img src="brand/compass-mark.png" alt="Compass" class="h-10 w-10 transition-transform duration-300 group-hover:rotate-12">
            <span class="text-2xl font-serif font-bold tracking-tight text-ivory">
              Compass<span class="text-gold">.</span>
            </span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8 text-[15px] font-medium">
            <a routerLink="/" routerLinkActive="text-gold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-gold transition-colors">
              {{ lang.t.navHome }}
            </a>
            <a routerLink="/how-it-works" routerLinkActive="text-gold" class="hover:text-gold transition-colors">
              {{ lang.t.navHowItWorks }}
            </a>
            <a routerLink="/learn" routerLinkActive="text-gold" class="hover:text-gold transition-colors">
              {{ lang.t.navResources }}
            </a>
            <a routerLink="/pricing" routerLinkActive="text-gold" class="hover:text-gold transition-colors">
              {{ lang.t.navPricing }}
            </a>
            <a routerLink="/profile" routerLinkActive="text-gold" class="hover:text-gold transition-colors flex items-center gap-1.5">
              <span>{{ lang.t.navDashboard }}</span>
              <span *ngIf="auth.currentUser()?.savedPaths?.length" class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gold text-charcoal rounded-full">
                {{ auth.currentUser()?.savedPaths?.length }}
              </span>
            </a>
            <a *ngIf="auth.isSuperAdmin()" routerLink="/admin" routerLinkActive="text-gold" class="hover:text-gold transition-colors flex items-center gap-1.5 text-gold font-semibold">
              <span>Admin</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-gold/20 border border-gold/40">Portal</span>
            </a>
          </div>

          <!-- Right actions: Language Switcher, User Dropdown / Sign In, & CTA -->
          <div class="flex items-center space-x-3 sm:space-x-4">
            
            <!-- Language Toggle (EN | SW) -->
            <button
              (click)="lang.toggleLanguage()"
              class="flex items-center bg-forest-deep border border-forest-line px-3 py-1.5 rounded-button text-xs font-semibold uppercase tracking-wider hover:border-gold transition-colors"
              title="Toggle Language"
            >
              <span [class.text-gold]="lang.currentLang() === 'en'" [class.text-ivory/60]="lang.currentLang() !== 'en'">EN</span>
              <span class="mx-1.5 text-forest-line">|</span>
              <span [class.text-gold]="lang.currentLang() === 'sw'" [class.text-ivory/60]="lang.currentLang() !== 'sw'">SW</span>
            </button>

            <!-- User Auth: Logged In Dropdown -->
            <div *ngIf="auth.currentUser() as user" class="relative">
              <button
                (click)="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 bg-forest-deep/80 hover:bg-forest-deep border border-forest-line px-2.5 py-1.5 rounded-button transition-colors"
              >
                <img
                  *ngIf="user.avatarUrl"
                  [src]="user.avatarUrl"
                  [alt]="user.name"
                  class="w-7 h-7 rounded-full object-cover border border-gold/60"
                />
                <div
                  *ngIf="!user.avatarUrl"
                  class="w-7 h-7 rounded-full bg-gold text-charcoal font-bold text-xs flex items-center justify-center uppercase"
                >
                  {{ user.name.charAt(0) }}
                </div>
                <span class="hidden lg:inline text-xs font-semibold text-ivory max-w-[100px] truncate">
                  {{ user.name.split(' ')[0] }}
                </span>
                <svg class="w-3.5 h-3.5 text-ivory/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                *ngIf="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-forest-deep border border-forest-line rounded-card shadow-2xl py-2 z-50 animate-fadeIn"
              >
                <div class="px-4 py-2 border-b border-forest-line/20">
                  <p class="text-xs font-semibold text-ivory truncate">{{ user.name }}</p>
                  <p class="text-[11px] text-ivory/60 truncate">{{ user.email }}</p>
                </div>
                <a
                  (click)="userMenuOpen = false"
                  routerLink="/profile"
                  class="flex items-center gap-2 px-4 py-2 text-xs text-ivory hover:text-gold hover:bg-forest transition-colors"
                >
                  <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Dashibodi Yangu' : 'My Dashboard' }}</span>
                </a>
                <a
                  *ngIf="auth.isSuperAdmin()"
                  (click)="userMenuOpen = false"
                  routerLink="/admin"
                  class="flex items-center gap-2 px-4 py-2 text-xs text-gold hover:bg-forest transition-colors"
                >
                  <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Admin Portal</span>
                </a>
                <button
                  (click)="logout()"
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-forest transition-colors border-t border-forest-line/20 mt-1"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Toka' : 'Sign Out' }}</span>
                </button>
              </div>
            </div>

            <!-- User Auth: Logged Out "Sign In" Button -->
            <button
              *ngIf="!auth.currentUser()"
              (click)="showAuthModal = true; isRegisterMode = false"
              class="hidden sm:inline-flex items-center text-xs font-semibold text-ivory hover:text-gold px-3 py-2 rounded-button border border-forest-line hover:border-gold transition-colors"
            >
              {{ lang.isSwahili() ? 'Ingia' : 'Sign In' }}
            </button>

            <!-- Primary Action Button -->
            <a
              routerLink="/pathfinder"
              class="hidden sm:inline-flex items-center justify-center bg-gold hover:bg-gold-soft text-charcoal font-semibold text-[15px] px-6 py-2.5 rounded-button shadow-md transition-all duration-200 hover:shadow-gold-glow"
            >
              <span>{{ lang.t.navGetStarted }}</span>
              <svg class="w-4 h-4 ml-1.5 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>

            <!-- Mobile menu button toggle -->
            <button
              (click)="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-ivory hover:text-gold focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg *ngIf="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div *ngIf="mobileMenuOpen" class="md:hidden bg-forest-deep border-b border-forest-line px-4 pt-3 pb-6 space-y-3 animate-fadeIn max-h-[calc(100dvh-5rem)] overflow-y-auto shadow-2xl">
        <!-- Logged in user info header in mobile menu -->
        <div *ngIf="auth.currentUser() as user" class="p-3 bg-forest rounded-card border border-forest-line/30 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              *ngIf="user.avatarUrl"
              [src]="user.avatarUrl"
              [alt]="user.name"
              class="w-9 h-9 rounded-full object-cover border border-gold"
            />
            <div *ngIf="!user.avatarUrl" class="w-9 h-9 rounded-full bg-gold text-charcoal font-bold flex items-center justify-center text-sm">
              {{ user.name.charAt(0) }}
            </div>
            <div>
              <p class="text-xs font-semibold text-ivory">{{ user.name }}</p>
              <p class="text-[11px] text-ivory/60">{{ user.email }}</p>
            </div>
          </div>
          <button (click)="logout()" class="text-xs text-rose-400 underline font-semibold">
            {{ lang.isSwahili() ? 'Toka' : 'Sign Out' }}
          </button>
        </div>

        <a (click)="mobileMenuOpen = false" routerLink="/" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navHome }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/how-it-works" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navHowItWorks }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/learn" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navResources }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/pricing" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navPricing }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/profile" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navDashboard }}
        </a>
        <a *ngIf="auth.isSuperAdmin()" (click)="mobileMenuOpen = false" routerLink="/admin" class="block text-gold hover:underline py-2 font-medium">
          Admin Portal
        </a>

        <!-- Sign In Button for Mobile if logged out -->
        <div *ngIf="!auth.currentUser()" class="pt-2">
          <button
            (click)="mobileMenuOpen = false; showAuthModal = true; isRegisterMode = false"
            class="w-full flex items-center justify-center border border-gold text-gold hover:bg-gold/10 font-semibold py-2.5 rounded-button transition-colors text-sm"
          >
            {{ lang.isSwahili() ? 'Ingia / Fungua Akaunti' : 'Sign In / Register' }}
          </button>
        </div>

        <div class="pt-1">
          <a
            (click)="mobileMenuOpen = false"
            routerLink="/pathfinder"
            class="w-full flex items-center justify-center bg-gold text-charcoal font-semibold py-3 rounded-button shadow"
          >
            {{ lang.t.navGetStarted }}
          </a>
        </div>
      </div>
    </nav>

    <!-- Layout Flow Spacer for Fixed Navbar -->
    <div class="h-20 w-full" aria-hidden="true"></div>

    <!-- Sign In / Register Modal Accessible Across the Entire App -->
    <div *ngIf="showAuthModal" class="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/75 backdrop-blur-sm p-4">
      <div class="bg-white max-w-md w-full p-6 sm:p-8 rounded-sheet shadow-2xl border border-forest-line/20 space-y-5 animate-fadeIn">
        <div class="flex items-center justify-between border-b border-forest-line/10 pb-3">
          <h3 class="font-serif font-bold text-xl text-charcoal">
            {{ isRegisterMode ? (lang.isSwahili() ? 'Fungua Akaunti' : 'Create Account') : (lang.isSwahili() ? 'Karibu Tena' : 'Welcome Back') }}
          </h3>
          <button (click)="showAuthModal = false" class="text-charcoal/50 hover:text-charcoal p-1 rounded-full hover:bg-forest-line/10 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 1-Click Google Sign In -->
        <div class="space-y-3">
          <app-google-sign-in
            [text]="isRegisterMode ? 'signup_with' : 'signin_with'"
            (signedIn)="onGoogleSuccess()"
            (signInError)="authError = $event?.message || 'Google authentication failed'"
          ></app-google-sign-in>

          <div class="flex items-center my-2">
            <div class="flex-grow border-t border-forest-line/15"></div>
            <span class="px-3 text-xs text-charcoal/40 uppercase font-semibold">
              {{ lang.isSwahili() ? 'Au tumia barua pepe' : 'Or use email' }}
            </span>
            <div class="flex-grow border-t border-forest-line/15"></div>
          </div>
        </div>

        <form (submit)="onAuthSubmit($event)" class="space-y-4">
          <div *ngIf="isRegisterMode" class="space-y-1">
            <label class="text-xs font-semibold uppercase text-charcoal">
              {{ lang.isSwahili() ? 'Jina Kamili' : 'Full Name' }}
            </label>
            <input type="text" [(ngModel)]="authForm.name" name="name" class="w-full p-3 rounded-button border bg-ivory text-sm" required />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold uppercase text-charcoal">
              {{ lang.isSwahili() ? 'Barua Pepe' : 'Email Address' }}
            </label>
            <input type="email" [(ngModel)]="authForm.email" name="email" class="w-full p-3 rounded-button border bg-ivory text-sm" required />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold uppercase text-charcoal">
              {{ lang.isSwahili() ? 'Nenosiri' : 'Password' }}
            </label>
            <input type="password" [(ngModel)]="authForm.password" name="password" class="w-full p-3 rounded-button border bg-ivory text-sm" required />
          </div>

          <p *ngIf="authError" class="text-xs text-rose-600 font-semibold">{{ authError }}</p>

          <button type="submit" class="w-full bg-gold hover:bg-gold-soft font-semibold text-xs py-3.5 rounded-button shadow transition-colors text-charcoal">
            {{ isRegisterMode ? (lang.isSwahili() ? 'Fungua Akaunti' : 'Create Account') : (lang.isSwahili() ? 'Ingia' : 'Sign In') }}
          </button>
        </form>

        <div class="text-center pt-1">
          <button (click)="isRegisterMode = !isRegisterMode; authError = ''" class="text-xs text-forest underline font-semibold">
            {{ isRegisterMode 
              ? (lang.isSwahili() ? 'Tayari una akaunti? Ingia' : 'Already have an account? Sign in')
              : (lang.isSwahili() ? 'Huna akaunti? Jisajili' : 'Need an account? Sign up')
            }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  router = inject(Router);

  mobileMenuOpen = false;
  userMenuOpen = false;
  showAuthModal = false;
  isRegisterMode = false;
  authError = '';

  authForm = {
    name: '',
    email: '',
    password: '',
  };

  onGoogleSuccess() {
    this.showAuthModal = false;
    this.authError = '';
  }

  onAuthSubmit(event: Event) {
    event.preventDefault();
    this.authError = '';

    if (this.isRegisterMode) {
      this.auth.register(this.authForm).subscribe({
        next: () => {
          this.showAuthModal = false;
        },
        error: (err: any) => this.authError = err.error?.message || 'Registration failed'
      });
    } else {
      this.auth.login(this.authForm.email, this.authForm.password).subscribe({
        next: (res: any) => {
          if (res?.requires2FA) {
            this.showAuthModal = false;
            this.router.navigate(['/admin']);
            return;
          }
          this.showAuthModal = false;
        },
        error: (err: any) => this.authError = err.error?.message || 'Login failed'
      });
    }
  }

  logout() {
    this.auth.logout();
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
  }
}
