import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Journey, Business, AssessmentResult } from '../../models/compass.models';
import { GoogleSignInComponent } from '../../shared/components/google-sign-in/google-sign-in.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleSignInComponent],
  template: `
    <div class="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      <!-- Profile Header -->
      <div class="bg-forest rounded-sheet p-8 text-ivory border border-forest-line shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-forest-deep border-2 border-gold flex items-center justify-center font-serif font-bold text-2xl text-gold">
            <span *ngIf="auth.currentUser()">{{ auth.currentUser()!.name.charAt(0).toUpperCase() }}</span>
            <svg *ngIf="!auth.currentUser()" class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
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
          <a
            *ngIf="auth.isSuperAdmin()"
            routerLink="/admin"
            class="bg-gold hover:bg-gold-soft text-charcoal text-xs font-semibold px-4 py-2 rounded-button shadow transition-colors flex items-center gap-1.5"
          >
            <span>Admin Portal</span>
            <span>→</span>
          </a>
          <button
            *ngIf="auth.currentUser()"
            (click)="onSignOut()"
            class="text-xs font-semibold px-4 py-2 rounded-button border border-rose-400/40 text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{{ lang.isSwahili() ? 'Toka' : 'Sign Out' }}</span>
          </button>
          <a
            *ngIf="!auth.currentUser()"
            routerLink="/login"
            class="bg-gold hover:bg-gold-soft text-charcoal text-xs font-bold px-5 py-2.5 rounded-button shadow transition-colors"
          >
            {{ lang.isSwahili() ? 'Ingia / Fungua Akaunti' : 'Sign In / Create Account' }}
          </a>
        </div>
      </div>

      <!-- Pathfinder Assessment Progress -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Maendlezo ya Tathmini ya Pathfinder' : 'Pathfinder Assessment Progress' }}
          </h2>
          <span class="text-xs text-charcoal/60">
            {{ results.length }} {{ lang.isSwahili() ? 'zimekamilishwa' : 'completed' }}
          </span>
        </div>

        <!-- In-progress questionnaire (autosaved draft) -->
        <div *ngIf="draft && draftAnswered > 0" class="bg-white p-6 rounded-card border border-gold/40 shadow-light-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <span class="text-[10px] font-semibold uppercase tracking-widest text-gold">
                {{ lang.isSwahili() ? 'Inaendelea' : 'In Progress' }}
              </span>
              <h3 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Maswali ya Pathfinder' : 'Pathfinder Questionnaire' }}
              </h3>
              <p class="text-xs text-charcoal/60">
                {{ lang.isSwahili()
                  ? 'Umajibiwa ' + draftAnswered + ' kati ya ' + totalQuestions + ' maswali. Maendlezo yako yamehifadhiwa.'
                  : draftAnswered + ' of ' + totalQuestions + ' questions answered. Your progress is saved automatically.' }}
              </p>
            </div>
            <a
              routerLink="/pathfinder"
              class="bg-gold hover:bg-gold-soft text-charcoal text-xs font-bold px-5 py-2.5 rounded-button shadow transition-colors whitespace-nowrap self-start sm:self-center"
            >
              {{ lang.isSwahili() ? 'Endelea ulipoachia →' : 'Continue where you left off →' }}
            </a>
          </div>

          <div class="w-full bg-forest/10 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gold h-full rounded-full transition-all duration-300" [style.width.%]="draftProgressPercent"></div>
          </div>
        </div>

        <!-- Latest completed assessment: Rich Hero Showcase -->
        <div *ngIf="latestResult as r" class="bg-gradient-to-br from-forest-deep via-forest to-forest rounded-sheet p-6 sm:p-8 text-ivory border-2 border-gold/40 shadow-2xl relative overflow-hidden space-y-6">
          <div class="absolute -top-12 -right-12 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-3 max-w-2xl">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-gold/20 border border-gold/40 text-[11px] font-bold text-gold uppercase tracking-wider">
                  <svg class="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'WASIFU WAKO WA UJASIRIAMALI' : 'YOUR ENTREPRENEUR ARCHETYPE' }}</span>
                </span>
                <span *ngIf="r.createdAt" class="text-xs text-ivory/50">· {{ r.createdAt | date:'mediumDate' }}</span>
              </div>

              <div class="space-y-1">
                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-ivory tracking-tight">
                  {{ lang.isSwahili() ? r.primaryArchetypeSw : r.primaryArchetype }}
                </h3>
                <p class="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans line-clamp-2">
                  {{ r.archetypeSummary }}
                </p>
              </div>

              <!-- Traits pills -->
              <div class="flex flex-wrap gap-2 pt-1">
                <span *ngFor="let trait of r.traitPills" class="px-2.5 py-0.5 rounded-pill bg-forest-deep border border-forest-line/60 text-[11px] text-gold font-medium">
                  {{ trait }}
                </span>
                <span *ngIf="r.secondaryArchetype" class="px-2.5 py-0.5 rounded-pill bg-forest-deep/60 border border-forest-line/40 text-[11px] text-ivory/70">
                  Secondary: {{ lang.isSwahili() ? r.secondaryArchetypeSw : r.secondaryArchetype }}
                </span>
              </div>
            </div>

            <!-- Readiness Ring & Score -->
            <div class="flex sm:flex-col items-center justify-between sm:justify-center p-4 bg-forest-deep/90 rounded-card border border-forest-line/50 min-w-[200px] text-center gap-2">
              <div>
                <span class="font-serif font-bold text-3xl sm:text-4xl text-gold">{{ r.readinessScore }}%</span>
                <span class="block text-[10px] uppercase font-bold text-ivory/60 tracking-wider">Readiness Score</span>
              </div>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-pill bg-gold/15 text-gold border border-gold/30">
                {{ r.riskProfile }} Risk · {{ r.readinessVerdict }}
              </span>
            </div>
          </div>

          <!-- Top Recommendation & Actions Bar -->
          <div class="relative z-10 pt-4 border-t border-forest-line/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div *ngIf="r.topMatches?.length" class="flex items-center gap-2 text-xs">
              <span class="text-ivory/60">{{ lang.isSwahili() ? 'Biashara Iliyopendekezwa Zaidi:' : 'Top Matched Venture:' }}</span>
              <span class="font-bold text-gold underline underline-offset-2">
                {{ lang.isSwahili() ? r.topMatches[0].nameSw : r.topMatches[0].name }}
              </span>
              <span class="text-[11px] text-ivory/40">({{ r.topMatches[0].matchScore }}% match)</span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <a
                [routerLink]="['/results', r._id]"
                class="bg-gradient-to-r from-gold-soft via-gold to-gold-dark hover:brightness-105 text-charcoal font-bold text-xs sm:text-sm px-6 py-2.5 rounded-button shadow-gold-btn transition-all flex items-center gap-2"
              >
                <span>{{ lang.isSwahili() ? 'Fungua Ripoti Kamili ya Matokeo' : 'Open Full Assessment Report' }}</span>
                <span>→</span>
              </a>
              <button
                *ngIf="r.topMatches?.length"
                (click)="onStartPlan(r)"
                class="bg-forest-deep hover:bg-forest border border-forest-line/60 text-ivory text-xs font-semibold px-4 py-2.5 rounded-button transition-colors"
              >
                {{ lang.isSwahili() ? 'Anza Mpango wa Siku 30' : 'Start 30-Day Plan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state: nothing answered yet -->
        <div *ngIf="!draft && results.length === 0" class="bg-white p-8 rounded-card border border-forest-line/10 text-center space-y-3">
          <p class="text-xs text-charcoal/60">
            {{ lang.isSwahili() ? 'Bado hujajibu maswali ya tathmini. Maendlezo yako yataonekapa hapa.' : 'You have not answered the assessment questions yet. Your progress will show up here.' }}
          </p>
          <a routerLink="/pathfinder" class="inline-block text-xs font-semibold text-forest underline">
            {{ lang.isSwahili() ? 'Anza Tathmini ya Pathfinder →' : 'Start the Pathfinder Assessment →' }}
          </a>
        </div>

        <!-- Previous assessments -->
        <div *ngIf="results.length > 1" class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-charcoal/60">
            {{ lang.isSwahili() ? 'Tathmini Zilizotangulia' : 'Previous Assessments' }}
          </h3>
          <div class="bg-white divide-y divide-forest-line/10 rounded-card border border-forest-line/15">
            <div *ngFor="let r of results | slice:1" class="flex items-center justify-between gap-4 p-4">
              <div>
                <p class="font-serif font-bold text-sm text-charcoal">{{ lang.isSwahili() ? r.primaryArchetypeSw : r.primaryArchetype }}</p>
                <p class="text-[11px] text-charcoal/50">
                  {{ r.createdAt | date:'mediumDate' }} · {{ r.readinessScore }}/100 · {{ r.riskProfile }}
                </p>
              </div>
              <a [routerLink]="['/results', r._id]" class="text-xs font-semibold text-forest hover:text-gold whitespace-nowrap">
                {{ lang.isSwahili() ? 'Tazama →' : 'View →' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Tracked Journeys -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Mipango Kazi ya Siku 30 Inayoendelea' : 'Active 30-Day Journeys' }}
          </h2>
          <span class="text-xs text-charcoal/60">{{ journeys.length }} {{ lang.isSwahili() ? 'inayoendelea' : 'active' }}</span>
        </div>

        <div *ngIf="journeys.length === 0" class="bg-white p-8 rounded-card border border-forest-line/10 text-center space-y-3">
          <p class="text-xs text-charcoal/60">
            {{ lang.isSwahili() ? 'Bado hujaanza safari yoyote ya kuanzisha biashara.' : 'You have not started any active business journeys yet.' }}
          </p>
          <a routerLink="/pathfinder" class="inline-block text-xs font-semibold text-forest underline">
            {{ lang.isSwahili() ? 'Fanya Tathmini ya Pathfinder kugundua biashara →' : 'Take Pathfinder Assessment to find matched paths →' }}
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div *ngFor="let j of journeys" class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-semibold uppercase text-gold">
                  {{ lang.isSwahili() ? 'Mpango wa Siku 30' : '30-Day Plan' }}
                </span>
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
                {{ lang.isSwahili() ? 'Fungua Orodha ya Kazi →' : 'Open Checklist →' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Business Paths -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Fursa za Biashara Zilizohifadhiwa' : 'Saved Business Paths' }}
          </h2>
          <span class="text-xs text-charcoal/60">{{ savedBusinesses.length }} {{ lang.isSwahili() ? 'zimehifadhiwa' : 'saved' }}</span>
        </div>

        <div *ngIf="savedBusinesses.length === 0" class="bg-white p-8 rounded-card border border-forest-line/10 text-center space-y-3">
          <p class="text-xs text-charcoal/60">
            {{ lang.isSwahili() ? 'Hakuna fursa zilizohifadhiwa kwa sasa.' : 'No saved paths found.' }}
          </p>
          <a routerLink="/pathfinder" class="inline-block text-xs font-semibold text-forest underline">
            {{ lang.isSwahili() ? 'Gundua na uhifadhi biashara kutoka Pathfinder →' : 'Explore and save businesses from Pathfinder →' }}
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div *ngFor="let b of savedBusinesses" class="bg-white p-5 rounded-card border border-forest-line/15 shadow-light-sm flex items-center justify-between gap-4">
            <div>
              <span class="text-[10px] font-bold uppercase text-gold">
                {{ lang.isSwahili() ? (b.categorySw || b.category) : b.category }}
              </span>
              <h4 class="font-serif font-bold text-base text-charcoal">
                {{ lang.isSwahili() ? (b.nameSw || b.name) : b.name }}
              </h4>
              <p class="text-xs text-charcoal/60 mt-0.5">KES {{ b.capitalRequiredMin | number }} – {{ b.capitalRequiredMax | number }}</p>
            </div>
            <a
              [routerLink]="['/business', b.slug]"
              class="text-xs font-semibold px-3 py-1.5 rounded-button border border-forest-line/20 hover:border-gold text-forest"
            >
              {{ lang.isSwahili() ? 'Tazama →' : 'View →' }}
            </a>
          </div>
        </div>
      </div>

      <!-- Sign In / Register Modal -->
      <div *ngIf="showAuthModal" class="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/70 backdrop-blur-sm p-4">
        <div class="bg-white max-w-md w-full p-8 rounded-sheet shadow-2xl border border-forest-line/20 space-y-6 animate-fadeIn">
          <div class="flex items-center justify-between border-b border-forest-line/10 pb-3">
            <h3 class="font-serif font-bold text-xl text-charcoal">
              {{ isRegisterMode ? (lang.isSwahili() ? 'Fungua Akaunti' : 'Create Account') : (lang.isSwahili() ? 'Karibu Tena' : 'Welcome Back') }}
            </h3>
            <button (click)="showAuthModal = false" class="text-charcoal/50 hover:text-charcoal p-1 rounded-full hover:bg-forest-line/10 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          <div class="space-y-3">
            <app-google-sign-in
              [text]="isRegisterMode ? 'signup_with' : 'signin_with'"
              (signedIn)="onGoogleSuccess()"
              (signInError)="authError = $event?.message || 'Google authentication failed'"
            ></app-google-sign-in>

            <div class="flex items-center my-2">
              <div class="flex-grow border-t border-forest-line/10"></div>
              <span class="px-3 text-xs text-charcoal/40 uppercase font-semibold">
                {{ lang.isSwahili() ? 'Au tumia barua pepe' : 'Or use email' }}
              </span>
              <div class="flex-grow border-t border-forest-line/10"></div>
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

          <div class="text-center pt-2">
            <button (click)="isRegisterMode = !isRegisterMode; authError = ''" class="text-xs text-forest underline font-semibold">
              {{ isRegisterMode 
                ? (lang.isSwahili() ? 'Tayari una akaunti? Ingia' : 'Already have an account? Sign in')
                : (lang.isSwahili() ? 'Huna akaunti? Jisajili' : 'Need an account? Sign up')
              }}
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
  router = inject(Router);
  lang = inject(LanguageService);
  cdr = inject(ChangeDetectorRef);

  journeys: Journey[] = [];
  savedBusinesses: Business[] = [];
  results: AssessmentResult[] = [];
  draft: any = null;
  totalQuestions = 22;

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
      next: res => {
        this.journeys = res || [];
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });

    this.api.getUserResults(userId).subscribe({
      next: res => {
        this.results = res || [];
        if (this.results.length === 0) {
          const cachedResultId = typeof localStorage !== 'undefined' ? localStorage.getItem('compass_last_result_id') : null;
          if (cachedResultId) {
            this.api.getResultById(cachedResultId).subscribe({
              next: cached => {
                if (cached) {
                  this.results = [cached];
                  this.cdr.detectChanges();
                }
              }
            });
          }
        } else if (this.results[0]?._id) {
          localStorage.setItem('compass_last_result_id', this.results[0]._id);
        }
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        const cachedResultId = typeof localStorage !== 'undefined' ? localStorage.getItem('compass_last_result_id') : null;
        if (cachedResultId) {
          this.api.getResultById(cachedResultId).subscribe({
            next: cached => {
              if (cached) {
                this.results = [cached];
                this.cdr.detectChanges();
              }
            }
          });
        }
      }
    });

    this.api.getAssessmentProgress(userId).subscribe({
      next: res => {
        this.draft = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.draft = null;
        this.cdr.detectChanges();
      }
    });

    const user = this.auth.currentUser();
    if (user?.savedPaths && user.savedPaths.length > 0) {
      this.api.getBusinesses().subscribe({
        next: all => {
          this.savedBusinesses = all.filter(b => user.savedPaths.includes(b.slug));
          this.cdr.detectChanges();
        }
      });
    }
  }

  get latestResult(): AssessmentResult | null {
    return this.results.length > 0 ? this.results[0] : null;
  }

  get draftAnswered(): number {
    return this.draft?.answers ? Object.keys(this.draft.answers).length : 0;
  }

  get draftProgressPercent(): number {
    return Math.round((this.draftAnswered / this.totalQuestions) * 100);
  }

  onStartPlan(result: AssessmentResult) {
    const topMatch = result.topMatches?.[0];
    if (!topMatch) return;
    const userId = this.auth.getEffectiveUserId();
    this.api.startJourney(userId, topMatch.businessId).subscribe({
      next: journey => this.router.navigate(['/journey', journey._id]),
      error: err => console.error(err)
    });
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
        next: (res) => {
          if (res?.requires2FA) {
            this.showAuthModal = false;
            this.router.navigate(['/admin']);
            return;
          }
          this.showAuthModal = false;
          this.loadUserData();
        },
        error: err => this.authError = err.error?.message || 'Login failed'
      });
    }
  }

  onGoogleSuccess() {
    this.showAuthModal = false;
    this.authError = '';
    this.loadUserData();
  }

  onSignOut() {
    this.auth.logout();
    this.savedBusinesses = [];
    this.journeys = [];
    this.results = [];
    this.draft = null;
    this.router.navigate(['/login']);
  }
}
