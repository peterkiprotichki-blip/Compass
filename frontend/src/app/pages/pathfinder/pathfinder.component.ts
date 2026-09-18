import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
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
  ],
  template: `
    <div class="min-h-screen bg-ivory text-charcoal">
      
      <!-- ================= 1. SPLASH SCREEN ================= -->
      <div *ngIf="currentScreen === 'SPLASH'" class="min-h-screen bg-forest text-ivory flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden animate-fadeIn">
        <div class="w-full flex justify-end">
          <button (click)="lang.toggleLanguage()" class="text-xs font-semibold px-3 py-1.5 rounded-pill bg-forest-deep border border-forest-line text-gold">
            {{ lang.currentLang().toUpperCase() }}
          </button>
        </div>

        <div class="flex flex-col items-center text-center max-w-lg space-y-6 my-auto">
          <!-- Animated Compass Logo -->
          <div class="relative w-28 h-28 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-gold/15 blur-xl animate-pulse"></div>
            <img src="brand/compass-mark.png" alt="Compass" class="w-24 h-24 animate-spin-slow">
          </div>

          <h1 class="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-ivory">
            Compass<span class="text-gold">.</span>
          </h1>

          <p class="text-lg text-ivory/80 font-normal">
            {{ lang.isSwahili() ? 'Mwongozo leo. Kesho yenye mwangaza zaidi.' : 'Guidance today. Brighter tomorrows.' }}
          </p>

          <p class="text-xs uppercase tracking-widest text-gold font-semibold">
            {{ lang.isSwahili() ? 'Kwa Wajasiriamali wa Afrika' : 'For African Entrepreneurs · At Every Stage' }}
          </p>
        </div>

        <div class="w-full max-w-md pt-6">
          <button
            (click)="goToScreen('LANGUAGE')"
            class="w-full bg-gold hover:bg-gold-soft text-charcoal font-semibold text-base py-4 rounded-button shadow-lg transition-all"
          >
            {{ lang.isSwahili() ? 'Anza Safari Yako' : 'Start Pathfinder' }}
          </button>
        </div>
      </div>

      <!-- ================= 2. LANGUAGE SELECTION ================= -->
      <div *ngIf="currentScreen === 'LANGUAGE'" class="min-h-screen flex flex-col justify-center items-center p-6 bg-ivory animate-fadeIn">
        <div class="w-full max-w-md bg-white p-8 rounded-sheet border border-forest-line/15 shadow-light-lg space-y-6">
          
          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-forest text-gold flex items-center justify-center text-xl font-bold">
              🌍
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
              (click)="startQuestions()"
              class="bg-white p-6 rounded-sheet border-2 border-gold shadow-light-md cursor-pointer hover:scale-[1.02] transition-transform space-y-3"
            >
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center text-lg">
                🧭
              </div>
              <h3 class="font-serif font-bold text-xl text-charcoal">
                {{ lang.t.btnStartMyBusiness }}
              </h3>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() ? 'Gundua biashara inayokufaa kupitia maswali 22 ya tathmini.' : 'Find the right business for you based on strengths, capital and goals.' }}
              </p>
              <div class="pt-2">
                <span class="text-xs font-bold text-forest flex items-center gap-1">
                  Start Pathfinder →
                </span>
              </div>
            </div>

            <div
              (click)="router.navigate(['/grow-business'])"
              class="bg-white p-6 rounded-sheet border border-forest/20 shadow-light-sm cursor-pointer hover:scale-[1.02] transition-transform space-y-3"
            >
              <div class="w-10 h-10 rounded-full bg-ivory-sunk text-charcoal flex items-center justify-center text-lg">
                📈
              </div>
              <h3 class="font-serif font-bold text-xl text-charcoal">
                {{ lang.t.btnGrowMyBusiness }}
              </h3>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() ? 'Kwa watu ambao tayari wanafanya biashara na wanataka utatuzi.' : 'For existing business owners seeking diagnostics and growth recommendations.' }}
              </p>
              <div class="pt-2">
                <span class="text-xs font-bold text-charcoal/60 flex items-center gap-1">
                  Diagnostics →
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= 4. ACCOUNT CREATION & GOOGLE SIGN-IN GATE ================= -->
      <div *ngIf="currentScreen === 'ACCOUNT_GATE'" class="min-h-screen flex flex-col justify-center items-center p-6 bg-ivory animate-fadeIn">
        <div class="w-full max-w-md bg-white p-8 sm:p-10 rounded-sheet border border-forest-line/15 shadow-light-lg space-y-6">
          
          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-forest text-gold flex items-center justify-center text-xl">
              👤
            </div>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              Create Your Profile
            </h2>
            <p class="text-xs text-charcoal/65">
              Save your assessment results, track your 30-day action plan, and unlock personalized AI recommendations.
            </p>
          </div>

          <!-- Quick One-Click Google Sign In Button -->
          <div class="space-y-3">
            <button
              (click)="onGoogleSignIn()"
              class="w-full flex items-center justify-center gap-3 bg-white hover:bg-ivory text-charcoal font-semibold text-sm py-3.5 px-4 rounded-button border border-forest-line/25 shadow-sm transition-all"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div class="flex items-center my-3">
              <div class="flex-grow border-t border-forest-line/10"></div>
              <span class="px-3 text-xs text-charcoal/40 uppercase font-semibold">Or use email</span>
              <div class="flex-grow border-t border-forest-line/10"></div>
            </div>

            <!-- Email Registration Form -->
            <form (submit)="onEmailRegister($event)" class="space-y-3 text-left">
              <div>
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">Your Full Name</label>
                <input type="text" [(ngModel)]="accountForm.name" name="name" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" placeholder="e.g. Wangari Mwangi" required />
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">Email Address</label>
                <input type="email" [(ngModel)]="accountForm.email" name="email" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" placeholder="you@gmail.com" required />
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">Password</label>
                <input type="password" [(ngModel)]="accountForm.password" name="password" class="w-full p-3 rounded-button border bg-ivory text-sm mt-1 focus:outline-none focus:border-gold" placeholder="Choose a password" required />
              </div>

              <button
                type="submit"
                class="w-full bg-gold hover:bg-gold-soft text-charcoal font-semibold text-sm py-3.5 rounded-button shadow transition-colors mt-2"
              >
                Create Profile & View Results →
              </button>
            </form>
          </div>

          <!-- Skip / Guest Option -->
          <div class="text-center pt-2">
            <button
              (click)="submitQuestionnaire()"
              class="text-xs text-charcoal/60 hover:text-charcoal underline"
            >
              Skip for now and continue as guest
            </button>
          </div>

        </div>
      </div>

      <!-- ================= 4. QUESTIONNAIRE FLOW (22 QUESTIONS) ================= -->
      <div *ngIf="currentScreen === 'QUESTIONS'" class="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-8 max-w-3xl mx-auto animate-fadeIn">
        
        <!-- Pinned Header: Progress bar + Step counter -->
        <div class="space-y-4">
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
        <div class="my-8 bg-white p-6 sm:p-10 rounded-sheet border border-forest-line/15 shadow-light-md space-y-6" *ngIf="currentQuestion">
          
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
                class="flex-1 bg-gold hover:bg-gold-soft text-charcoal font-semibold text-xs py-3 rounded-button shadow transition-all"
              >
                🔄 Retry Analysis
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
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-forest-deep border border-forest-line text-xs font-semibold text-gold uppercase">
                <span>🛡️ {{ lang.t.archetypeTitle }}</span>
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
              <span>⚠️</span>
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
              <span>🎯</span>
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
              <div class="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-lg font-bold animate-pulse">
                ✨
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
              <span>📋 Executive Briefing</span>
            </h4>
            <p class="text-sm text-ivory/90 leading-relaxed font-normal">
              {{ result.aiInsight.executiveBrief }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Local Competitive Edge -->
            <div class="bg-forest-deep/70 p-5 rounded-card border border-forest-line space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                <span>⚡ Local Market Advantage</span>
              </h4>
              <p class="text-xs text-ivory/80 leading-relaxed">
                {{ result.aiInsight.localCompetitiveEdge }}
              </p>
            </div>

            <!-- Risk Shield -->
            <div class="bg-forest-deep/70 p-5 rounded-card border border-forest-line space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                <span>🛡️ Risk Shield & Capital Protection</span>
              </h4>
              <p class="text-xs text-ivory/80 leading-relaxed">
                {{ result.aiInsight.riskShield }}
              </p>
            </div>
          </div>

          <!-- Day 1 Action Checklist -->
          <div *ngIf="result.aiInsight.dayOneActionChecklist && result.aiInsight.dayOneActionChecklist.length > 0" class="bg-forest-deep/80 p-5 sm:p-6 rounded-card border border-forest-line space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <span>🚀 Day 1 Execution Checklist</span>
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
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center text-lg">
                💬
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
              class="text-[11px] font-medium px-3 py-1.5 rounded-pill bg-ivory hover:bg-forest/5 text-charcoal border border-forest-line/20 transition-all text-left"
            >
              💡 {{ prompt }}
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

  currentScreen: FlowScreen = 'SPLASH';
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
  }

  loadQuestions() {
    this.api.getQuestions().subscribe({
      next: res => {
        this.questions = res.questions;
      },
      error: err => {
        console.error('Error fetching questions', err);
      }
    });
  }

  goToScreen(screen: FlowScreen) {
    this.currentScreen = screen;
  }

  selectLanguage(code: LanguageCode) {
    this.lang.setLanguage(code);
  }

  startQuestions() {
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

  // Profile creation & authentication gate
  accountForm = {
    name: '',
    email: '',
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
      if (!this.auth.currentUser()) {
        this.goToScreen('ACCOUNT_GATE');
      } else {
        this.submitQuestionnaire();
      }
    } else {
      this.currentQuestionIndex++;
    }
  }

  onBackQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  onGoogleSignIn() {
    const suggestedEmail = this.accountForm.email || 'founder@gmail.com';
    const email = window.prompt('Google One-Tap / OAuth: Confirm your Google Email', suggestedEmail) || suggestedEmail;
    const name = this.accountForm.name || (email.split('@')[0].replace('.', ' '));
    const formattedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    this.auth.loginWithGoogle({
      googleId: 'google_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      email: email,
      name: formattedName,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`
    }).subscribe({
      next: () => {
        this.submitQuestionnaire();
      },
      error: err => {
        console.error('Google sign in error', err);
        this.submitQuestionnaire();
      }
    });
  }

  onEmailRegister(event: Event) {
    event.preventDefault();
    if (!this.accountForm.email || !this.accountForm.name) return;

    this.auth.register({
      name: this.accountForm.name,
      email: this.accountForm.email,
      password: this.accountForm.password || 'Compass@2026',
      language: this.lang.currentLang(),
    }).subscribe({
      next: () => {
        this.submitQuestionnaire();
      },
      error: () => {
        // Fallback: If user already exists, attempt login
        this.auth.login(this.accountForm.email, this.accountForm.password).subscribe({
          next: () => this.submitQuestionnaire(),
          error: () => this.submitQuestionnaire(),
        });
      }
    });
  }

  submitQuestionnaire() {
    this.submitError = null;
    this.currentScreen = 'ANALYSIS';
    this.analysisProgress = 0;
    this.submitStartTime = Date.now();

    // Animated line-by-line checklist
    const interval = setInterval(() => {
      this.analysisProgress++;
      if (this.analysisProgress >= this.analysisSteps.length) {
        clearInterval(interval);
      }
    }, 450);

    const userId = this.auth.getEffectiveUserId();
    this.api.submitAssessment(this.answers, userId).subscribe({
      next: res => {
        const elapsed = Date.now() - this.submitStartTime;
        const delay = Math.max(150, 2200 - elapsed);
        setTimeout(() => {
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
        }, delay);
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
