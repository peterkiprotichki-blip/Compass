import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Journey, Business } from '../../models/compass.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      <!-- Profile Header -->
      <div class="bg-forest rounded-sheet p-8 text-ivory border border-forest-line shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-forest-deep border-2 border-gold flex items-center justify-center font-serif font-bold text-2xl text-gold">
            {{ auth.currentUser() ? auth.currentUser()!.name.charAt(0).toUpperCase() : '👤' }}
          </div>
          <div>
            <h1 class="text-2xl font-serif font-bold text-ivory">
              {{ auth.currentUser() ? auth.currentUser()!.name : 'Entrepreneur Workspace' }}
            </h1>
            <p class="text-xs text-ivory/60">
              {{ auth.currentUser() ? auth.currentUser()!.email : 'Session ID: ' + auth.getEffectiveUserId() }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            *ngIf="auth.currentUser()"
            (click)="auth.logout()"
            class="text-xs font-semibold px-4 py-2 rounded-button border border-forest-line text-ivory/80 hover:text-ivory"
          >
            Sign Out
          </button>
          <button
            *ngIf="!auth.currentUser()"
            (click)="showAuthModal = true"
            class="bg-gold hover:bg-gold-soft text-charcoal text-xs font-semibold px-5 py-2.5 rounded-button shadow transition-colors"
          >
            Save Account / Sign In
          </button>
        </div>
      </div>

      <!-- Active Tracked Journeys -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            Active 30-Day Journeys
          </h2>
          <span class="text-xs text-charcoal/60">{{ journeys.length }} active</span>
        </div>

        <div *ngIf="journeys.length === 0" class="bg-white p-8 rounded-card border border-forest-line/10 text-center space-y-3">
          <p class="text-xs text-charcoal/60">You have not started any active business journeys yet.</p>
          <a routerLink="/pathfinder" class="inline-block text-xs font-semibold text-forest underline">
            Take Pathfinder Assessment to find matched paths →
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div *ngFor="let j of journeys" class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-semibold uppercase text-gold">30-Day Plan</span>
                <h3 class="font-serif font-bold text-lg text-charcoal">{{ j.businessName }}</h3>
              </div>
              <span class="font-serif font-bold text-base text-forest">{{ j.progressPercentage }}%</span>
            </div>

            <div class="w-full bg-forest/10 rounded-full h-1.5 overflow-hidden">
              <div class="bg-gold h-full rounded-full" [style.width.%]="j.progressPercentage"></div>
            </div>

            <div class="pt-2 flex justify-end">
              <a
                [routerLink]="['/journey', j._id]"
                class="bg-forest hover:bg-forest-deep text-ivory text-xs font-semibold px-4 py-2 rounded-button shadow transition-colors"
              >
                Open Checklist →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Business Paths -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            Saved Business Paths
          </h2>
          <span class="text-xs text-charcoal/60">{{ savedBusinesses.length }} saved</span>
        </div>

        <div *ngIf="savedBusinesses.length === 0" class="bg-white p-8 rounded-card border border-forest-line/10 text-center space-y-3">
          <p class="text-xs text-charcoal/60">No saved paths found.</p>
          <a routerLink="/pathfinder" class="inline-block text-xs font-semibold text-forest underline">
            Explore and save businesses from Pathfinder →
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div *ngFor="let b of savedBusinesses" class="bg-white p-5 rounded-card border border-forest-line/15 shadow-light-sm flex items-center justify-between gap-4">
            <div>
              <span class="text-[10px] font-bold uppercase text-gold">{{ b.category }}</span>
              <h4 class="font-serif font-bold text-base text-charcoal">{{ b.name }}</h4>
              <p class="text-xs text-charcoal/60 mt-0.5">KES {{ b.capitalRequiredMin | number }} – {{ b.capitalRequiredMax | number }}</p>
            </div>
            <a
              [routerLink]="['/business', b.slug]"
              class="text-xs font-semibold px-3 py-1.5 rounded-button border border-forest-line/20 hover:border-gold text-forest"
            >
              View →
            </a>
          </div>
        </div>
      </div>

      <!-- Sign In / Register Modal -->
      <div *ngIf="showAuthModal" class="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/70 backdrop-blur-sm p-4">
        <div class="bg-white max-w-md w-full p-8 rounded-sheet shadow-2xl border border-forest-line/20 space-y-6 animate-fadeIn">
          <div class="flex items-center justify-between border-b border-forest-line/10 pb-3">
            <h3 class="font-serif font-bold text-xl text-charcoal">
              {{ isRegisterMode ? 'Create Account' : 'Welcome Back' }}
            </h3>
            <button (click)="showAuthModal = false" class="text-charcoal/50 hover:text-charcoal text-lg font-bold">
              ✕
            </button>
          </div>

          <form (submit)="onAuthSubmit($event)" class="space-y-4">
            <div *ngIf="isRegisterMode" class="space-y-1">
              <label class="text-xs font-semibold uppercase text-charcoal">Full Name</label>
              <input type="text" [(ngModel)]="authForm.name" name="name" class="w-full p-3 rounded-button border bg-ivory text-sm" required />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold uppercase text-charcoal">Email Address</label>
              <input type="email" [(ngModel)]="authForm.email" name="email" class="w-full p-3 rounded-button border bg-ivory text-sm" required />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold uppercase text-charcoal">Password</label>
              <input type="password" [(ngModel)]="authForm.password" name="password" class="w-full p-3 rounded-button border bg-ivory text-sm" required />
            </div>

            <p *ngIf="authError" class="text-xs text-rose-600 font-semibold">{{ authError }}</p>

            <button type="submit" class="w-full bg-gold hover:bg-gold-soft font-semibold text-xs py-3.5 rounded-button shadow transition-colors text-charcoal">
              {{ isRegisterMode ? 'Create Account' : 'Sign In' }}
            </button>
          </form>

          <div class="text-center pt-2">
            <button (click)="isRegisterMode = !isRegisterMode; authError = ''" class="text-xs text-forest underline font-semibold">
              {{ isRegisterMode ? 'Already have an account? Sign in' : 'Need an account? Sign up' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  api = inject(ApiService);
  lang = inject(LanguageService);

  journeys: Journey[] = [];
  savedBusinesses: Business[] = [];

  showAuthModal = false;
  isRegisterMode = false;
  authError = '';
  authForm = {
    name: '',
    email: '',
    password: '',
  };

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = this.auth.getEffectiveUserId();
    this.api.getUserJourneys(userId).subscribe({
      next: res => this.journeys = res,
      error: err => console.error(err)
    });

    const user = this.auth.currentUser();
    if (user?.savedPaths && user.savedPaths.length > 0) {
      this.api.getBusinesses().subscribe({
        next: all => {
          this.savedBusinesses = all.filter(b => user.savedPaths.includes(b.slug));
        }
      });
    }
  }

  onAuthSubmit(event: Event) {
    event.preventDefault();
    this.authError = '';
    if (this.isRegisterMode) {
      this.auth.register(this.authForm).subscribe({
        next: () => {
          this.showAuthModal = false;
          this.loadUserData();
        },
        error: err => this.authError = err.error?.message || 'Registration failed'
      });
    } else {
      this.auth.login(this.authForm.email, this.authForm.password).subscribe({
        next: () => {
          this.showAuthModal = false;
          this.loadUserData();
        },
        error: err => this.authError = err.error?.message || 'Login failed'
      });
    }
  }
}
