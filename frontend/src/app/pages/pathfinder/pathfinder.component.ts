import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService, LanguageCode } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import {
  QuestionDefinition,
  AssessmentResult,
} from '../../models/compass.models';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { OptionRowComponent } from '../../shared/components/option-row/option-row.component';
import { ScoreRingComponent } from '../../shared/components/score-ring/score-ring.component';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { WeekBlockComponent } from '../../shared/components/week-block/week-block.component';
import { GoogleSignInComponent } from '../../shared/components/google-sign-in/google-sign-in.component';
import confetti from 'canvas-confetti';

type FlowScreen = 'SPLASH' | 'LANGUAGE' | 'JOURNEY' | 'QUESTIONS' | 'ACCOUNT_GATE' | 'ANALYSIS' | 'RESULTS';

@Component({
  selector: 'app-pathfinder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProgressBarComponent,
    OptionRowComponent,
    ScoreRingComponent,
    MatchCardComponent,
    WeekBlockComponent,
    GoogleSignInComponent,
  ],
  template: `
    <div class="min-h-screen" [ngClass]="currentScreen === 'SPLASH' || currentScreen === 'ANALYSIS' ? 'bg-forest text-ivory' : 'bg-ivory text-charcoal'">
      
      <!-- ================= 1. SPLASH SCREEN ================= -->
      <div *ngIf="currentScreen === 'SPLASH'" class="min-h-[calc(100dvh-5rem)] bg-forest text-ivory flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden animate-fadeIn">
        <!-- Subtle background accents -->
        <div class="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gold/15 blur-3xl pointer-events-none"></div>

        <div class="w-full max-w-md flex flex-col items-center text-center space-y-4 sm:space-y-6 relative z-10 my-auto">
          <!-- Animated Compass Logo -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-pulse"></div>
            <img src="brand/compass-mark.png" alt="Compass" class="w-16 h-16 sm:w-20 sm:h-20 animate-spin-slow">
          </div>

          <div class="space-y-1.5 sm:space-y-2">
            <h1 class="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-ivory">
              Compass<span class="text-gold">.</span>
            </h1>

            <p class="text-base sm:text-lg text-ivory/85 font-normal max-w-xs sm:max-w-sm mx-auto">
              {{ lang.isSwahili() ? 'Mwongozo leo. Kesho yenye mwangaza zaidi.' : 'Guidance today. Brighter tomorrows.' }}
            </p>

            <p class="text-[11px] sm:text-xs uppercase tracking-widest text-gold font-semibold">
              {{ lang.isSwahili() ? 'Kwa Wajasiriamali wa Afrika' : 'For African Entrepreneurs · At Every Stage' }}
            </p>
          </div>

          <!-- Prominent Centered CTA Button -->
          <div class="w-full max-w-sm pt-2 space-y-4">
            <button
              (click)="goToScreen('LANGUAGE')"
              class="w-full bg-gold hover:bg-gold-soft text-charcoal font-bold text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-button shadow-lg hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 group"
            >
              <span>{{ lang.isSwahili() ? 'Anza Safari Yako' : 'Start Pathfinder' }}</span>
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>

            <!-- Quick Trust / Value Highlights -->
            <div class="grid grid-cols-3 gap-2 w-full pt-3 border-t border-forest-line/50 text-center">
              <div class="flex flex-col items-center gap-1 text-[11px] text-ivory/70">
                <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ lang.isSwahili() ? 'Dakika 5' : '5 Minutes' }}</span>
              </div>
              <div class="flex flex-col items-center gap-1 text-[11px] text-ivory/70 border-x border-forest-line/40 px-1">
                <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ lang.isSwahili() ? 'Biashara 3 Bora' : 'Top 3 Matches' }}</span>
              </div>
              <div class="flex flex-col items-center gap-1 text-[11px] text-ivory/70">
                <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{{ lang.isSwahili() ? 'Mpango Siku 30' : '30-Day Plan' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 2. LANGUAGE SELECTION ================= -->
      <div *ngIf="currentScreen === 'LANGUAGE'" class="min-h-screen flex flex-col justify-center items-center p-6 bg-ivory animate-fadeIn">
        <div class="w-full max-w-md bg-white p-8 rounded-sheet border border-forest-line/15 shadow-light-lg space-y-6">
          
          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-forest text-gold flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              Choose your language
            </h2>
            <p class="text-xs text-charcoal/60">
              Chagua lugha unayopendelea kutumia
            </p>
          </div>

          <div class="space-y-3">
            <button
              (click)="selectLanguage('en')"
              class="w-full p-4 rounded-button border text-left flex items-center justify-between transition-all"
              [ngClass]="{
                'border-gold bg-ivory shadow-sm ring-1 ring-gold': lang.currentLang() === 'en',
                'border-forest/15 hover:border-forest/30': lang.currentLang() !== 'en'
              }"
            >
              <div>
                <p class="font-bold text-charcoal">English</p>
                <p class="text-xs text-charcoal/60">Clear & practical entrepreneur guidance</p>
              </div>
              <span *ngIf="lang.currentLang() === 'en'" class="text-gold font-bold">✓</span>
            </button>

            <button
              (click)="selectLanguage('sw')"
              class="w-full p-4 rounded-button border text-left flex items-center justify-between transition-all"
              [ngClass]="{
                'border-gold bg-ivory shadow-sm ring-1 ring-gold': lang.currentLang() === 'sw',
                'border-forest/15 hover:border-forest/30': lang.currentLang() !== 'sw'
              }"
            >
              <div>
                <p class="font-bold text-charcoal">Kiswahili</p>
                <p class="text-xs text-charcoal/60">Mwongozo sahihi wa kibiashara kwa Kiswahili</p>
              </div>
              <span *ngIf="lang.currentLang() === 'sw'" class="text-gold font-bold">✓</span>
            </button>
          </div>

          <button
            (click)="goToScreen('JOURNEY')"
            class="w-full bg-gold hover:bg-gold-soft text-charcoal font-semibold text-sm py-3.5 rounded-button shadow transition-colors"
          >
            {{ lang.t.btnContinue }}
          </button>

        </div>
      </div>

      <!-- ================= 3. CHOOSE JOURNEY ================= -->
      <div *ngIf="currentScreen === 'JOURNEY'" class="min-h-screen flex flex-col justify-center items-center p-6 bg-ivory animate-fadeIn">
        <div class="w-full max-w-xl space-y-6">
          
          <div class="text-center space-y-2">
            <span class="text-xs uppercase tracking-widest text-gold font-bold">
              {{ lang.isSwahili() ? 'Hatua ya Kwanza' : 'Step 1 of Journey' }}
            </span>
            <h2 class="text-3xl font-serif font-bold text-charcoal">
              {{ lang.isSwahili() ? 'Unajaribu kufanya nini leo?' : 'What are you trying to do today?' }}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div
              (click)="onChooseJourney('START')"
              class="bg-white p-6 rounded-sheet border-2 border-gold shadow-light-md cursor-pointer hover:scale-[1.02] transition-transform space-y-3"
            >
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                  <polygon points="12 8 16 16 8 16" fill="currentColor" opacity="0.8" />
                </svg>
              </div>
              <h3 class="font-serif font-bold text-xl text-charcoal">
                {{ lang.t.btnStartMyBusiness }}
              </h3>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() ? 'Gundua biashara inayokufaa kupitia maswali 22 ya tathmini.' : 'Find the right business for you based on strengths, capital and goals.' }}
              </p>
              <div class="pt-2">
                <span class="text-xs font-bold text-forest flex items-center gap-1">
                  {{ lang.isSwahili() ? 'Anza Tathmini →' : 'Start Pathfinder →' }}
                </span>
              </div>
            </div>

            <div
              (click)="onChooseJourney('GROW')"
              class="bg-white p-6 rounded-sheet border border-forest/20 shadow-light-sm cursor-pointer hover:scale-[1.02] transition-transform space-y-3"
            >
              <div class="w-10 h-10 rounded-full bg-ivory-sunk text-forest flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 class="font-serif font-bold text-xl text-charcoal">
                {{ lang.t.btnGrowMyBusiness }}
              </h3>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() ? 'Kwa watu ambao tayari wanafanya biashara na wanataka utatuzi.' : 'For existing business owners seeking diagnostics and growth recommendations.' }}
              </p>
              <div class="pt-2">
                <span class="text-xs font-bold text-charcoal/60 flex items-center gap-1">
                  {{ lang.isSwahili() ? 'Fanya Utatuzi →' : 'Diagnose & Scale →' }}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= 4. ACCOUNT CREATION & GOOGLE SIGN-IN GATE (UPFRONT) ================= -->
      <div *ngIf="currentScreen === 'ACCOUNT_GATE'" class="min-h-screen flex flex-col justify-center items-center p-6 bg-ivory animate-fadeIn">
        <div class="w-full max-w-md bg-white p-6 sm:p-10 rounded-sheet border border-forest-line/15 shadow-light-lg space-y-6">
          
          <!-- Top Bar: Back to Journey & Language Toggle -->
          <div class="flex items-center justify-between pb-2 border-b border-forest-line/10">
            <button
              (click)="goToScreen('JOURNEY')"
              type="button"
              class="text-xs font-semibold text-charcoal/60 hover:text-gold flex items-center gap-1 transition-colors"
            >
              <span>←</span>
              <span>{{ lang.isSwahili() ? 'Badili chaguo' : 'Back' }}</span>
            </button>
            <button
              (click)="lang.toggleLanguage()"
              type="button"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-ivory border border-forest-line/20 text-xs font-semibold hover:border-gold transition-colors"
            >
              <span [class.text-gold]="lang.currentLang() === 'en'" [class.text-charcoal/60]="lang.currentLang() !== 'en'">EN</span>
              <span class="text-forest-line/30">|</span>
              <span [class.text-gold]="lang.currentLang() === 'sw'" [class.text-charcoal/60]="lang.currentLang() !== 'sw'">SW</span>
            </button>
          </div>

          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-forest text-gold flex items-center justify-center">
              <svg *ngIf="selectedJourneyType === 'START'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg *ngIf="selectedJourneyType === 'GROW'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              {{ selectedJourneyType === 'GROW'
                ? (isLoginMode ? (lang.isSwahili() ? 'Ingia Kukuza Biashara Yako' : 'Sign In to Diagnose & Scale') : (lang.isSwahili() ? 'Fungua Akaunti Kukuza Biashara' : 'Create Account to Diagnose & Scale'))
                : (isLoginMode ? (lang.isSwahili() ? 'Karibu Tena kwenye Compass' : 'Welcome Back to Compass') : (lang.isSwahili() ? 'Tengeneza Wasifu Wako Kuanza' : 'Create Your Profile to Get Started'))
              }}
            </h2>
            <p class="text-xs text-charcoal/65">
              {{ selectedJourneyType === 'GROW'
                ? (lang.isSwahili() ? 'Weka taarifa zako au ingia na Google ili kuanza utatuzi, kuhifadhi mahesabu ya mauzo na kufungua mwongozo wa kukuza biashara.' : 'Sign in or create your profile to start your business diagnosis, track daily profit, and scale operations.')
                : (isLoginMode
                  ? (lang.isSwahili() ? 'Ingia ili kuendelea na safari yako na kufungua mapendekezo yako.' : 'Log in to continue your assessment and view your personalized roadmap.')
                  : (lang.isSwahili() ? 'Weka taarifa zako ili tuhifadhi majibu yako, tathmini ya nguvu na mwongozo wa siku 30.' : 'Save your progress upfront, track your strengths, and secure your personalized 30-day action plan.'))
              }}
            </p>
          </div>

          <!-- Quick One-Click Google Sign In Button -->
          <div class="space-y-3">
            <app-google-sign-in
              [text]="isLoginMode ? 'signin_with' : 'signup_with'"
              (signedIn)="onGoogleUserAuthenticated($event)"
              (signInError)="onGoogleSignInError($event)"
            ></app-google-sign-in>

            <div class="flex items-center my-3">
              <div class="flex-grow border-t border-forest-line/10"></div>
              <span class="px-3 text-xs text-charcoal/40 uppercase font-semibold">
                {{ lang.isSwahili() ? 'Au tumia barua pepe' : 'Or use email' }}
              </span>
              <div class="flex-grow border-t border-forest-line/10"></div>
            </div>

            <!-- Email Registration Form -->
            <form (submit)="onEmailRegister($event)" class="space-y-3 text-left">
              <div *ngIf="!isLoginMode">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                  {{ lang.isSwahili() ? 'Jina Kamili' : 'Your Full Name' }} *
                </label>
                <input type="text" [(ngModel)]="accountForm.name" name="name" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" [placeholder]="lang.isSwahili() ? 'mfano: Wangari Mwangi' : 'e.g. Wangari Mwangi'" [required]="!isLoginMode" />
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                  {{ lang.isSwahili() ? 'Barua Pepe' : 'Email Address' }} *
                </label>
                <input type="email" [(ngModel)]="accountForm.email" name="email" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" placeholder="you@gmail.com" required />
              </div>

              <div *ngIf="!isLoginMode">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                  {{ lang.isSwahili() ? 'Nambari ya Simu (M-Pesa / SMS)' : 'Phone Number (Optional)' }}
                </label>
                <input type="tel" [(ngModel)]="accountForm.phone" name="phone" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" [placeholder]="lang.isSwahili() ? 'mfano: 0712 345 678' : 'e.g. 0712 345 678'" />
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
                  {{ lang.isSwahili() ? 'Nenosiri' : 'Password' }}
                </label>
                <input type="password" [(ngModel)]="accountForm.password" name="password" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" [placeholder]="lang.isSwahili() ? 'Weka nenosiri' : 'Choose a password'" required />
              </div>

              <button
                type="submit"
                class="w-full bg-gold hover:bg-gold-soft text-charcoal font-bold text-sm py-3.5 rounded-button shadow transition-colors mt-2"
              >
                {{ isLoginMode 
                  ? (lang.isSwahili() ? 'Ingia & Anza Maswali →' : 'Log In & Begin Assessment →') 
                  : (lang.isSwahili() ? 'Tengeneza Wasifu & Anza Maswali →' : 'Create Profile & Begin Assessment →') 
                }}
              </button>
            </form>

            <!-- Toggle Login / Register -->
            <div class="text-center pt-1">
              <button
                type="button"
                (click)="isLoginMode = !isLoginMode"
                class="text-xs text-gold font-semibold hover:underline"
              >
                <span *ngIf="isLoginMode">
                  {{ lang.isSwahili() ? 'Mjasiriamali mpya? Tengeneza wasifu' : 'New entrepreneur? Create profile' }}
                </span>
                <span *ngIf="!isLoginMode">
                  {{ lang.isSwahili() ? 'Una akaunti tayari? Ingia hapa' : 'Already have an account? Sign in' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Switch to Grow Business -->
          <div class="text-center pt-3 border-t border-forest-line/10 mt-2">
            <a
              routerLink="/grow-business"
              class="text-xs text-forest hover:text-gold font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>{{ lang.isSwahili() ? 'Tayari unafanya biashara? Bofya hapa' : 'Already operating a business? Go to Grow Business' }}</span>
              <span>→</span>
            </a>
          </div>

        </div>
      </div>

      <!-- ================= 4. QUESTIONNAIRE FLOW (22 QUESTIONS) ================= -->
      <div *ngIf="currentScreen === 'QUESTIONS'" class="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-8 max-w-3xl mx-auto animate-fadeIn">
        
        <!-- Loading State -->
        <div *ngIf="isLoadingQuestions || questions.length === 0" class="my-auto py-24 flex flex-col items-center justify-center space-y-4">
          <div class="relative w-14 h-14 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-gold/20 blur-md animate-pulse"></div>
            <img src="brand/compass-mark.png" alt="Compass" class="w-12 h-12 animate-spin-slow">
          </div>
          <p class="text-sm font-serif font-bold text-forest">
            {{ lang.isSwahili() ? 'Inapakia maswali ya Pathfinder...' : 'Loading Pathfinder assessment...' }}
          </p>
        </div>

        <!-- Pinned Header: Progress bar + Step counter -->
        <div class="space-y-4" *ngIf="!isLoadingQuestions && questions.length > 0">
          <div class="flex items-center justify-between">
            <button
              (click)="onBackQuestion()"
              [disabled]="currentQuestionIndex === 0"
              class="text-xs font-semibold text-charcoal/60 hover:text-charcoal disabled:opacity-30 flex items-center gap-1"
            >
              ← {{ lang.t.btnBack }}
            </button>
            <span class="text-xs font-serif font-bold text-forest">
              Compass Pathfinder
            </span>
            <button
              (click)="lang.toggleLanguage()"
              class="text-xs font-semibold px-2.5 py-1 rounded bg-ivory-sunk border border-forest/10 text-charcoal"
            >
              {{ lang.currentLang().toUpperCase() }}
            </button>
          </div>

          <app-progress-bar
            [currentStep]="currentQuestionIndex + 1"
            [totalSteps]="questions.length"
          ></app-progress-bar>
        </div>

        <!-- Question Card -->
        <div class="my-8 bg-white p-6 sm:p-10 rounded-sheet border border-forest-line/15 shadow-light-md space-y-6" *ngIf="!isLoadingQuestions && currentQuestion">
          
          <!-- Section Tag -->
          <div class="space-y-1">
            <span class="text-[11px] font-semibold uppercase tracking-widest text-gold">
              {{ lang.isSwahili() ? currentQuestion.sectionTitleSw : currentQuestion.sectionTitle }}
            </span>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-charcoal leading-snug">
              {{ lang.isSwahili() ? currentQuestion.textSw : currentQuestion.text }}
            </h2>
            <p *ngIf="currentQuestion.type === 'multi'" class="text-xs text-charcoal/50 italic">
              {{ lang.t.selectUpTo3 }}
            </p>
          </div>

          <!-- Options -->
          <div class="space-y-2.5 pt-2" *ngIf="currentQuestion.type !== 'text'">
            <app-option-row
              *ngFor="let opt of currentQuestion.options"
              [label]="lang.isSwahili() ? opt.labelSw : opt.label"
              [isSelected]="isOptionSelected(currentQuestion.id, opt.id)"
              [isMulti]="currentQuestion.type === 'multi'"
              (selectedChange)="onOptionToggle(currentQuestion.id, opt.id, currentQuestion.type === 'multi')"
            ></app-option-row>
          </div>

          <!-- Optional text box -->
          <div *ngIf="currentQuestion.type === 'text'" class="pt-2">
            <textarea
              [(ngModel)]="answers[currentQuestion.id]"
              rows="4"
              class="w-full p-4 rounded-button border border-forest/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              placeholder="Type your dream venture or ideas here..."
            ></textarea>
          </div>

        </div>

        <!-- Navigation Footer Button -->
        <div class="flex items-center justify-end gap-4 pt-2">
          <button
            (click)="onNextQuestion()"
            [disabled]="!isCurrentQuestionAnswered()"
            class="bg-gold hover:bg-gold-soft disabled:opacity-40 text-charcoal font-semibold text-sm px-8 py-3.5 rounded-button shadow transition-all flex items-center gap-2"
          >
            <span>{{ isLastQuestion() ? lang.t.btnSubmit : lang.t.btnNext }}</span>
            <svg *ngIf="!isLastQuestion()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

      </div>

      <!-- ================= 5. ANALYSIS LOADING SCREEN ================= -->
      <div *ngIf="currentScreen === 'ANALYSIS'" class="min-h-screen bg-forest text-ivory flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div class="max-w-md w-full space-y-8">
          
          <div class="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-pulse"></div>
            <img src="brand/compass-mark.png" alt="Compass" class="w-20 h-20" [class.animate-spin]="!submitError">
          </div>

          <div class="space-y-2">
            <h2 class="text-2xl font-serif font-bold text-ivory">
              {{ submitError ? 'Unable to Complete Analysis' : lang.t.analyzingTitle }}
            </h2>
            <p class="text-xs text-ivory/60">
              {{ submitError ? 'We encountered a connection issue while analyzing your answers.' : 'Matching answers against 30+ African business models' }}
            </p>
          </div>

          <!-- Error Alert with Action Buttons -->
          <div *ngIf="submitError" class="bg-forest-deep p-6 rounded-card border border-red-500/40 text-left space-y-4">
            <p class="text-xs text-red-200">
              {{ submitError }}
            </p>
            <div class="flex items-center gap-3 pt-2">
              <button
                (click)="submitQuestionnaire()"
                class="flex-1 bg-gold hover:bg-gold-soft text-charcoal font-semibold text-xs py-3 rounded-button shadow transition-all flex items-center justify-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Retry Analysis</span>
              </button>
              <button
                (click)="goToScreen('QUESTIONS')"
                class="px-4 py-3 rounded-button border border-forest-line hover:border-gold text-xs text-ivory transition-colors"
              >
                Back to Questions
              </button>
            </div>
          </div>

          <!-- Filling Checklist (1 line by line) -->
          <div *ngIf="!submitError" class="bg-forest-deep p-6 rounded-card border border-forest-line text-left space-y-3">
            <div *ngFor="let item of analysisSteps; let i = index" class="flex items-center gap-3 text-xs transition-opacity duration-300" [class.opacity-40]="analysisProgress < i">
              <span class="w-5 h-5 rounded-full flex items-center justify-center font-bold"
                [ngClass]="{
                  'bg-gold text-charcoal': analysisProgress >= i,
                  'border border-forest-line text-ivory/40': analysisProgress < i
                }">
                {{ analysisProgress >= i ? '✓' : i + 1 }}
              </span>
              <span [class.text-gold]="analysisProgress === i" [class.text-ivory]="analysisProgress > i">
                {{ item }}
              </span>
            </div>
          </div>

        </div>
      </div>

      <!-- ================= 6. RESULTS OVERVIEW & FULL RESULTS ================= -->
      <div *ngIf="currentScreen === 'RESULTS' && result" class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fadeIn">
        
        <!-- Results Hero Header -->
        <div class="bg-forest rounded-sheet p-8 sm:p-12 text-ivory border border-forest-line shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div class="md:col-span-8 space-y-4">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-forest-deep border border-forest-line text-xs font-semibold text-gold uppercase">
                <svg class="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{{ lang.t.archetypeTitle }}</span>
              </div>
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory">
                {{ lang.isSwahili() ? result.primaryArchetypeSw : result.primaryArchetype }}
              </h1>
              <p class="text-sm text-ivory/80 leading-relaxed">
                {{ result.archetypeSummary }}
              </p>

              <!-- Trait Pills -->
              <div class="flex flex-wrap gap-2 pt-2">
                <span *ngFor="let trait of result.traitPills" class="px-3 py-1 rounded-pill bg-forest-deep border border-forest-line text-xs text-gold font-medium">
                  {{ trait }}
                </span>
                <span class="px-3 py-1 rounded-pill bg-forest-deep/60 border border-forest-line text-xs text-ivory/70">
                  Secondary: {{ lang.isSwahili() ? result.secondaryArchetypeSw : result.secondaryArchetype }}
                </span>
              </div>
            </div>

            <!-- Readiness Ring Gauge -->
            <div class="md:col-span-4 flex flex-col items-center justify-center p-4 bg-forest-deep rounded-card border border-forest-line">
              <app-score-ring
                [score]="result.readinessScore"
                [size]="130"
                [strokeWidth]="10"
                textColorClass="text-gold"
                [sublabel]="result.riskProfile + ' Risk'"
              ></app-score-ring>
              <span class="mt-3 text-xs font-bold text-ivory tracking-wide uppercase">
                {{ result.readinessVerdict }}
              </span>
            </div>

          </div>
        </div>

        <!-- 5-Pillar Readiness Breakdown -->
        <div class="bg-white rounded-sheet p-6 sm:p-8 border border-forest-line/15 shadow-light-sm space-y-6">
          <div class="border-b border-forest-line/10 pb-4">
            <h3 class="text-xl font-serif font-bold text-charcoal">
              {{ lang.t.readinessTitle }} ({{ result.readinessScore }} / 100)
            </h3>
            <p class="text-xs text-charcoal/60 mt-1">
              Evaluates how ready you are to begin immediately across 5 core startup pillars.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div *ngFor="let pillar of result.readinessPillars" class="bg-ivory p-4 rounded-card border border-forest-line/10 space-y-2">
              <div class="flex items-center justify-between text-xs font-semibold">
                <span class="text-charcoal">{{ pillar.pillar }}</span>
                <span class="text-forest font-bold">{{ pillar.score }} / {{ pillar.maxScore }}</span>
              </div>
              <div class="w-full bg-forest/10 rounded-full h-2 overflow-hidden">
                <div class="bg-gold h-full rounded-full" [style.width.%]="(pillar.score / pillar.maxScore) * 100"></div>
              </div>
              <p class="text-[11px] text-charcoal/60 leading-tight">
                {{ pillar.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Top 5 Strengths Profile -->
        <div class="bg-white rounded-sheet p-6 sm:p-8 border border-forest-line/15 shadow-light-sm space-y-6">
          <div class="border-b border-forest-line/10 pb-4">
            <h3 class="text-xl font-serif font-bold text-charcoal">
              {{ lang.t.topStrengthsTitle }}
            </h3>
            <p class="text-xs text-charcoal/60 mt-1">
              Your highest-scoring natural abilities based on the canonical 15-strength assessment.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let st of result.topStrengths" class="p-4 rounded-card border border-forest-line/10 bg-ivory space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-charcoal">{{ lang.isSwahili() ? st.nameSw : st.name }}</span>
                <span class="font-serif font-bold text-sm text-forest">{{ st.score }}%</span>
              </div>
              <div class="w-full bg-forest/10 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gold h-full rounded-full" [style.width.%]="st.score"></div>
              </div>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ st.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- TOP 3 MATCHED BUSINESSES -->
        <div class="space-y-6">
          <div class="flex items-end justify-between">
            <div>
              <span class="text-xs font-semibold text-gold uppercase tracking-wider">Recommendations</span>
              <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                {{ lang.t.topMatchesTitle }}
              </h2>
            </div>
            <span class="text-xs text-charcoal/60">Ranked 1 to 3</span>
          </div>

          <div class="space-y-6">
            <app-match-card
              *ngFor="let match of result.topMatches; let i = index"
              [match]="match"
              [rank]="i + 1"
              [isSaved]="auth.isSaved(match.businessId)"
              (savePath)="onToggleSave(match.businessId)"
            ></app-match-card>
          </div>
        </div>

        <!-- Blind Spots & Skills to Learn Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Blind spots -->
          <div class="bg-white rounded-card p-6 border border-forest-line/15 shadow-light-sm space-y-4">
            <h4 class="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ lang.t.blindSpotsTitle }}</span>
            </h4>
            <ul class="space-y-2.5 text-xs text-charcoal/80">
              <li *ngFor="let spot of result.commonBlindSpots" class="flex items-start gap-2">
                <span class="text-amber-600 font-bold">•</span>
                <span>{{ spot }}</span>
              </li>
            </ul>
          </div>

          <!-- Skills to Learn -->
          <div class="bg-white rounded-card p-6 border border-forest-line/15 shadow-light-sm space-y-4">
            <h4 class="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
              <svg class="w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>{{ lang.t.skillsToLearnTitle }}</span>
            </h4>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of result.skillsToLearn" class="px-3 py-1.5 rounded-pill bg-ivory border border-forest-line/20 text-xs font-semibold text-charcoal">
                {{ skill }}
              </span>
            </div>
            <p class="text-[11px] text-charcoal/60 pt-2">
              Closing these key skill gaps increases your operational success rate.
            </p>
          </div>

        </div>

        <!-- Capital Allocation Guide -->
        <div class="bg-white rounded-sheet p-6 sm:p-8 border border-forest-line/15 shadow-light-sm space-y-6">
          <div class="border-b border-forest-line/10 pb-4">
            <h3 class="text-xl font-serif font-bold text-charcoal">
              {{ lang.t.capitalGuideTitle }}
            </h3>
            <p class="text-xs text-charcoal/60 mt-1">
              How to allocate your initial startup capital for optimal resilience.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center" *ngIf="result.capitalAllocationGuide">
            <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
              <p class="font-serif text-2xl font-bold text-forest">{{ result.capitalAllocationGuide.inventory }}%</p>
              <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">Inventory / Setup</p>
            </div>
            <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
              <p class="font-serif text-2xl font-bold text-gold">{{ result.capitalAllocationGuide.marketing }}%</p>
              <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">Marketing & Launch</p>
            </div>
            <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
              <p class="font-serif text-2xl font-bold text-charcoal">{{ result.capitalAllocationGuide.operations }}%</p>
              <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">Operations</p>
            </div>
            <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
              <p class="font-serif text-2xl font-bold text-emerald-600">{{ result.capitalAllocationGuide.emergencyFund }}%</p>
              <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">Emergency Fund</p>
            </div>
          </div>
        </div>

        <!-- 30-Day Launch Action Plan (Block 10 from Spec) -->
        <div class="bg-white rounded-sheet p-6 sm:p-8 border border-forest-line/15 shadow-light-sm space-y-6" *ngIf="topBusinessPlan.length > 0">
          <div class="border-b border-forest-line/10 pb-4 flex items-center justify-between">
            <div>
              <span class="text-xs font-semibold text-gold uppercase tracking-wider">Execution Blueprint</span>
              <h3 class="text-xl font-serif font-bold text-charcoal">
                {{ lang.t.actionPlanTitle }} ({{ result.topMatches?.[0]?.name || 'Venture Roadmap' }})
              </h3>
            </div>
            <span class="text-xs text-charcoal/60">4-Week Milestones</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-week-block
              *ngFor="let plan of topBusinessPlan"
              [weekNumber]="plan.week"
              [title]="plan.title"
              [tasks]="plan.tasks"
              [interactive]="true"
            ></app-week-block>
          </div>
        </div>

        <!-- ================= GEMINI AI STRATEGIC ADVISORY ================= -->
        <div *ngIf="result.aiInsight" class="bg-gradient-to-br from-forest-deep via-forest to-forest-deep rounded-sheet p-6 sm:p-10 border border-gold/30 text-ivory shadow-2xl space-y-6 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-line pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold animate-pulse">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                  Powered by Gemini 3.6 Flash
                </div>
                <h3 class="text-xl sm:text-2xl font-serif font-bold text-ivory mt-0.5">
                  Compass AI Strategic Advisory
                </h3>
              </div>
            </div>
            <span class="text-xs text-ivory/60 font-mono">Real-time African Market Model</span>
          </div>

          <!-- Executive Brief -->
          <div class="bg-forest-deep/90 p-5 sm:p-6 rounded-card border border-forest-line space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Executive Briefing</span>
            </h4>
            <p class="text-sm text-ivory/90 leading-relaxed font-normal">
              {{ result.aiInsight.executiveBrief }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Local Competitive Edge -->
            <div class="bg-forest-deep/70 p-5 rounded-card border border-forest-line space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Local Market Advantage</span>
              </h4>
              <p class="text-xs text-ivory/80 leading-relaxed">
                {{ result.aiInsight.localCompetitiveEdge }}
              </p>
            </div>

            <!-- Risk Shield -->
            <div class="bg-forest-deep/70 p-5 rounded-card border border-forest-line space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Risk Shield & Capital Protection</span>
              </h4>
              <p class="text-xs text-ivory/80 leading-relaxed">
                {{ result.aiInsight.riskShield }}
              </p>
            </div>
          </div>

          <!-- Day 1 Action Checklist -->
          <div *ngIf="result.aiInsight.dayOneActionChecklist && result.aiInsight.dayOneActionChecklist.length > 0" class="bg-forest-deep/80 p-5 sm:p-6 rounded-card border border-forest-line space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span>Day 1 Execution Checklist</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div *ngFor="let item of result.aiInsight.dayOneActionChecklist" class="flex items-start gap-2.5 text-xs text-ivory/90 bg-forest/50 p-3 rounded-button border border-forest-line/30">
                <span class="text-gold font-bold">✓</span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= ASK COMPASS AI ADVISOR (INTERACTIVE CHAT) ================= -->
        <div class="bg-white rounded-sheet p-6 sm:p-8 border border-forest-line/15 shadow-light-md space-y-6">
          <div class="flex items-center justify-between border-b border-forest-line/10 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-serif font-bold text-charcoal">
                  Ask Compass AI Advisor
                </h3>
                <p class="text-xs text-charcoal/60">
                  Ask any question about launching, pricing, suppliers, or county permits.
                </p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-pill bg-gold/15 text-gold-deep border border-gold/30">
              Gemini Live
            </span>
          </div>

          <!-- Chat conversation stream -->
          <div class="bg-ivory rounded-card p-4 max-h-80 overflow-y-auto space-y-3 border border-forest-line/10">
            <div *ngFor="let msg of chatMessages" class="flex flex-col" [ngClass]="{'items-end': msg.role === 'user', 'items-start': msg.role === 'model'}">
              <div class="max-w-[85%] p-3.5 rounded-sheet text-xs leading-relaxed"
                [ngClass]="{
                  'bg-forest text-ivory font-medium': msg.role === 'user',
                  'bg-white text-charcoal border border-forest-line/15 shadow-sm': msg.role === 'model'
                }">
                <p class="whitespace-pre-line">{{ msg.text }}</p>
              </div>
              <span class="text-[10px] text-charcoal/40 mt-1 px-1">
                {{ msg.role === 'user' ? 'You' : 'Compass AI Advisor' }}
              </span>
            </div>

            <div *ngIf="isChatLoading" class="flex items-center gap-2 text-xs text-charcoal/60 p-2">
              <div class="w-2 h-2 rounded-full bg-gold animate-bounce"></div>
              <div class="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]"></div>
              <div class="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]"></div>
              <span>Gemini is generating practical advice...</span>
            </div>
          </div>

          <!-- Prompt Suggestions -->
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let prompt of quickChatPrompts"
              (click)="sendQuickPrompt(prompt)"
              [disabled]="isChatLoading"
              class="text-[11px] font-medium px-3 py-1.5 rounded-pill bg-ivory hover:bg-forest/5 text-charcoal border border-forest-line/20 transition-all text-left flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>{{ prompt }}</span>
            </button>
          </div>

          <!-- Input bar -->
          <div class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="chatInput"
              (keyup.enter)="sendChatMessage()"
              [disabled]="isChatLoading"
              placeholder="e.g. How do I get my first 10 customers in Nairobi with minimal marketing spend?"
              class="flex-grow p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-xs focus:outline-none focus:border-gold"
            />
            <button
              (click)="sendChatMessage()"
              [disabled]="!chatInput.trim() || isChatLoading"
              class="bg-forest hover:bg-forest-deep disabled:opacity-40 text-gold font-semibold text-xs px-5 py-3 rounded-button shadow transition-all flex items-center gap-1.5"
            >
              <span>Ask</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Action Bar: Download Plan or Start Journey -->
        <div class="bg-forest-deep rounded-card p-6 border border-forest-line text-ivory flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 class="font-serif font-bold text-lg text-ivory">Ready to take action on Monday?</h4>
            <p class="text-xs text-ivory/70">Start tracking your 30-day launch roadmap today.</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              (click)="printPlan()"
              class="px-5 py-2.5 rounded-button border border-forest-line hover:border-gold text-xs font-semibold text-ivory transition-colors"
            >
              Download PDF / Print
            </button>
            <button
              *ngIf="result.topMatches && result.topMatches.length > 0"
              (click)="onStartJourney(result.topMatches[0].businessId)"
              class="bg-gold hover:bg-gold-soft text-charcoal font-semibold text-xs px-6 py-2.5 rounded-button shadow transition-all"
            >
              Start My Journey →
            </button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class PathfinderWizardComponent implements OnInit {
  api = inject(ApiService);
  lang = inject(LanguageService);
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  selectedJourneyType: 'START' | 'GROW' = 'START';
  currentScreen: FlowScreen = 'JOURNEY';
  isLoadingQuestions = true;
  questions: QuestionDefinition[] = [];
  currentQuestionIndex = 0;
  answers: Record<string, any> = {};

  analysisProgress = 0;
  analysisSteps = [
    'Analyzing natural strengths & energy flow...',
    'Computing your Entrepreneur Archetype...',
    'Evaluating 30+ African business opportunities...',
    'Assessing location and capital feasibility...',
    'Synthesizing 30-day action plan & recommendations...',
  ];

  result: AssessmentResult | null = null;
  topBusinessPlan: any[] = [];
  submitError: string | null = null;
  submitStartTime = 0;

  ngOnInit() {
    this.loadQuestions();
    this.route.queryParams.subscribe(params => {
      if (params['target'] === 'grow') {
        this.selectedJourneyType = 'GROW';
        if (!this.auth.currentUser()) {
          this.currentScreen = 'ACCOUNT_GATE';
        } else {
          this.router.navigate(['/grow-business']);
        }
      } else if (params['target'] === 'start') {
        this.selectedJourneyType = 'START';
        if (!this.auth.currentUser()) {
          this.currentScreen = 'ACCOUNT_GATE';
        } else {
          this.startQuestionsAfterAuth();
        }
      } else {
        this.currentScreen = 'JOURNEY';
      }
    });
  }

  onChooseJourney(type: 'START' | 'GROW') {
    this.selectedJourneyType = type;
    if (!this.auth.currentUser()) {
      this.goToScreen('ACCOUNT_GATE');
      return;
    }
    if (type === 'GROW') {
      this.router.navigate(['/grow-business']);
    } else {
      this.startQuestionsAfterAuth();
    }
  }

  afterAuthenticationSuccess() {
    if (this.selectedJourneyType === 'GROW') {
      this.router.navigate(['/grow-business']);
    } else {
      this.startQuestionsAfterAuth();
    }
  }

  loadQuestions() {
    this.isLoadingQuestions = true;
    this.api.getQuestions().subscribe({
      next: res => {
        this.questions = res.questions || [];
        this.isLoadingQuestions = false;
      },
      error: err => {
        console.error('Error fetching questions', err);
        this.isLoadingQuestions = false;
      }
    });
  }

  goToScreen(screen: FlowScreen) {
    if (screen === 'QUESTIONS' && !this.auth.currentUser()) {
      this.currentScreen = 'ACCOUNT_GATE';
      return;
    }
    this.currentScreen = screen;
  }

  selectLanguage(code: LanguageCode) {
    this.lang.setLanguage(code);
  }

  startQuestions() {
    if (!this.auth.currentUser()) {
      this.goToScreen('ACCOUNT_GATE');
      return;
    }
    this.startQuestionsAfterAuth();
  }

  startQuestionsAfterAuth() {
    if (!this.auth.currentUser()) {
      this.goToScreen('ACCOUNT_GATE');
      return;
    }
    this.currentQuestionIndex = 0;
    this.currentScreen = 'QUESTIONS';
  }

  get currentQuestion(): QuestionDefinition | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  isOptionSelected(questionId: string, optionId: string): boolean {
    const val = this.answers[questionId];
    if (Array.isArray(val)) {
      return val.includes(optionId);
    }
    return val === optionId;
  }

  onOptionToggle(questionId: string, optionId: string, isMulti: boolean) {
    if (isMulti) {
      const current = Array.isArray(this.answers[questionId]) ? [...this.answers[questionId]] : [];
      const idx = current.indexOf(optionId);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        if (current.length < 3) {
          current.push(optionId);
        }
      }
      this.answers[questionId] = current;
    } else {
      this.answers[questionId] = optionId;
    }
  }

  isCurrentQuestionAnswered(): boolean {
    const q = this.currentQuestion;
    if (!q) return false;
    if (q.optional) return true;
    const ans = this.answers[q.id];
    if (ans === undefined || ans === null || ans === '') return false;
    if (Array.isArray(ans) && ans.length === 0) return false;
    return true;
  }

  isLoginMode = false;
  accountForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };

  // Live AI Chat with Gemini
  chatInput = '';
  isChatLoading = false;
  chatMessages: { role: 'user' | 'model'; text: string }[] = [];
  quickChatPrompts = [
    'How should I price my products in Kenya/Africa?',
    'What county business permits or licenses do I need?',
    'How can I get my first 10 paying customers?',
    'Can I start this part-time while keeping my job?'
  ];

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  onNextQuestion() {
    if (this.isLastQuestion()) {
      this.submitQuestionnaire();
    } else {
      this.currentQuestionIndex++;
    }
  }

  onBackQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onGoogleUserAuthenticated(user: any) {
    if (user?.name && !this.accountForm.name) {
      this.accountForm.name = user.name;
    }
    if (user?.email && !this.accountForm.email) {
      this.accountForm.email = user.email;
    }
    this.afterAuthenticationSuccess();
  }

  onGoogleSignInError(err: any) {
    console.error('Google Sign-In failed:', err);
  }

  onEmailRegister(event: Event) {
    event.preventDefault();
    if (!this.accountForm.email) return;

    if (this.isLoginMode) {
      this.auth.login(this.accountForm.email, this.accountForm.password).subscribe({
        next: () => this.afterAuthenticationSuccess(),
        error: (err: any) => {
          console.error(err);
          alert(this.lang.isSwahili() ? 'Hitilafu wakati wa kuingia' : 'Invalid email or password');
        }
      });
      return;
    }

    if (!this.accountForm.name) return;

    this.auth.register({
      name: this.accountForm.name,
      email: this.accountForm.email,
      phone: this.accountForm.phone,
      password: this.accountForm.password || 'Compass@2026',
      language: this.lang.currentLang(),
    }).subscribe({
      next: () => {
        this.afterAuthenticationSuccess();
      },
      error: () => {
        // Fallback: If user already exists, attempt login
        this.auth.login(this.accountForm.email, this.accountForm.password).subscribe({
          next: () => this.afterAuthenticationSuccess(),
          error: () => this.afterAuthenticationSuccess(),
        });
      }
    });
  }

  submitQuestionnaire() {
    this.submitError = null;
    this.currentScreen = 'ANALYSIS';
    this.analysisProgress = 0;
    this.submitStartTime = Date.now();

    // Fast animated checklist (120ms per step)
    const interval = setInterval(() => {
      this.analysisProgress++;
      if (this.analysisProgress >= this.analysisSteps.length) {
        clearInterval(interval);
      }
    }, 120);

    const userId = this.auth.getEffectiveUserId();
    this.api.submitAssessment(this.answers, userId).subscribe({
      next: res => {
        clearInterval(interval);
        this.analysisProgress = this.analysisSteps.length;
        this.result = res;
        this.currentScreen = 'RESULTS';

          // Initialize Gemini AI chat with greeting
          const topMatchName = res.topMatches?.[0]?.name || 'your recommended venture';
          this.chatMessages = [
            {
              role: 'model',
              text: `Jambo! I am your Compass AI Advisor. I have analyzed your assessment profile (${res.primaryArchetype}) and strongly recommend exploring ${topMatchName}. Ask me anything about finding local suppliers, setting prices, county licensing, or bootstrapping safely!`
            }
          ];

          if (res.topMatches && res.topMatches.length > 0 && res.topMatches[0].businessId) {
            this.api.getBusinessBySlug(res.topMatches[0].businessId).subscribe({
              next: biz => {
                this.topBusinessPlan = (biz?.thirtyDayPlan || []).map(p => ({
                  week: p.week,
                  title: p.title,
                  tasks: (p.tasks || []).map((t, idx) => ({ id: `w${p.week}_t${idx}`, title: t, completed: false }))
                }));
              },
              error: () => {}
            });
          }
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#D4A017', '#0B2E24', '#F9F7EF']
            });
          } catch (e) {
            console.warn('Confetti effect failed', e);
          }
      },
      error: err => {
        console.error('Error submitting assessment', err);
        clearInterval(interval);
        this.submitError = 'Unable to complete your analysis right now due to server load or network timeout. Please click Retry below.';
      }
    });
  }

  sendChatMessage() {
    const text = this.chatInput.trim();
    if (!text || this.isChatLoading) return;

    this.chatMessages.push({ role: 'user', text });
    this.chatInput = '';
    this.isChatLoading = true;

    const topBiz = this.result?.topMatches?.[0];
    const context = `User Archetype: ${this.result?.primaryArchetype}. Recommended Venture: ${topBiz?.name}. Category: ${topBiz?.category}. Capital Band: ${topBiz?.capitalBand}. Risk Profile: ${this.result?.riskProfile}. User answers summary: ${JSON.stringify(this.answers)}`;

    this.api.chatWithAi(this.chatMessages, context).subscribe({
      next: res => {
        this.isChatLoading = false;
        this.chatMessages.push({ role: 'model', text: res.reply });
      },
      error: err => {
        this.isChatLoading = false;
        this.chatMessages.push({
          role: 'model',
          text: 'Pole sana! The AI advisor encountered an issue. Please verify your GEMINI_API_KEY connection.'
        });
      }
    });
  }

  sendQuickPrompt(prompt: string) {
    this.chatInput = prompt;
    this.sendChatMessage();
  }

  onToggleSave(slug: string) {
    const userId = this.auth.getEffectiveUserId();
    this.api.toggleSavePath(userId, slug).subscribe({
      next: res => {
        this.auth.updateSavedPaths(res.savedPaths);
      }
    });
  }

  onStartJourney(businessSlug: string) {
    const userId = this.auth.getEffectiveUserId();
    this.api.startJourney(userId, businessSlug).subscribe({
      next: journey => {
        this.router.navigate(['/journey', journey._id]);
      }
    });
  }

  printPlan() {
    window.print();
  }
}
