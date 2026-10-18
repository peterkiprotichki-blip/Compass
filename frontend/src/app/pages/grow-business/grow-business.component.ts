import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { GoogleSignInComponent } from '../../shared/components/google-sign-in/google-sign-in.component';

interface ItemSoldDraft {
  itemName: string;
  quantity: number;
  sellingPrice: number;
}

interface ExpenseDraft {
  category: string;
  amount: number;
}

@Component({
  selector: 'app-grow-business',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleSignInComponent],
  template: `
    <div class="min-h-screen bg-ivory py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      
      <!-- ================= HEADER & SHOP SELECTOR ================= -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-line/15 pb-5">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-forest text-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <span>{{ lang.isSwahili() ? 'Dira ya Biashara · Kukuza Biashara' : 'Business Compass · Growth & Multi-Shop Tracking' }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Kukuza & Kusimamia Biashara Yako' : 'Grow & Track Your Business' }}
          </h1>
          <p class="text-charcoal/70 text-xs sm:text-sm mt-1">
            {{ lang.isSwahili() 
              ? 'Hifadhi mauzo ya kila siku, vitengo na maduka mbalimbali, fanya uchambuzi wa AI wa wiki au mwezi, na rekodi historia.' 
              : 'Save daily sales across shops/units, edit records, run on-demand AI analysis for a week or month, and build permanent history.' 
            }}
          </p>
        </div>

        <!-- Mode / Switcher if profile exists -->
        <div *ngIf="auth.currentUser() && activeProfile" class="flex items-center gap-2 flex-wrap">
          <span 
            class="px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-wider"
            [ngClass]="activeProfile.isUnlocked ? 'bg-gold text-forest-deep' : 'bg-forest-line/20 text-charcoal'"
          >
            {{ activeProfile.isUnlocked ? (lang.isSwahili() ? 'Kifurushi cha KSh 499 Kimefunguliwa' : 'KSh 499 Pro Unlocked') : (lang.isSwahili() ? 'Toleo la Bure (Free)' : 'Free Tier') }}
          </span>
          <button
            (click)="showNewBranchModal = true"
            class="px-3 py-1 rounded-button bg-gold hover:bg-gold-dark text-forest-deep text-xs font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <span>+</span>
            <span>{{ lang.isSwahili() ? 'Ongeza Duka / Tawi' : 'Add Shop / Branch' }}</span>
          </button>
        </div>
      </div>

      <!-- ================= BUSINESS / BRANCH SWITCHER BAR ================= -->
      <div *ngIf="auth.currentUser() && activeProfile" class="bg-white rounded-sheet border border-forest-line/20 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center font-bold flex-shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-charcoal">{{ lang.isSwahili() ? 'Duka / Kitengo Kilichochaguliwa:' : 'Active Business / Shop:' }}</span>
              <select 
                [ngModel]="activeProfile._id" 
                (ngModelChange)="switchProfile($event)"
                class="text-xs font-bold bg-ivory border border-forest-line/30 rounded-button px-3 py-1.5 text-forest focus:outline-none focus:border-gold"
              >
                <option *ngFor="let p of availableProfiles" [value]="p._id">
                  {{ p.businessName || p.businessType }} ({{ p.branchName || 'Main' }}) — {{ p.dailyRecords?.length || 0 }} {{ lang.isSwahili() ? 'siku' : 'days' }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-charcoal/60 mt-1 flex-wrap">
              <span>{{ lang.isSwahili() ? 'Vitengo vyako:' : 'Your Units:' }}</span>
              <span 
                *ngFor="let dept of getActiveDepartments()" 
                class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-forest/10 text-forest font-semibold"
              >
                <span>{{ dept }}</span>
                <button 
                  type="button" 
                  (click)="deleteDepartment(dept)" 
                  class="text-charcoal/40 hover:text-risk text-[10px]"
                  title="Remove this unit"
                >✕</button>
              </span>
              <button 
                type="button" 
                (click)="showAddDepartmentPrompt = !showAddDepartmentPrompt"
                class="text-gold-dark hover:underline font-bold text-[10px]"
              >
                + {{ lang.isSwahili() ? 'Ongeza' : 'Add Unit' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-center">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{{ lang.isSwahili() ? 'Hifadhi Imara (Saved)' : 'Auto-Saved & Persistent' }}</span>
          </span>
        </div>
      </div>

      <!-- ================= 0. MANDATORY AUTHENTICATION GATE ================= -->
      <div *ngIf="!auth.currentUser()" class="max-w-md mx-auto bg-white rounded-sheet border border-forest-line/15 shadow-xl p-6 sm:p-10 space-y-6 text-center animate-fadeIn my-6">
        <div class="w-12 h-12 mx-auto rounded-full bg-forest text-gold flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-serif font-bold text-charcoal">
            {{ isLoginMode 
              ? (lang.isSwahili() ? 'Ingia Kukuza Biashara Yako' : 'Sign In to Diagnose & Scale') 
              : (lang.isSwahili() ? 'Fungua Akaunti Kuanza Utatuzi' : 'Create Account to Diagnose & Scale') 
            }}
          </h2>
          <p class="text-xs text-charcoal/65">
            {{ lang.isSwahili()
              ? 'Tafadhali ingia au jisajili ili uweze kuanza uchunguzi wa biashara, kuhifadhi mahesabu ya mauzo na kufungua mwongozo wa hatua kwa hatua.'
              : 'Please sign in or create an account to start your business diagnosis, track sales and unlock operational playbooks.'
            }}
          </p>
        </div>

        <!-- Google 1-Click Authentication -->
        <div class="space-y-3">
          <app-google-sign-in
            [text]="isLoginMode ? 'signin_with' : 'signup_with'"
            (signedIn)="onAuthSuccess()"
            (signInError)="authError = $event?.message || 'Google sign in failed'"
          ></app-google-sign-in>

          <div class="flex items-center my-3">
            <div class="flex-grow border-t border-forest-line/15"></div>
            <span class="px-3 text-[11px] text-charcoal/40 uppercase font-bold tracking-wider">
              {{ lang.isSwahili() ? 'Au tumia barua pepe' : 'Or continue with email' }}
            </span>
            <div class="flex-grow border-t border-forest-line/15"></div>
          </div>
        </div>

        <!-- Email & Password Form -->
        <form (submit)="onAuthSubmit($event)" class="space-y-3.5 text-left">
          <div *ngIf="!isLoginMode" class="space-y-1">
            <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal">
              {{ lang.isSwahili() ? 'Jina Kamili' : 'Full Name' }} *
            </label>
            <input
              type="text"
              [(ngModel)]="authForm.name"
              name="name"
              class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
              placeholder="e.g. Peter Kiprotich"
              [required]="!isLoginMode"
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

          <div *ngIf="authError" class="p-3 rounded-button bg-red-50 border border-red-200 text-xs text-rose-700 font-semibold">
            {{ authError }}
          </div>

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-gold-soft via-gold to-gold-dark hover:brightness-105 text-charcoal font-bold text-sm py-3.5 rounded-button shadow-gold-btn transition-all"
          >
            {{ isLoginMode
              ? (lang.isSwahili() ? 'Ingia & Anza Utatuzi →' : 'Sign In & Begin Diagnosis →')
              : (lang.isSwahili() ? 'Fungua Akaunti & Anza Utatuzi →' : 'Create Account & Begin Diagnosis →')
            }}
          </button>
        </form>

        <div class="text-center pt-1 border-t border-forest-line/10">
          <button
            type="button"
            (click)="isLoginMode = !isLoginMode; authError = ''"
            class="text-xs text-forest hover:text-gold font-semibold transition-colors"
          >
            <span *ngIf="isLoginMode">
              {{ lang.isSwahili() ? 'Huna akaunti bado? Jisajili hapa' : 'Need an account? Sign up here' }}
            </span>
            <span *ngIf="!isLoginMode">
              {{ lang.isSwahili() ? 'Tayari una akaunti? Ingia hapa' : 'Already have an account? Sign in here' }}
            </span>
          </button>
        </div>
      </div>

      <!-- ================= 1. ONBOARDING (IF NO PROFILE YET) ================= -->
      <div *ngIf="auth.currentUser() && !activeProfile && !loading" class="bg-white rounded-sheet border border-forest-line/15 shadow-light-md p-6 sm:p-10 space-y-8">
        <div class="border-b border-forest-line/10 pb-4">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? '1. Wasifu wa Biashara Yako' : '1. Business Profile & Basics' }}
          </h2>
          <p class="text-xs text-charcoal/70 mt-1">
            {{ lang.isSwahili()
              ? 'Tueleze kuhusu biashara yako ili kuanza kufuatilia mauzo ya kila siku.'
              : 'Tell us about your business or shop to unlock daily tracking and intelligence.'
            }}
          </p>
        </div>

        <form (submit)="submitOnboarding($event)" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Jina la Biashara / Duka' : 'Business / Shop Name' }} *
              </label>
              <input
                type="text"
                [(ngModel)]="onboardingForm.businessName"
                name="businessName"
                [placeholder]="lang.isSwahili() ? 'mfano: Duka Langu Kuu' : 'e.g. Main Shop / Business'"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-sm focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Aina ya Biashara' : 'Type of Business' }} *
              </label>
              <input
                type="text"
                [(ngModel)]="onboardingForm.businessType"
                name="businessType"
                [placeholder]="lang.isSwahili() ? 'mfano: Retail, Food & Beverage, Services' : 'e.g. Retail Shop, Minimart, Salon'"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-sm focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Muda wa Uendeshaji' : 'Operating Duration' }} *
              </label>
              <select
                [(ngModel)]="onboardingForm.operatingDuration"
                name="operatingDuration"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-sm focus:outline-none focus:border-gold"
                required
              >
                <option value="Just getting started (Under 6 months)">Just getting started (Under 6 months)</option>
                <option value="6 months to 1 year">6 months to 1 year</option>
                <option value="1 to 3 years">1 to 3 years</option>
                <option value="More than 3 years">More than 3 years</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Vitengo / Idara za Kuanzia' : 'Initial Units / Departments (Comma Separated)' }}
              </label>
              <input
                type="text"
                [(ngModel)]="onboardingForm.departments"
                name="departments"
                placeholder="SHOP, SERVICES, PRODUCTS"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-sm focus:outline-none focus:border-gold uppercase"
              />
            </div>
          </div>

          <div *ngIf="onboardingError" class="p-3 bg-red-50 text-risk text-xs rounded font-semibold">
            {{ onboardingError }}
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-forest hover:bg-forest-deep text-gold font-bold text-sm py-4 rounded-button shadow transition-all flex items-center justify-center gap-2"
          >
            <span *ngIf="loading" class="animate-spin text-lg">↻</span>
            <span>{{ lang.isSwahili() ? 'Hifadhi Wasifu & Anza Kurekodi →' : 'Save Profile & Start Tracking →' }}</span>
          </button>
        </form>
      </div>

      <!-- ================= 2. ACTIVE DASHBOARD ================= -->
      <div *ngIf="auth.currentUser() && activeProfile" class="space-y-6">

        <!-- SUCCESS ALERT -->
        <div *ngIf="saveSuccessMessage" class="p-4 rounded-card bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ saveSuccessMessage }}</span>
          </div>
          <button (click)="saveSuccessMessage = ''" class="text-emerald-700 hover:text-emerald-950 font-bold ml-2">✕</button>
        </div>

        <!-- NAVIGATION TABS -->
        <div class="flex items-center gap-2 border-b border-forest-line/15 overflow-x-auto pb-1">
          <button
            *ngFor="let tab of tabs"
            (click)="currentTab = tab.id"
            class="px-4 py-2.5 text-xs font-bold rounded-t-card transition-all border-b-2 whitespace-nowrap flex items-center gap-2"
            [ngClass]="currentTab === tab.id 
              ? 'border-gold text-forest bg-white shadow-sm' 
              : 'border-transparent text-charcoal/60 hover:text-charcoal hover:bg-forest-line/5'"
          >
            <span>{{ lang.isSwahili() ? tab.labelSw : tab.label }}</span>
            <span *ngIf="tab.badge" class="px-1.5 py-0.5 rounded-pill bg-gold text-forest-deep text-[10px] font-bold">
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <!-- ================= TAB 1: DAILY SALES & EXPENSES TRACKING ================= -->
        <div *ngIf="currentTab === 'daily'" class="space-y-6">
          
          <!-- Daily Entry Card -->
          <div id="daily-entry-card" class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            
            <!-- EDITING NOTICE BANNER IF IN EDIT MODE -->
            <div *ngIf="editingRecordId" class="p-3 bg-amber-50 border border-amber-300 rounded-card flex items-center justify-between text-xs text-amber-900 animate-fadeIn">
              <div class="flex items-center gap-2 font-bold">
                <span>✏️</span>
                <span>{{ lang.isSwahili() ? 'Unarekebisha kumbukumbu ya tarehe:' : 'Editing Record for:' }} <strong>{{ dailyDraft.date }}</strong></span>
              </div>
              <button 
                type="button" 
                (click)="cancelEdit()"
                class="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded font-bold text-amber-900 text-xs"
              >
                {{ lang.isSwahili() ? 'Ghairi (Cancel)' : 'Cancel Edit' }}
              </button>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-line/10 pb-4">
              <div>
                <h3 class="text-lg font-serif font-bold text-charcoal">
                  {{ editingRecordId 
                    ? (lang.isSwahili() ? 'Rekebisha Kumbukumbu ya Siku' : 'Edit Daily Sales & Expenses') 
                    : (lang.isSwahili() ? 'Rekodi Mauzo na Matumizi ya Siku' : 'Record Daily Sales & Expenses') 
                  }}
                </h3>
                <p class="text-xs text-charcoal/70">
                  {{ lang.isSwahili() ? 'Jaza mauzo kwa vitengo ulivyoongeza au jumla ya siku. Data zote zinahifadhiwa moja kwa moja.' : 'Enter sales by your custom units (Till & Cash) or simple totals. Everything is saved permanently.' }}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <label class="text-xs font-bold text-charcoal/70">{{ lang.isSwahili() ? 'Tarehe:' : 'Date:' }}</label>
                  <input
                    type="date"
                    [(ngModel)]="dailyDraft.date"
                    class="p-2 text-xs font-bold rounded-button border border-forest-line/20 bg-ivory text-forest"
                  />
                </div>

                <!-- WhatsApp Quick Import Trigger -->
                <button
                  type="button"
                  (click)="showWhatsAppImporter = true"
                  class="px-3 py-1.5 rounded-button bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  title="Import WhatsApp Sales"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Bandika WhatsApp' : 'Paste WhatsApp' }}</span>
                </button>
              </div>
            </div>

            <!-- Dynamic Department-Level Sales Inputs -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                    <span>{{ lang.isSwahili() ? 'Mauzo kwa Kila Kitengo / Idara (Till & Taslimu)' : 'Sales by Unit / Department (Till & Cash)' }}</span>
                  </h4>
                  <p class="text-[11px] text-charcoal/60">
                    {{ lang.isSwahili() ? 'Unaweza kuongeza kitengo chochote unachouza (mfano: Nguo, Vinywaji, Saluni, n.k.).' : 'Enter Till and Cash for each of your business units or add new ones.' }}
                  </p>
                </div>

                <button
                  type="button"
                  (click)="showAddDepartmentPrompt = !showAddDepartmentPrompt"
                  class="text-xs text-forest hover:text-gold font-bold flex items-center gap-1"
                >
                  <span>+</span>
                  <span>{{ lang.isSwahili() ? 'Ongeza Kitengo Kipya' : 'Add Unit / Department' }}</span>
                </button>
              </div>

              <!-- New Department Quick Adder -->
              <div *ngIf="showAddDepartmentPrompt" class="p-3 bg-ivory rounded-card border border-forest-line/20 flex items-center gap-2">
                <input
                  type="text"
                  [(ngModel)]="newDepartmentName"
                  [placeholder]="lang.isSwahili() ? 'Jina la kitengo (mfano: BAKERY, VIBARUA, CLOTHES)' : 'Unit name (e.g., BAKERY, ACCESSORIES, CLOTHES)'"
                  class="flex-1 p-2 text-xs rounded border border-forest-line/20 bg-white uppercase font-bold"
                />
                <button
                  type="button"
                  (click)="addNewDepartment()"
                  class="px-3 py-2 rounded bg-forest text-gold text-xs font-bold hover:bg-forest-deep"
                >
                  {{ lang.isSwahili() ? 'Hifadhi Kitengo' : 'Add Unit' }}
                </button>
                <button
                  type="button"
                  (click)="showAddDepartmentPrompt = false"
                  class="text-xs text-charcoal/60 px-2"
                >
                  ✕
                </button>
              </div>

              <!-- Units Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  *ngFor="let dept of getActiveDepartments()" 
                  class="p-3.5 rounded-card bg-ivory border border-forest-line/15 space-y-2 hover:border-gold/50 transition-colors relative"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold uppercase tracking-wider text-forest-deep">{{ dept }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-forest">
                        KSh {{ getDepartmentSubtotal(dept) | number }}
                      </span>
                      <button 
                        type="button" 
                        (click)="deleteDepartment(dept)"
                        class="text-charcoal/30 hover:text-risk text-xs font-bold px-1"
                        title="Remove unit"
                      >✕</button>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label class="block text-[10px] uppercase font-bold text-emerald-700">Till (M-Pesa)</label>
                      <input
                        type="number"
                        [(ngModel)]="departmentSales[dept].till"
                        (input)="onDepartmentSalesChanged()"
                        placeholder="0"
                        class="w-full p-2 rounded border border-forest-line/20 bg-white text-xs font-bold focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label class="block text-[10px] uppercase font-bold text-amber-700">Cash (Taslimu)</label>
                      <input
                        type="number"
                        [(ngModel)]="departmentSales[dept].cash"
                        (input)="onDepartmentSalesChanged()"
                        placeholder="0"
                        class="w-full p-2 rounded border border-forest-line/20 bg-white text-xs font-bold focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Live Totals Bar -->
              <div class="p-3 bg-forest/5 rounded-card border border-forest-line/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-4">
                  <div>
                    <span class="text-[10px] uppercase font-bold text-emerald-700 block">Total Till:</span>
                    <strong class="text-emerald-800 text-sm font-bold">KSh {{ getTotalTill() | number }}</strong>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-amber-700 block">Total Cash:</span>
                    <strong class="text-amber-800 text-sm font-bold">KSh {{ getTotalCash() | number }}</strong>
                  </div>
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-forest block">{{ lang.isSwahili() ? 'Jumla ya Mauzo Leo:' : 'Total Daily Sales:' }}</span>
                  <strong class="text-forest text-base font-extrabold">KSh {{ getTotalSales() | number }}</strong>
                </div>
              </div>
            </div>

            <!-- Daily Expenses Section -->
            <div class="space-y-4 pt-2 border-t border-forest-line/10">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-risk flex items-center gap-2">
                    <span>{{ lang.isSwahili() ? 'Matumizi ya Biashara (Expenses)' : 'Daily Business Expenses' }}</span>
                  </h4>
                  <p class="text-[11px] text-charcoal/60">
                    {{ lang.isSwahili() ? 'Mishahara, ununuzi wa mzigo, bili, nauli, n.k.' : 'Wages, stock runs, utilities, transport, bags, etc.' }}
                  </p>
                </div>
                <button
                  type="button"
                  (click)="addExpenseItem()"
                  class="text-xs text-risk hover:text-risk-dark font-bold flex items-center gap-1"
                >
                  <span>+</span>
                  <span>{{ lang.isSwahili() ? 'Ongeza Matumizi' : 'Add Expense Item' }}</span>
                </button>
              </div>

              <!-- Itemized Expenses Table -->
              <div class="space-y-2">
                <div *ngFor="let exp of expenseList; let i = index" class="flex items-center gap-2">
                  <input
                    type="text"
                    [(ngModel)]="exp.category"
                    [placeholder]="lang.isSwahili() ? 'Maelezo ya matumizi' : 'Expense description (e.g. Wages, Stock, Transport)'"
                    class="flex-1 p-2 text-xs rounded border border-forest-line/20 bg-white"
                  />
                  <div class="w-32 relative">
                    <span class="absolute left-2.5 top-2 text-[10px] font-bold text-charcoal/40">KSh</span>
                    <input
                      type="number"
                      [(ngModel)]="exp.amount"
                      placeholder="0"
                      class="w-full pl-9 pr-3 py-2 text-xs font-bold rounded border border-forest-line/20 bg-white text-right"
                    />
                  </div>
                  <button
                    type="button"
                    (click)="removeExpenseItem(i)"
                    class="text-risk font-bold text-xs p-1.5 hover:bg-risk/10 rounded"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div class="flex justify-end text-xs text-charcoal/80 pt-1">
                <span>{{ lang.isSwahili() ? 'Jumla ya Matumizi:' : 'Total Expenses:' }} <strong class="text-risk font-bold">KSh {{ getTotalExpenses() | number }}</strong></span>
              </div>
            </div>

            <!-- ESTIMATED PROFIT DISPLAY -->
            <div class="p-5 rounded-card bg-forest-deep text-ivory flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-forest-line">
              <div class="space-y-0.5">
                <span class="text-[10px] font-bold uppercase tracking-widest text-gold">
                  {{ lang.isSwahili() ? 'Makadirio ya Faida (Estimated Profit)' : 'Estimated Profit (Sales − Expenses)' }}
                </span>
                <p class="text-2xl sm:text-3xl font-serif font-bold" [ngClass]="getEstimatedDailyProfit() >= 0 ? 'text-gold' : 'text-risk'">
                  KSh {{ getEstimatedDailyProfit() | number }}
                </p>
              </div>
              <div class="text-right sm:max-w-xs text-[11px] text-ivory/60 leading-tight">
                {{ lang.isSwahili() 
                  ? 'Imehesabiwa mara moja kulingana na mauzo na matumizi uliyojaza.' 
                  : 'Calculated instantly from entered sales and recorded expenses.' 
                }}
              </div>
            </div>

            <!-- SAVE / UPDATE DAILY RECORD BUTTON -->
            <div class="flex items-center gap-3">
              <button
                type="button"
                (click)="saveDailyRecord()"
                [disabled]="savingDaily || (getTotalSales() === 0 && getTotalExpenses() === 0)"
                class="flex-1 bg-forest hover:bg-forest-deep text-gold font-bold text-sm py-4 rounded-button shadow transition-all flex items-center justify-center gap-2"
              >
                <svg *ngIf="savingDaily" class="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {{ editingRecordId 
                    ? (lang.isSwahili() ? 'Hifadhi Mabadiliko ya Tarehe ' + dailyDraft.date : 'Update Record for ' + dailyDraft.date) 
                    : (lang.isSwahili() ? 'Hifadhi Kumbukumbu ya Mauzo (Save Permanently)' : 'Save Record (Permanent)') 
                  }}
                </span>
              </button>

              <button
                *ngIf="editingRecordId"
                type="button"
                (click)="cancelEdit()"
                class="px-5 py-4 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal font-bold text-xs rounded-button"
              >
                {{ lang.isSwahili() ? 'Ghairi' : 'Cancel' }}
              </button>
            </div>

          </div>

          <!-- ================= COMPASS AI DAILY SALES INTELLIGENCE ================= -->
          <div id="daily-ai-intelligence-card" class="bg-forest-deep text-ivory rounded-sheet border border-gold/30 p-6 sm:p-8 shadow-light-lg space-y-6 animate-fadeIn">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-line/30 pb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                    ✨ COMPASS AI INTELLIGENCE
                  </span>
                  <span *ngIf="getDisplayAiReport() as rep" class="text-[10px] text-ivory/60">
                    {{ rep.timeframe?.toUpperCase() }} ({{ rep.recordsCount || activeProfile.dailyRecords?.length }} {{ lang.isSwahili() ? 'siku' : 'days' }})
                  </span>
                </div>
                <h3 class="text-lg font-serif font-bold text-ivory">
                  {{ lang.isSwahili() ? 'Uchambuzi wa Mauzo wa AI & Ushauri wa Kila Siku' : 'Daily AI Sales Intelligence & Recommendations' }}
                </h3>
                <p class="text-xs text-ivory/70">
                  {{ lang.isSwahili() 
                    ? 'Pata mwongozo wa papo hapo kuhusu mwenendo wa vitengo vyako, faida halisi, na usimamizi salama wa Till dhidi ya Fedha Taslimu.' 
                    : 'Instant diagnosis of revenue trends, profit margins, unit performance, and cash vs Till flow.' 
                  }}
                </p>
              </div>

              <!-- Timeframe & Trigger Actions -->
              <div class="flex flex-wrap items-center gap-2.5">
                <!-- Timeframe Selector -->
                <div class="flex items-center bg-forest/80 p-1 rounded-card border border-forest-line/30 text-xs">
                  <button
                    type="button"
                    (click)="selectedAiTimeframe = 'week'"
                    class="px-2.5 py-1 font-bold rounded transition-colors text-xs"
                    [ngClass]="selectedAiTimeframe === 'week' ? 'bg-gold text-forest-deep' : 'text-ivory hover:text-gold'"
                  >
                    {{ lang.isSwahili() ? 'Wiki (7d)' : '7 Days' }}
                  </button>
                  <button
                    type="button"
                    (click)="selectedAiTimeframe = 'month'"
                    class="px-2.5 py-1 font-bold rounded transition-colors text-xs"
                    [ngClass]="selectedAiTimeframe === 'month' ? 'bg-gold text-forest-deep' : 'text-ivory hover:text-gold'"
                  >
                    {{ lang.isSwahili() ? 'Mwezi (30d)' : '30 Days' }}
                  </button>
                  <button
                    type="button"
                    (click)="selectedAiTimeframe = 'all'"
                    class="px-2.5 py-1 font-bold rounded transition-colors text-xs"
                    [ngClass]="selectedAiTimeframe === 'all' ? 'bg-gold text-forest-deep' : 'text-ivory hover:text-gold'"
                  >
                    {{ lang.isSwahili() ? 'Yote' : 'All Time' }}
                  </button>
                </div>

                <!-- Run AI Analysis Button -->
                <button
                  type="button"
                  (click)="triggerAiAnalysis(selectedAiTimeframe)"
                  [disabled]="runningAiAnalysis || (!activeProfile.dailyRecords || activeProfile.dailyRecords.length === 0)"
                  class="px-4 py-2 rounded-button bg-gradient-to-r from-gold-soft via-gold to-gold-dark hover:brightness-105 text-forest-deep text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg *ngIf="runningAiAnalysis" class="w-4 h-4 animate-spin text-forest-deep" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>
                    {{ runningAiAnalysis 
                      ? (lang.isSwahili() ? 'Inachambua...' : 'Analyzing Sales...') 
                      : (lang.isSwahili() ? '✨ Chambua Mauzo' : '✨ Analyze Sales (AI)') 
                    }}
                  </span>
                </button>

                <!-- Collapse / Expand Toggle Button -->
                <button
                  type="button"
                  (click)="toggleDailyAi()"
                  class="px-3 py-2 rounded-button bg-forest/90 hover:bg-forest text-gold text-xs font-bold border border-gold/40 hover:border-gold flex items-center gap-1.5 transition-all shadow-sm"
                  [title]="isDailyAiCollapsed ? 'Expand AI Section' : 'Collapse AI Section'"
                >
                  <span class="text-xs">{{ isDailyAiCollapsed ? '▼' : '▲' }}</span>
                  <span>{{ isDailyAiCollapsed ? (lang.isSwahili() ? 'Fungua AI' : 'Expand AI') : (lang.isSwahili() ? 'Funga AI' : 'Collapse AI') }}</span>
                </button>
              </div>
            </div>

            <!-- COLLAPSED 1-LINE TEASER -->
            <div 
              *ngIf="isDailyAiCollapsed && !runningAiAnalysis" 
              (click)="isDailyAiCollapsed = false" 
              class="cursor-pointer p-3 bg-forest/40 hover:bg-forest/60 rounded-card border border-gold/25 flex items-center justify-between gap-3 text-xs transition-colors"
            >
              <div class="flex items-center gap-2 truncate">
                <span class="text-gold font-bold shrink-0">💡 {{ lang.isSwahili() ? 'Muhtasari wa AI:' : 'AI Key Insight:' }}</span>
                <span class="text-ivory/90 truncate font-semibold" *ngIf="getDisplayAiReport() as rep">
                  {{ lang.isSwahili() ? (rep.headlineSw || rep.headline) : rep.headline }}
                </span>
                <span class="text-ivory/60 truncate" *ngIf="!getDisplayAiReport()">
                  {{ lang.isSwahili() ? 'Bofya hapa au kitufe cha dhahabu kuchambua mauzo.' : 'Click to view strategic diagnosis and recommendations.' }}
                </span>
              </div>
              <span class="text-gold font-bold text-[11px] shrink-0 underline">
                {{ lang.isSwahili() ? 'Fungua Ripoti Kamili (Expand) →' : 'Expand Full AI Report →' }}
              </span>
            </div>

            <!-- EXPANDED CONTENT WRAPPER -->
            <div *ngIf="!isDailyAiCollapsed" class="space-y-6">

              <!-- LOADING STATE -->
              <div *ngIf="runningAiAnalysis" class="p-8 text-center bg-forest/40 rounded-card border border-forest-line/30 space-y-3 animate-pulse">
                <div class="inline-flex p-3 rounded-full bg-gold/10 text-gold mb-1">
                  <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-gold">
                  {{ lang.isSwahili() ? 'Compass AI inachambua takwimu zako za mauzo...' : 'Compass AI is analyzing your daily sales and margins...' }}
                </h4>
                <p class="text-xs text-ivory/60 max-w-md mx-auto">
                  {{ lang.isSwahili() 
                    ? 'Inakagua uwiano wa mapato kwa kila kitengo, mwenendo wa fedha za Till na taslimu, na kuandaa hatua thabiti za kiutendaji.' 
                    : 'Auditing unit-level contributions, Till vs Cash velocity, and calculating high-leverage business recommendations.' 
                  }}
                </p>
              </div>

              <!-- AI ANALYSIS REPORT WHEN AVAILABLE -->
              <div *ngIf="!runningAiAnalysis && getDisplayAiReport() as report" class="space-y-6">
                
                <!-- Report Executive Brief -->
                <div class="p-5 rounded-card bg-ivory text-charcoal border border-forest-line/20 space-y-2">
                  <div class="flex items-center justify-between text-xs text-charcoal/60">
                    <span class="font-bold uppercase tracking-wider text-forest">
                      {{ lang.isSwahili() ? 'Dirisha la Uchambuzi:' : 'Diagnosis Window:' }} {{ report.timeframe?.toUpperCase() }} ({{ report.recordsCount || activeProfile.dailyRecords?.length }} {{ lang.isSwahili() ? 'siku' : 'days' }})
                    </span>
                    <span *ngIf="report.analyzedAt" class="text-[11px] text-charcoal/50">
                      {{ report.analyzedAt | date:'medium' }}
                    </span>
                  </div>
                  <h4 class="text-base sm:text-lg font-serif font-bold text-forest-deep">
                    {{ lang.isSwahili() ? (report.headlineSw || report.headline) : report.headline }}
                  </h4>
                  <p class="text-xs text-charcoal/80 leading-relaxed">
                    {{ lang.isSwahili() ? (report.executiveSummarySw || report.executiveSummary) : report.executiveSummary }}
                  </p>
                </div>

                <!-- Actionable Recommendations Grid -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-2">
                      <span>🎯</span>
                      <span>{{ lang.isSwahili() ? 'Mpango Kazi na Hatua Zinazofuata (Action Plan):' : 'Prioritized Action Plan & Next Steps:' }}</span>
                    </h4>
                    <span class="text-[10px] text-ivory/50">
                      {{ lang.isSwahili() ? 'Zingatia hatua hizi kukuza mapato' : 'Execute to protect profit & increase revenue' }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div 
                      *ngFor="let rec of (lang.isSwahili() ? (report.actionableRecommendationsSw || report.actionableRecommendations) : report.actionableRecommendations); let i = index" 
                      class="p-4 rounded-card bg-ivory text-charcoal border border-forest-line/15 space-y-1.5 hover:border-gold transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-forest text-gold flex items-center justify-center font-bold text-[10px] shrink-0">{{ i + 1 }}</span>
                        <span class="font-bold text-charcoal">{{ lang.isSwahili() ? 'Hatua ya ' + (i + 1) : 'Action Item ' + (i + 1) }}</span>
                      </div>
                      <p class="text-[11px] text-charcoal/80 leading-relaxed pl-7">{{ rec }}</p>
                    </div>
                  </div>
                </div>

                <!-- Cash Flow & Expense Diagnostics Split -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div class="p-4 rounded-card bg-emerald-950/70 text-emerald-100 border border-emerald-500/30 space-y-1.5">
                    <h5 class="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <span>💵</span>
                      <span>{{ lang.isSwahili() ? 'Ushauri wa M-Pesa Till & Fedha Taslimu' : 'Till & Cash Flow Security' }}</span>
                    </h5>
                    <p class="text-[11px] text-emerald-100/90 leading-relaxed">
                      {{ lang.isSwahili() ? (report.cashFlowAdviceSw || report.cashFlowAdvice) : report.cashFlowAdvice }}
                    </p>
                  </div>

                  <div class="p-4 rounded-card bg-amber-950/70 text-amber-100 border border-amber-500/30 space-y-1.5">
                    <h5 class="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>{{ lang.isSwahili() ? 'Ukaguzi wa Gharama & Faida Halisi' : 'Expense & Margin Audit' }}</span>
                    </h5>
                    <p class="text-[11px] text-amber-100/90 leading-relaxed">
                      {{ report.expenseAudit }}
                    </p>
                  </div>
                </div>

              </div>

              <!-- NO REPORT RUN YET PROMPT -->
              <div *ngIf="!runningAiAnalysis && !getDisplayAiReport()" class="p-6 text-center bg-forest/40 rounded-card border border-forest-line/30 space-y-3">
                <p class="font-bold text-ivory text-sm">
                  {{ lang.isSwahili() ? 'Bado hujafanya uchambuzi wa AI kwa duka hili' : 'No AI Sales Analysis Run Yet' }}
                </p>
                <p class="text-xs text-ivory/70 max-w-md mx-auto">
                  {{ lang.isSwahili() 
                    ? 'Chagua kipindi (Wiki, Mwezi, au Yote) na ubofye kitufe cha dhahabu hapo juu ili AI ichambue mauzo yako na kukupa mwelekeo wa wazi.' 
                    : 'Select a timeframe (7 Days, 30 Days, or All Time) and click "Analyze Sales (AI)" to get strategic guidance on revenue drivers, profit margins, and next steps.' 
                  }}
                </p>
                <button
                  type="button"
                  (click)="triggerAiAnalysis(selectedAiTimeframe)"
                  [disabled]="!activeProfile.dailyRecords || activeProfile.dailyRecords.length === 0"
                  class="px-4 py-2 rounded-button bg-gold text-forest-deep text-xs font-bold hover:brightness-105 inline-flex items-center gap-2 shadow"
                >
                  <span>✨</span>
                  <span>{{ lang.isSwahili() ? 'Anzisha Uchambuzi wa AI Sasa' : 'Run AI Sales Analysis Now' }}</span>
                </button>
              </div>

            </div>

          </div>

          <!-- RECENT DAILY RECORDS TABLE WITH EDIT BUTTON -->
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 shadow-light-md space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-serif font-bold text-charcoal uppercase tracking-wider">
                  {{ lang.isSwahili() ? 'Historia ya Mauzo Yaliyohifadhiwa' : 'Recorded Daily History' }}
                </h4>
                <p class="text-[11px] text-charcoal/60">{{ lang.isSwahili() ? 'Unaweza kubonyeza kitufe cha kalamu (edit) kurekebisha siku yoyote.' : 'Click the edit icon on any day to update numbers or departments.' }}</p>
              </div>
              <span class="text-xs font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-pill">
                {{ (activeProfile.dailyRecords?.length || 0) }} {{ lang.isSwahili() ? 'siku zilizorekodiwa' : 'days logged' }}
              </span>
            </div>

            <div *ngIf="(!activeProfile.dailyRecords || activeProfile.dailyRecords.length === 0)" class="text-center py-8 text-xs text-charcoal/50 bg-ivory rounded-card">
              {{ lang.isSwahili() ? 'Bado hujarekodi siku yoyote. Weka nambari zako hapo juu kuanza!' : 'No daily records yet. Enter today’s sales and expenses above to begin!' }}
            </div>

            <div *ngIf="activeProfile.dailyRecords && activeProfile.dailyRecords.length > 0" class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-forest-line/20 bg-ivory/60 text-charcoal/80 uppercase font-bold text-[10px] tracking-wider">
                    <th class="py-3 px-3">{{ lang.isSwahili() ? 'Tarehe' : 'Date' }}</th>
                    <th class="py-3 px-3">{{ lang.isSwahili() ? 'Mauzo (Sales)' : 'Sales' }}</th>
                    <th class="py-3 px-3">{{ lang.isSwahili() ? 'Till / Cash' : 'Till / Cash' }}</th>
                    <th class="py-3 px-3">{{ lang.isSwahili() ? 'Matumizi (Expenses)' : 'Expenses' }}</th>
                    <th class="py-3 px-3">{{ lang.isSwahili() ? 'Faida (Profit)' : 'Est. Profit' }}</th>
                    <th class="py-3 px-3">{{ lang.isSwahili() ? 'Vitengo (Departments)' : 'Department Units' }}</th>
                    <th class="py-3 px-3 text-right">{{ lang.isSwahili() ? 'Rekebisha / Futa' : 'Edit / Delete' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr 
                    *ngFor="let rec of activeProfile.dailyRecords" 
                    class="hover:bg-ivory/40 transition-colors"
                    [ngClass]="editingRecordId === rec.id ? 'bg-amber-50/70 border-l-4 border-amber-500' : ''"
                  >
                    <td class="py-3 px-3 font-semibold text-charcoal whitespace-nowrap">{{ rec.date }}</td>
                    <td class="py-3 px-3 font-bold text-forest">KSh {{ rec.sales | number }}</td>
                    <td class="py-3 px-3 whitespace-nowrap">
                      <span *ngIf="rec.tillTotal" class="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold mr-1">T: {{ rec.tillTotal | number }}</span>
                      <span *ngIf="rec.cashTotal" class="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">C: {{ rec.cashTotal | number }}</span>
                    </td>
                    <td class="py-3 px-3 text-risk font-semibold">
                      KSh {{ rec.expenses | number }}
                      <span *ngIf="rec.expenseBreakdown && rec.expenseBreakdown.length > 0" class="block text-[10px] text-charcoal/50">
                        {{ rec.expenseBreakdown.length }} items
                      </span>
                    </td>
                    <td class="py-3 px-3 font-bold" [ngClass]="rec.estimatedProfit >= 0 ? 'text-forest' : 'text-risk'">
                      KSh {{ rec.estimatedProfit | number }}
                    </td>
                    <td class="py-3 px-3 text-[11px] text-charcoal/70">
                      <div class="flex flex-wrap gap-1 max-w-xs">
                        <span 
                          *ngFor="let d of rec.departmentBreakdown" 
                          class="px-1.5 py-0.5 bg-forest-line/10 rounded text-[10px] font-semibold text-charcoal"
                        >
                          {{ d.department }}: {{ d.total | number }}
                        </span>
                        <span *ngIf="!rec.departmentBreakdown || rec.departmentBreakdown.length === 0" class="text-charcoal/40">—</span>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-right whitespace-nowrap">
                      <!-- Edit Button -->
                      <button
                        (click)="editRecord(rec)"
                        class="text-forest hover:text-forest-deep p-1.5 rounded transition-colors mr-1 font-bold text-xs"
                        title="Edit this record"
                      >
                        <svg class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <!-- Delete Button -->
                      <button
                        (click)="deleteRecord(rec.id)"
                        class="text-risk/60 hover:text-risk p-1.5 rounded transition-colors text-xs"
                        title="Delete record"
                      >
                        <svg class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ================= TAB 2: BUSINESS UNITS & ANALYTICS ================= -->
        <div *ngIf="currentTab === 'analytics'" class="space-y-6">
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="border-b border-forest-line/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-lg font-serif font-bold text-charcoal">
                  {{ lang.isSwahili() ? 'Uchambuzi wa Vitengo & Mauzo ya Biashara' : 'Business Units & Department Analytics' }}
                </h3>
                <p class="text-xs text-charcoal/70">
                  {{ lang.isSwahili() 
                    ? 'Tazama ni kitengo gani kinaleta faida na mapato makubwa zaidi, mgawanyo wa M-Pesa dhidi ya Taslimu, na gharama zako kuu.' 
                    : 'Deep breakdown of revenue by department, Till vs Cash, and expense drivers.' 
                  }}
                </p>
              </div>

              <!-- Quick Run AI button from analytics tab -->
              <button
                (click)="currentTab = 'advice'; triggerAiAnalysis(selectedAiTimeframe)"
                class="px-4 py-2 rounded-button bg-forest text-gold text-xs font-bold hover:bg-forest-deep shadow flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>✨</span>
                <span>{{ lang.isSwahili() ? 'Fanya Uchambuzi wa AI' : 'Run AI Sales Analysis' }}</span>
              </button>
            </div>

            <!-- Top Highlights Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">{{ lang.isSwahili() ? 'Jumla ya Mauzo' : 'Total Sales' }}</span>
                <p class="text-xl font-serif font-bold text-forest">KSh {{ (activeProfile.snapshot?.totalSales || 0) | number }}</p>
                <span class="text-[10px] text-charcoal/50">{{ activeProfile.dailyRecords?.length || 0 }} {{ lang.isSwahili() ? 'siku' : 'days logged' }}</span>
              </div>
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-emerald-700">Till (M-Pesa) Share</span>
                <p class="text-xl font-serif font-bold text-emerald-800">
                  {{ getTillPercentage() }}%
                </p>
                <span class="text-[10px] text-charcoal/50">KSh {{ (activeProfile.snapshot?.totalTill || 0) | number }}</span>
              </div>
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-amber-700">Cash (Taslimu) Share</span>
                <p class="text-xl font-serif font-bold text-amber-800">
                  {{ 100 - getTillPercentage() }}%
                </p>
                <span class="text-[10px] text-charcoal/50">KSh {{ (activeProfile.snapshot?.totalCash || 0) | number }}</span>
              </div>
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">{{ lang.isSwahili() ? 'Kitengo Kikuu' : 'Top Department' }}</span>
                <p class="text-lg font-serif font-bold text-gold-dark">{{ activeProfile.snapshot?.topDepartment || 'PRIMARY UNIT' }}</p>
                <span class="text-[10px] text-charcoal/50">{{ lang.isSwahili() ? 'Kinachoongoza kwa mauzo' : 'Leading revenue driver' }}</span>
              </div>
            </div>

            <!-- Revenue by Department Breakdown -->
            <div class="space-y-4 pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Mgawanyo wa Mapato kwa Vitengo (Revenue by Unit):' : 'Revenue by Unit Breakdown:' }}
              </h4>

              <div class="space-y-3">
                <div *ngFor="let dept of (activeProfile.snapshot?.departmentBreakdown || [])" class="p-3 bg-ivory rounded-card border border-forest-line/15 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-extrabold text-forest">{{ dept.name }}</span>
                      <span class="text-[10px] bg-forest/10 text-forest px-1.5 py-0.5 rounded font-bold">{{ dept.percent }}% of total</span>
                    </div>
                    <div class="text-right">
                      <strong class="text-charcoal font-bold">KSh {{ dept.sales | number }}</strong>
                      <span class="text-[10px] text-charcoal/50 block">Till: {{ dept.till | number }} · Cash: {{ dept.cash | number }}</span>
                    </div>
                  </div>
                  <div class="w-full bg-forest-line/20 rounded-full h-2.5 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-forest to-gold h-2.5 rounded-full" 
                      [style.width.%]="dept.percent"
                    ></div>
                  </div>
                </div>

                <div *ngIf="!activeProfile.snapshot?.departmentBreakdown || activeProfile.snapshot?.departmentBreakdown.length === 0" class="text-xs text-charcoal/50 py-4 text-center">
                  {{ lang.isSwahili() ? 'Hakuna mauzo ya vitengo yaliyorekodiwa bado.' : 'No department-level sales recorded yet.' }}
                </div>
              </div>
            </div>

            <!-- Expense Composition -->
            <div *ngIf="activeProfile.snapshot?.expenseCategories && activeProfile.snapshot?.expenseCategories.length > 0" class="space-y-3 pt-4 border-t border-forest-line/10">
              <h4 class="text-xs font-bold uppercase tracking-wider text-risk">
                {{ lang.isSwahili() ? 'Gharama Kuu za Biashara (Top Expense Drivers):' : 'Major Business Expenses Breakdown:' }}
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div *ngFor="let exp of activeProfile.snapshot.expenseCategories" class="p-3 bg-red-50/50 rounded-card border border-red-100 flex items-center justify-between">
                  <div>
                    <span class="font-bold text-charcoal block">{{ exp.category }}</span>
                    <span class="text-[10px] text-charcoal/50">{{ exp.percent }}% of all expenses</span>
                  </div>
                  <strong class="text-risk font-bold text-sm">KSh {{ exp.amount | number }}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= TAB 3: COMPASS AI SALES ANALYSIS & RECOMMENDATIONS ================= -->
        <div *ngIf="currentTab === 'advice'" class="space-y-6">
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            
            <!-- AI Analysis Trigger Bar -->
            <div class="p-5 rounded-sheet bg-gradient-to-r from-forest to-forest-deep text-ivory border border-gold/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-gold text-forest-deep text-[10px] font-extrabold uppercase tracking-wider">
                  <span>✨ Powered by Gemini AI</span>
                </div>
                <h3 class="text-lg font-serif font-bold text-ivory">
                  {{ lang.isSwahili() ? 'Uchambuzi wa Mauzo wa AI (AI Sales Diagnostic)' : 'Compass AI On-Demand Sales Diagnostic' }}
                </h3>
                <p class="text-xs text-ivory/80">
                  {{ lang.isSwahili() 
                    ? 'Chagua kipindi (wiki moja, mwezi mmoja, au mauzo yote) na ubofye kufanya uchambuzi wa kina.' 
                    : 'Select a timeframe and let Compass AI analyze your real numbers, unit velocity, and next moves.' 
                  }}
                </p>
              </div>

              <!-- Timeframe picker & Run Button -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div class="flex rounded-button overflow-hidden border border-gold/40 bg-forest-deep p-0.5 text-xs">
                  <button
                    type="button"
                    (click)="selectedAiTimeframe = 'week'"
                    class="px-3 py-1.5 font-bold rounded transition-colors"
                    [ngClass]="selectedAiTimeframe === 'week' ? 'bg-gold text-forest-deep' : 'text-ivory hover:text-gold'"
                  >
                    {{ lang.isSwahili() ? 'Wiki (7 Days)' : 'Week (7 Days)' }}
                  </button>
                  <button
                    type="button"
                    (click)="selectedAiTimeframe = 'month'"
                    class="px-3 py-1.5 font-bold rounded transition-colors"
                    [ngClass]="selectedAiTimeframe === 'month' ? 'bg-gold text-forest-deep' : 'text-ivory hover:text-gold'"
                  >
                    {{ lang.isSwahili() ? 'Mwezi (30 Days)' : 'Month (30 Days)' }}
                  </button>
                  <button
                    type="button"
                    (click)="selectedAiTimeframe = 'all'"
                    class="px-3 py-1.5 font-bold rounded transition-colors"
                    [ngClass]="selectedAiTimeframe === 'all' ? 'bg-gold text-forest-deep' : 'text-ivory hover:text-gold'"
                  >
                    {{ lang.isSwahili() ? 'Yote (All Days)' : 'All Time' }}
                  </button>
                </div>

                <button
                  type="button"
                  (click)="triggerAiAnalysis(selectedAiTimeframe)"
                  [disabled]="runningAiAnalysis || (!activeProfile.dailyRecords || activeProfile.dailyRecords.length === 0)"
                  class="px-5 py-2.5 rounded-button bg-gradient-to-r from-gold-soft via-gold to-gold-dark hover:brightness-105 text-forest-deep text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <svg *ngIf="runningAiAnalysis" class="w-4 h-4 animate-spin text-forest-deep" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>{{ runningAiAnalysis ? (lang.isSwahili() ? 'Inachambua...' : 'Analyzing Sales...') : (lang.isSwahili() ? '✨ Fanya Uchambuzi wa AI' : '✨ Run AI Analysis') }}</span>
                </button>
              </div>
            </div>

            <!-- AI REPORT CONTENT -->
            <div *ngIf="getDisplayAiReport() as report" class="space-y-6 animate-fadeIn">
              
              <!-- Report Header Banner -->
              <div class="p-5 rounded-card bg-ivory border border-forest-line/20 space-y-2">
                <div class="flex items-center justify-between text-xs text-charcoal/60">
                  <span class="font-bold uppercase tracking-wider text-forest">
                    {{ lang.isSwahili() ? 'Kipindi Kilichochambuliwa:' : 'Analysis Window:' }} {{ report.timeframe?.toUpperCase() }} ({{ report.recordsCount || activeProfile.dailyRecords?.length }} {{ lang.isSwahili() ? 'siku' : 'days' }})
                  </span>
                  <span *ngIf="report.analyzedAt" class="text-[11px]">
                    {{ report.analyzedAt | date:'medium' }}
                  </span>
                </div>
                <h4 class="text-base sm:text-lg font-serif font-bold text-forest-deep">
                  {{ lang.isSwahili() ? (report.headlineSw || report.headline) : report.headline }}
                </h4>
                <p class="text-xs text-charcoal/80 leading-relaxed">
                  {{ lang.isSwahili() ? (report.executiveSummarySw || report.executiveSummary) : report.executiveSummary }}
                </p>
              </div>

              <!-- Actionable Recommendations Grid -->
              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                  <span>🎯 {{ lang.isSwahili() ? 'Hatua Muhimu za Kuchukua (Next Steps):' : 'Prioritized Action Plan & Next Steps:' }}</span>
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div 
                    *ngFor="let rec of (lang.isSwahili() ? (report.actionableRecommendationsSw || report.actionableRecommendations) : report.actionableRecommendations); let i = index" 
                    class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1.5 hover:border-gold transition-colors"
                  >
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-forest text-gold flex items-center justify-center font-bold text-[10px]">{{ i + 1 }}</span>
                      <span class="font-bold text-charcoal">{{ lang.isSwahili() ? 'Hatua ya ' + (i + 1) : 'Action Item ' + (i + 1) }}</span>
                    </div>
                    <p class="text-[11px] text-charcoal/80 leading-relaxed">{{ rec }}</p>
                  </div>
                </div>
              </div>

              <!-- Cash Flow & Expense Audits -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="p-4 rounded-card bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <h5 class="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>💵</span>
                    <span>{{ lang.isSwahili() ? 'Ushauri wa M-Pesa Till & Fedha' : 'Till & Cash Flow Security' }}</span>
                  </h5>
                  <p class="text-emerald-950 text-[11px] leading-relaxed">
                    {{ lang.isSwahili() ? (report.cashFlowAdviceSw || report.cashFlowAdvice) : report.cashFlowAdvice }}
                  </p>
                </div>

                <div class="p-4 rounded-card bg-amber-50/60 border border-amber-200 space-y-1.5">
                  <h5 class="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>🔍</span>
                    <span>{{ lang.isSwahili() ? 'Ukaguzi wa Gharama & Faida' : 'Expense & Margin Audit' }}</span>
                  </h5>
                  <p class="text-amber-950 text-[11px] leading-relaxed">
                    {{ report.expenseAudit }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Prompt if no analysis yet -->
            <div *ngIf="!getDisplayAiReport() && !runningAiAnalysis" class="p-8 text-center text-xs text-charcoal/60 bg-ivory rounded-card border border-forest-line/15 space-y-2">
              <p class="font-bold text-charcoal text-sm">{{ lang.isSwahili() ? 'Bado hujafanya uchambuzi wa AI' : 'No AI Sales Analysis Run Yet' }}</p>
              <p>{{ lang.isSwahili() ? 'Bofya kitufe cha dhahabu hapo juu kufanya uchambuzi wa AI kwa mauzo ya wiki au mwezi.' : 'Select a timeframe above and click "Run AI Analysis" to get instant Gemini AI strategic guidance.' }}</p>
            </div>

          </div>
        </div>

        <!-- ================= TAB 4: STOCK TEMPLATE ================= -->
        <div *ngIf="currentTab === 'stock'" class="space-y-6">
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="border-b border-forest-line/10 pb-4">
              <h3 class="text-lg font-serif font-bold text-charcoal">
                {{ lang.isSwahili() ? 'Orodha ya Mzigo wa Duka' : 'Stock & Inventory Template' }}
              </h3>
              <p class="text-xs text-charcoal/70">
                {{ lang.isSwahili() ? 'Weka bidhaa unazouza ili kufuatilia idadi na faida ya kila bidhaa.' : 'Track stock levels, buying prices, and selling prices.' }}
              </p>
            </div>

            <!-- Add Stock Item Form -->
            <form (submit)="saveStockItem(); $event.preventDefault()" class="p-4 rounded-card bg-ivory border border-forest-line/20 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-forest">{{ lang.isSwahili() ? 'Ongeza Bidhaa Kwenye Mzigo' : 'Add Stock Item' }}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input
                  type="text"
                  [(ngModel)]="newStockItem.name"
                  name="name"
                  placeholder="Item name"
                  class="p-2.5 rounded border border-forest-line/20 bg-white"
                  required
                />
                <input
                  type="number"
                  [(ngModel)]="newStockItem.quantity"
                  name="quantity"
                  min="1"
                  placeholder="Quantity"
                  class="p-2.5 rounded border border-forest-line/20 bg-white"
                  required
                />
                <input
                  type="number"
                  [(ngModel)]="newStockItem.buyingPrice"
                  name="buyingPrice"
                  placeholder="Buying Price (KSh)"
                  class="p-2.5 rounded border border-forest-line/20 bg-white"
                  required
                />
                <input
                  type="number"
                  [(ngModel)]="newStockItem.sellingPrice"
                  name="sellingPrice"
                  placeholder="Selling Price (KSh)"
                  class="p-2.5 rounded border border-forest-line/20 bg-white"
                  required
                />
              </div>
              <button
                type="submit"
                [disabled]="savingStock || !newStockItem.name"
                class="px-4 py-2 rounded-button bg-forest text-gold text-xs font-bold hover:bg-forest-deep transition-all"
              >
                {{ lang.isSwahili() ? '+ Hifadhi Bidhaa' : '+ Add to Stock' }}
              </button>
            </form>

            <!-- Stock List Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-forest-line/20 bg-ivory/60 text-charcoal/80 uppercase font-bold text-[10px]">
                    <th class="py-2.5 px-3">Item</th>
                    <th class="py-2.5 px-3">Qty</th>
                    <th class="py-2.5 px-3">Buying Price</th>
                    <th class="py-2.5 px-3">Selling Price</th>
                    <th class="py-2.5 px-3">Margin</th>
                    <th class="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let item of activeProfile.stockItems" class="hover:bg-ivory/40">
                    <td class="py-2.5 px-3 font-semibold text-charcoal">{{ item.name }}</td>
                    <td class="py-2.5 px-3">{{ item.quantity }}</td>
                    <td class="py-2.5 px-3">KSh {{ item.buyingPrice | number }}</td>
                    <td class="py-2.5 px-3 font-bold text-forest">KSh {{ item.sellingPrice | number }}</td>
                    <td class="py-2.5 px-3 text-gold font-bold">KSh {{ (item.sellingPrice - item.buyingPrice) | number }}</td>
                    <td class="py-2.5 px-3 text-right">
                      <button (click)="deleteStock(item.id)" class="text-risk/60 hover:text-risk text-xs">✕</button>
                    </td>
                  </tr>
                  <tr *ngIf="!activeProfile.stockItems || activeProfile.stockItems.length === 0">
                    <td colspan="6" class="text-center py-6 text-charcoal/50">
                      {{ lang.isSwahili() ? 'Bado hujaongeza bidhaa kwenye mzigo.' : 'No stock items added yet.' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <!-- ================= TAB 5: MONEY PLAN ================= -->
        <div *ngIf="currentTab === 'money'" class="space-y-6">
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="border-b border-forest-line/10 pb-4">
              <h3 class="text-lg font-serif font-bold text-charcoal">
                {{ lang.isSwahili() ? 'Mpango wa Fedha za Biashara' : 'Business Money Allocation Plan' }}
              </h3>
              <p class="text-xs text-charcoal/70">
                {{ lang.isSwahili() ? 'Mgawanyo sahihi wa mapato yako ili kuhakikisha mtaji haudidii.' : 'Rule-of-thumb profit split to protect working capital.' }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                *ngFor="let item of activeProfile.moneyPlan?.allocations" 
                class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1.5"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-forest">{{ lang.isSwahili() ? item.categorySw : item.category }}</span>
                  <span class="text-xs font-extrabold text-gold bg-forest px-2 py-0.5 rounded-pill">{{ item.percentage }}%</span>
                </div>
                <p class="text-[11px] text-charcoal/70 leading-relaxed">{{ lang.isSwahili() ? item.purposeSw : item.purpose }}</p>
              </div>
            </div>

            <div class="p-4 rounded-card bg-forest-deep text-ivory border border-gold/30 text-xs">
              <strong class="text-gold block mb-1 uppercase tracking-wider text-[10px]">Compass Rule of Thumb:</strong>
              {{ lang.isSwahili() ? activeProfile.moneyPlan?.recommendationSw : activeProfile.moneyPlan?.recommendation }}
            </div>
          </div>
        </div>

      </div>

      <!-- ================= MODAL: ADD NEW BUSINESS OR BRANCH ================= -->
      <div *ngIf="showNewBranchModal" class="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-white rounded-sheet max-w-lg w-full p-6 sm:p-8 space-y-5 border border-forest-line/20 shadow-2xl">
          <div class="flex items-center justify-between border-b border-forest-line/15 pb-3">
            <h3 class="text-lg font-serif font-bold text-charcoal">
              {{ lang.isSwahili() ? 'Ongeza Duka / Kitengo Jipya la Biashara' : 'Add New Business Unit or Branch' }}
            </h3>
            <button (click)="showNewBranchModal = false" class="text-charcoal/50 hover:text-charcoal font-bold text-lg">✕</button>
          </div>

          <form (submit)="saveNewBranch($event)" class="space-y-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-charcoal uppercase tracking-wider">Business / Shop Name *</label>
              <input
                type="text"
                [(ngModel)]="newBranchForm.businessName"
                name="businessName"
                placeholder="e.g. Downtown Branch, Shop 2"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-charcoal uppercase tracking-wider">Branch / Location Name *</label>
              <input
                type="text"
                [(ngModel)]="newBranchForm.branchName"
                name="branchName"
                placeholder="e.g. Branch A, Town Unit, Westlands"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-charcoal uppercase tracking-wider">Business Category / Type *</label>
              <input
                type="text"
                [(ngModel)]="newBranchForm.businessType"
                name="businessType"
                placeholder="e.g. Retail, Food & Beverage, Salon, Minimart"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-charcoal uppercase tracking-wider">Initial Units / Departments (Comma Separated)</label>
              <input
                type="text"
                [(ngModel)]="newBranchForm.departments"
                name="departments"
                placeholder="e.g. SHOP, SALES, PRODUCTS"
                class="w-full p-3 rounded-button border bg-ivory text-sm focus:outline-none focus:border-gold uppercase"
              />
              <p class="text-[10px] text-charcoal/50">You can add or remove units at any time.</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-forest-line/10">
              <button
                type="button"
                (click)="showNewBranchModal = false"
                class="px-4 py-2.5 rounded-button text-xs font-bold text-charcoal/70 hover:bg-forest-line/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2.5 rounded-button bg-forest text-gold text-xs font-bold hover:bg-forest-deep shadow"
              >
                Create & Switch to Shop →
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ================= MODAL: WHATSAPP SMART SALES IMPORTER ================= -->
      <div *ngIf="showWhatsAppImporter" class="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-white rounded-sheet max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-forest-line/20 shadow-2xl max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between border-b border-forest-line/15 pb-3">
            <div>
              <h3 class="text-lg font-serif font-bold text-charcoal">
                {{ lang.isSwahili() ? 'Ingiza Mauzo kutoka Ujumbe wa WhatsApp' : 'Paste & Import WhatsApp Sales Notes' }}
              </h3>
              <p class="text-xs text-charcoal/60">
                {{ lang.isSwahili() ? 'Bandika ujumbe wako wa mauzo kutoka WhatsApp. Compass itachambua siku na idara zote mara moja.' : 'Paste daily sales summaries directly from your WhatsApp chat.' }}
              </p>
            </div>
            <button (click)="showWhatsAppImporter = false" class="text-charcoal/50 hover:text-charcoal font-bold text-lg">✕</button>
          </div>

          <div class="overflow-y-auto flex-1 space-y-4 pr-1">
            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Bandika Ujumbe Hapa Chini:' : 'Paste Raw Sales Text Here:' }}
              </label>
              <textarea
                [(ngModel)]="whatsAppRawInput"
                (input)="parseWhatsAppInput()"
                rows="7"
                placeholder="THURSDAY SALES 1-10-2026&#10;SALAD 70C&#10;CHIPS 80T 160C&#10;SHOP 400T 40C&#10;Total cash=270&#10;Total Till=580&#10;Expenses: Khaki 70, Ruth 250"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-xs font-mono focus:outline-none focus:border-gold"
              ></textarea>
            </div>

            <!-- Parsed Days Preview -->
            <div *ngIf="parsedDays.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-forest">
                  {{ parsedDays.length }} {{ lang.isSwahili() ? 'siku zimetambuliwa' : 'days detected successfully' }}
                </span>
                <span class="text-xs text-charcoal/60">
                  Total Sales: <strong class="text-forest">KSh {{ getParsedTotalSales() | number }}</strong>
                </span>
              </div>

              <div class="space-y-2 max-h-60 overflow-y-auto divide-y divide-forest-line/10 bg-ivory/50 rounded-card p-3 border border-forest-line/15">
                <div *ngFor="let day of parsedDays" class="pt-2 first:pt-0 text-xs">
                  <div class="flex items-center justify-between font-bold">
                    <span class="text-charcoal">{{ day.date }}</span>
                    <span class="text-forest">Sales: KSh {{ day.sales | number }}</span>
                    <span class="text-risk">Exp: KSh {{ day.expenses | number }}</span>
                    <span class="text-gold-dark font-extrabold">Profit: KSh {{ day.estimatedProfit | number }}</span>
                  </div>
                  <div class="text-[11px] text-charcoal/60 mt-1 flex flex-wrap gap-1">
                    <span *ngFor="let d of day.departmentBreakdown" class="bg-forest-line/10 px-1 rounded text-[10px]">
                      {{ d.department }}: {{ d.total | number }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="flex items-center justify-between pt-3 border-t border-forest-line/10">
            <button
              type="button"
              (click)="showWhatsAppImporter = false"
              class="px-4 py-2.5 rounded-button text-xs font-bold text-charcoal/70 hover:bg-forest-line/10"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="saveParsedDays()"
              [disabled]="parsedDays.length === 0 || savingDaily"
              class="px-6 py-2.5 rounded-button bg-forest text-gold text-xs font-bold hover:bg-forest-deep shadow flex items-center gap-2"
            >
              <span *ngIf="savingDaily" class="animate-spin text-sm">↻</span>
              <span>Import & Save {{ parsedDays.length }} Days Permanently →</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class GrowBusinessComponent implements OnInit {
  api = inject(ApiService);
  lang = inject(LanguageService);
  auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isLoginMode = false;
  authError = '';
  onboardingError = '';
  saveSuccessMessage = '';

  authForm = {
    name: '',
    email: '',
    password: ''
  };

  loading = false;
  savingDaily = false;
  savingStock = false;
  unlocking = false;
  runningAiAnalysis = false;

  currentTab: 'daily' | 'analytics' | 'advice' | 'stock' | 'money' | 'unlock' = 'daily';

  tabs = [
    { id: 'daily' as const, label: 'Daily Tracking', labelSw: 'Rekodi za Mauzo' },
    { id: 'analytics' as const, label: 'Units & Analytics', labelSw: 'Vitengo & Uchambuzi' },
    { id: 'advice' as const, label: 'Compass AI Advice', labelSw: 'Ushauri wa AI', badge: 'AI' },
    { id: 'stock' as const, label: 'Stock Template', labelSw: 'Orodha ya Mzigo' },
    { id: 'money' as const, label: 'Money Plan', labelSw: 'Mpango wa Fedha' },
    { id: 'unlock' as const, label: 'KSh 499 Pro', labelSw: 'KSh 499 Pro', badge: 'PRO' },
  ];

  onboardingForm = {
    businessName: '',
    businessType: '',
    operatingDuration: '1 to 3 years',
    departments: 'SHOP, SALES',
  };

  showNewBranchModal = false;
  newBranchForm = {
    businessName: '',
    branchName: 'Main Branch',
    businessType: 'Retail & Services',
    departments: 'SHOP, SALES',
  };

  showWhatsAppImporter = false;
  whatsAppRawInput = '';
  parsedDays: any[] = [];

  showAddDepartmentPrompt = false;
  newDepartmentName = '';

  // EDIT DAILY HISTORY STATE
  editingRecordId: string | null = null;

  dailyDraft = {
    date: new Date().toISOString().split('T')[0],
    sales: 0,
    expenses: 0,
  };

  departmentSales: Record<string, { cash: number; till: number }> = {};

  expenseList: ExpenseDraft[] = [
    { category: 'Daily Labor / Wages', amount: 0 }
  ];

  newStockItem = {
    name: '',
    quantity: 1,
    buyingPrice: 0,
    sellingPrice: 0,
  };

  availableProfiles: any[] = [];
  activeProfile: any = null;

  selectedAiTimeframe: 'week' | 'month' | 'all' = 'all';
  isDailyAiCollapsed = false;

  toggleDailyAi() {
    this.isDailyAiCollapsed = !this.isDailyAiCollapsed;
  }

  ngOnInit() {
    this.restoreCachedProfile();
    this.checkExistingProfile();
  }

  // Restore cached profile immediately to prevent blank state on refresh
  restoreCachedProfile() {
    const userId = this.auth.getEffectiveUserId();
    // Clean up any legacy unscoped active grow id that leaked across users
    localStorage.removeItem('compass_active_grow_id');

    if (!userId) return;
    const savedId = localStorage.getItem(`compass_active_grow_id_${userId}`);
    if (savedId) {
      const cached = localStorage.getItem(`compass_cached_grow_${userId}_${savedId}`);
      if (cached) {
        try {
          const profile = JSON.parse(cached);
          if (profile && (!profile.userId || profile.userId === userId)) {
            this.activeProfile = profile;
            this.initializeDepartmentInputs();
          }
        } catch {}
      }
    }
  }

  onAuthSuccess() {
    this.authError = '';
    // Clean up old active profile so fresh user data is fetched
    this.activeProfile = null;
    this.availableProfiles = [];
    this.checkExistingProfile();
  }

  onAuthSubmit(e: Event) {
    e.preventDefault();
    this.authError = '';

    if (!this.authForm.email || !this.authForm.password) {
      this.authError = this.lang.isSwahili() ? 'Tafadhali jaza barua pepe na nenosiri' : 'Please fill in email and password';
      return;
    }

    if (this.isLoginMode) {
      this.auth.login(this.authForm.email, this.authForm.password).subscribe({
        next: () => {
          this.onAuthSuccess();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.authError = err.error?.message || 'Login failed. Please check your credentials.';
          this.cdr.detectChanges();
        }
      });
    } else {
      if (!this.authForm.name) {
        this.authError = this.lang.isSwahili() ? 'Tafadhali jaza jina lako kamili' : 'Please enter your full name';
        return;
      }
      this.auth.register({
        name: this.authForm.name,
        email: this.authForm.email,
        password: this.authForm.password,
        language: this.lang.currentLang(),
      }).subscribe({
        next: () => {
          this.onAuthSuccess();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.auth.login(this.authForm.email, this.authForm.password).subscribe({
            next: () => {
              this.onAuthSuccess();
              this.cdr.detectChanges();
            },
            error: () => {
              this.authError = err.error?.message || 'Registration failed.';
              this.cdr.detectChanges();
            }
          });
        }
      });
    }
  }

  checkExistingProfile() {
    const userId = this.auth.getEffectiveUserId();
    localStorage.removeItem('compass_active_grow_id');

    const savedId = localStorage.getItem(`compass_active_grow_id_${userId}`);

    this.api.getRecentIntakes(userId).subscribe({
      next: (list: any[]) => {
        if (list && list.length > 0) {
          // Strictly isolate: only profiles that belong to current user
          const userProfiles = list.filter(p => !p.userId || p.userId === userId);
          if (userProfiles.length > 0) {
            this.availableProfiles = userProfiles;
            let target = userProfiles[0];
            if (savedId) {
              const found = userProfiles.find(p => p._id === savedId);
              if (found) target = found;
            }
            this.setActiveProfile(target);
            this.cdr.detectChanges();
            return;
          }
        }
        // Account has no existing business intakes yet: provide fresh clean slate
        this.availableProfiles = [];
        this.activeProfile = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.availableProfiles = [];
        this.activeProfile = null;
        this.cdr.detectChanges();
      }
    });
  }

  setActiveProfile(profile: any) {
    if (!profile) return;
    const userId = this.auth.getEffectiveUserId();
    if (userId && profile.userId && profile.userId !== userId) {
      console.warn('Security guard: Profile does not belong to active user');
      return;
    }
    this.activeProfile = profile;
    if (userId) {
      localStorage.setItem(`compass_active_grow_id_${userId}`, profile._id);
      localStorage.setItem(`compass_cached_grow_${userId}_${profile._id}`, JSON.stringify(profile));
    }
    this.initializeDepartmentInputs();
    this.cdr.detectChanges();
  }

  switchProfile(profileId: string) {
    const found = this.availableProfiles.find(p => p._id === profileId);
    if (found) {
      this.setActiveProfile(found);
      this.api.getGrowIntake(profileId).subscribe({
        next: res => {
          this.setActiveProfile(res);
        }
      });
    }
  }

  getActiveDepartments(): string[] {
    if (this.activeProfile?.departments && this.activeProfile.departments.length > 0) {
      return this.activeProfile.departments;
    }
    return ['SHOP', 'SALES'];
  }

  initializeDepartmentInputs() {
    const depts = this.getActiveDepartments();
    for (const d of depts) {
      if (!this.departmentSales[d]) {
        this.departmentSales[d] = { cash: 0, till: 0 };
      }
    }
  }

  getDepartmentSubtotal(dept: string): number {
    const d = this.departmentSales[dept];
    if (!d) return 0;
    return (Number(d.till) || 0) + (Number(d.cash) || 0);
  }

  getTotalTill(): number {
    return Object.values(this.departmentSales).reduce((sum, d) => sum + (Number(d.till) || 0), 0);
  }

  getTotalCash(): number {
    return Object.values(this.departmentSales).reduce((sum, d) => sum + (Number(d.cash) || 0), 0);
  }

  getTotalSales(): number {
    const deptTotal = this.getTotalTill() + this.getTotalCash();
    if (deptTotal > 0) return deptTotal;
    return Number(this.dailyDraft.sales) || 0;
  }

  getTotalExpenses(): number {
    const listTotal = this.expenseList.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    if (listTotal > 0) return listTotal;
    return Number(this.dailyDraft.expenses) || 0;
  }

  getEstimatedDailyProfit(): number {
    return this.getTotalSales() - this.getTotalExpenses();
  }

  onDepartmentSalesChanged() {
    this.dailyDraft.sales = this.getTotalSales();
  }

  addExpenseItem() {
    this.expenseList.push({ category: '', amount: 0 });
  }

  removeExpenseItem(index: number) {
    this.expenseList.splice(index, 1);
  }

  addNewDepartment() {
    if (!this.newDepartmentName.trim() || !this.activeProfile) return;
    const name = this.newDepartmentName.trim().toUpperCase();
    this.api.addDepartment(this.activeProfile._id, name).subscribe({
      next: res => {
        this.setActiveProfile(res);
        this.newDepartmentName = '';
        this.showAddDepartmentPrompt = false;
      }
    });
  }

  deleteDepartment(dept: string) {
    if (!this.activeProfile || !confirm(`Remove unit "${dept}"?`)) return;
    this.api.deleteDepartment(this.activeProfile._id, dept).subscribe({
      next: res => {
        this.setActiveProfile(res);
      }
    });
  }

  // --- EDIT DAILY HISTORY RECORD ---
  editRecord(rec: any) {
    this.editingRecordId = rec.id;
    this.dailyDraft.date = rec.date;
    this.dailyDraft.sales = rec.sales;
    this.dailyDraft.expenses = rec.expenses;

    // Reset current department inputs
    for (const dept of this.getActiveDepartments()) {
      this.departmentSales[dept] = { cash: 0, till: 0 };
    }

    // Populate from record's department breakdown
    if (rec.departmentBreakdown && rec.departmentBreakdown.length > 0) {
      for (const d of rec.departmentBreakdown) {
        const deptUpper = (d.department || 'GENERAL').toUpperCase();
        if (!this.activeProfile.departments.includes(deptUpper)) {
          this.activeProfile.departments.push(deptUpper);
        }
        this.departmentSales[deptUpper] = {
          cash: Number(d.cash) || 0,
          till: Number(d.till) || 0,
        };
      }
    } else {
      // If simple mode record, assign to first unit or simple sales
      const firstDept = this.getActiveDepartments()[0];
      if (firstDept) {
        this.departmentSales[firstDept] = {
          cash: Number(rec.cashTotal) || 0,
          till: Number(rec.tillTotal) || 0,
        };
      }
    }

    // Populate expense breakdown
    if (rec.expenseBreakdown && rec.expenseBreakdown.length > 0) {
      this.expenseList = rec.expenseBreakdown.map((e: any) => ({
        category: e.category,
        amount: Number(e.amount) || 0,
      }));
    } else {
      this.expenseList = [
        { category: 'Expenses', amount: Number(rec.expenses) || 0 }
      ];
    }

    // Scroll smoothly to entry card
    const el = document.getElementById('daily-entry-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingRecordId = null;
    this.resetDailyInputs();
    this.cdr.detectChanges();
  }

  saveDailyRecord() {
    if (!this.activeProfile) return;
    this.savingDaily = true;
    this.saveSuccessMessage = '';

    const depts = this.getActiveDepartments();
    const departmentBreakdown = depts
      .map(dept => ({
        department: dept,
        cash: Number(this.departmentSales[dept]?.cash) || 0,
        till: Number(this.departmentSales[dept]?.till) || 0,
        total: (Number(this.departmentSales[dept]?.cash) || 0) + (Number(this.departmentSales[dept]?.till) || 0),
      }))
      .filter(d => d.total > 0);

    const expenseBreakdown = this.expenseList
      .filter(e => (Number(e.amount) || 0) > 0)
      .map(e => ({
        category: e.category.trim() || 'General Expense',
        amount: Number(e.amount) || 0,
      }));

    const payload = {
      date: this.dailyDraft.date,
      sales: this.getTotalSales(),
      expenses: this.getTotalExpenses(),
      cashTotal: this.getTotalCash(),
      tillTotal: this.getTotalTill(),
      departmentBreakdown,
      expenseBreakdown,
    };

    // If editing existing record
    if (this.editingRecordId) {
      this.api.updateDailyRecord(this.activeProfile._id, this.editingRecordId, payload).subscribe({
        next: (res: any) => {
          this.savingDaily = false;
          this.setActiveProfile(res);
          this.saveSuccessMessage = `Record for ${this.dailyDraft.date} updated successfully!`;
          this.editingRecordId = null;
          this.resetDailyInputs();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.savingDaily = false;
          console.error(err);
          this.cdr.detectChanges();
        }
      });
      return;
    }

    // New daily record
    this.api.recordDailyTracking(this.activeProfile._id, payload).subscribe({
      next: (res: any) => {
        this.savingDaily = false;
        this.setActiveProfile(res.intake);
        this.saveSuccessMessage = `Record for ${this.dailyDraft.date} saved permanently!`;
        this.resetDailyInputs();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.savingDaily = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  resetDailyInputs() {
    for (const dept of this.getActiveDepartments()) {
      this.departmentSales[dept] = { cash: 0, till: 0 };
    }
    this.expenseList = [{ category: 'Daily Labor / Wages', amount: 0 }];
    this.dailyDraft.sales = 0;
    this.dailyDraft.expenses = 0;
  }

  deleteRecord(recordId: string) {
    if (!this.activeProfile || !confirm('Are you sure you want to delete this daily record?')) return;
    this.api.deleteDailyRecord(this.activeProfile._id, recordId).subscribe({
      next: res => {
        this.setActiveProfile(res);
      }
    });
  }

  // --- WHATSAPP DYNAMIC IMPORTER ---
  parseWhatsAppInput() {
    const text = this.whatsAppRawInput;
    if (!text.trim()) {
      this.parsedDays = [];
      return;
    }

    const dayHeaderRegex = /(?:MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)\s+SALES\s+(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/gi;
    const matches: any[] = [];
    let m: RegExpExecArray | null;
    while ((m = dayHeaderRegex.exec(text)) !== null) {
      matches.push({
        fullMatch: m[0],
        day: parseInt(m[1]),
        month: parseInt(m[2]),
        year: parseInt(m[3].length === 2 ? '20' + m[3] : m[3]),
        index: m.index
      });
    }

    const results: any[] = [];
    // Dynamic: also extract any capitalized unit words in the text
    const activeDepts = new Set(this.getActiveDepartments());
    const candidateWords = text.match(/\b[A-Z]{3,}\b/g) || [];
    for (const w of candidateWords) {
      if (!['TOTAL', 'TILL', 'CASH', 'EXPENSES', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(w)) {
        activeDepts.add(w);
      }
    }

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const chunk = text.substring(start, end);
      const dateStr = `${matches[i].year}-${String(matches[i].month).padStart(2, '0')}-${String(matches[i].day).padStart(2, '0')}`;

      let tillTotal = 0;
      let cashTotal = 0;
      const tillMatch = chunk.match(/TOTAL\s+TILL\s*[:=]\s*(\d+)/i) || chunk.match(/Total\s+Till\s*[:=]\s*(\d+)/i);
      if (tillMatch) tillTotal = parseInt(tillMatch[1]);
      const cashMatch = chunk.match(/TOTAL\s+CASH\s*[:=]\s*(\d+)/i) || chunk.match(/Total\s+cash\s*[:=]\s*(\d+)/i);
      if (cashMatch) cashTotal = parseInt(cashMatch[1]);

      const deptBreakdown: any[] = [];
      for (const d of activeDepts) {
        const dRegex = new RegExp(`\\b${d}\\b([^\\n]*(?:\\n(?![A-Z]{3,}|TOTAL|EXPENSES)[^\\n]*)*)`, 'i');
        const dMatch = chunk.match(dRegex);
        if (dMatch) {
          const body = dMatch[1];
          let dCash = 0;
          let dTill = 0;
          const tcMatches = [...body.matchAll(/(\d+)\s*([TC])/gi)];
          for (const tm of tcMatches) {
            const val = parseInt(tm[1]);
            const type = tm[2].toUpperCase();
            if (type === 'T') dTill += val;
            if (type === 'C') dCash += val;
          }
          if (dTill > 0 || dCash > 0) {
            deptBreakdown.push({ department: d, cash: dCash, till: dTill, total: dCash + dTill });
          }
        }
      }

      const expMatch = chunk.match(/EXPENSES?\s*[:=]?\s*([\s\S]*?)(?=(?:TOTAL\s+(?:VIAZI|OIL)|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|\n\s*\[|$))/i);
      const expensesList: any[] = [];
      let totalExpenses = 0;
      if (expMatch) {
        const expLines = expMatch[1].split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of expLines) {
          if (/TOTAL\s+(?:CASH|TILL)/i.test(line)) continue;
          const numMatch = line.match(/(.*?)(?:[:=\s]+)(\d+)(?:[cC]?)/);
          if (numMatch) {
            const cat = numMatch[1].replace(/^[-\*]\s*/, '').trim();
            const amt = parseInt(numMatch[2]);
            if (amt > 0 && cat.length > 0) {
              expensesList.push({ category: cat, amount: amt });
              totalExpenses += amt;
            }
          }
        }
      }

      const viaziMatch = chunk.match(/TOTAL\s+VIAZI\s*[:=]\s*(\d+)/i);
      if (viaziMatch) {
        const amt = parseInt(viaziMatch[1]);
        expensesList.push({ category: 'Viazi / Potatoes', amount: amt });
        totalExpenses += amt;
      }
      const oilMatch = chunk.match(/TOTAL\s+OIL\s*[:=]\s*(\d+)/i);
      if (oilMatch) {
        const amt = parseInt(oilMatch[1]);
        expensesList.push({ category: 'Cooking Oil', amount: amt });
        totalExpenses += amt;
      }

      const calcSales = (tillTotal || cashTotal) ? (tillTotal + cashTotal) : deptBreakdown.reduce((s, d) => s + d.total, 0);

      results.push({
        date: dateStr,
        sales: calcSales,
        expenses: totalExpenses,
        cashTotal,
        tillTotal,
        estimatedProfit: calcSales - totalExpenses,
        departmentBreakdown: deptBreakdown,
        expenseBreakdown: expensesList,
        rawText: chunk.trim()
      });
    }

    this.parsedDays = results;
  }

  getParsedTotalSales(): number {
    return this.parsedDays.reduce((sum, d) => sum + (d.sales || 0), 0);
  }

  saveParsedDays() {
    if (!this.activeProfile || this.parsedDays.length === 0) return;
    this.savingDaily = true;

    this.api.recordBulkDailyTracking(this.activeProfile._id, this.parsedDays).subscribe({
      next: res => {
        this.savingDaily = false;
        this.setActiveProfile(res);
        this.showWhatsAppImporter = false;
        this.whatsAppRawInput = '';
        this.parsedDays = [];
        this.saveSuccessMessage = `Successfully imported ${res.dailyRecords?.length || 0} days of sales!`;
        this.cdr.detectChanges();
      },
      error: err => {
        this.savingDaily = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  getTillPercentage(): number {
    const till = Number(this.activeProfile?.snapshot?.totalTill) || 0;
    const cash = Number(this.activeProfile?.snapshot?.totalCash) || 0;
    if (till + cash === 0) return 0;
    return Math.round((till / (till + cash)) * 100);
  }

  // --- RUN ON-DEMAND AI SALES ANALYSIS ---
  triggerAiAnalysis(timeframe: 'week' | 'month' | 'all') {
    if (!this.activeProfile) return;
    this.selectedAiTimeframe = timeframe;
    this.runningAiAnalysis = true;
    this.isDailyAiCollapsed = false;
    this.cdr.detectChanges();

    this.api.runAiSalesAnalysis(this.activeProfile._id, timeframe).subscribe({
      next: res => {
        this.runningAiAnalysis = false;
        if (!this.activeProfile.diagnostics) this.activeProfile.diagnostics = {};
        this.activeProfile.diagnostics.latestAiAnalysis = res;
        const userId = this.auth.getEffectiveUserId();
        if (userId) {
          localStorage.setItem(`compass_cached_grow_${userId}_${this.activeProfile._id}`, JSON.stringify(this.activeProfile));
        }
        this.saveSuccessMessage = `AI Analysis complete for ${timeframe.toUpperCase()}!`;
        this.cdr.detectChanges();
      },
      error: err => {
        this.runningAiAnalysis = false;
        console.error('AI Analysis failed:', err);
        this.cdr.detectChanges();
      }
    });
  }

  getDisplayAiReport(): any {
    return this.activeProfile?.diagnostics?.latestAiAnalysis || null;
  }

  // --- NEW BRANCH / SHOP MODAL ---
  saveNewBranch(e: Event) {
    e.preventDefault();
    if (!this.newBranchForm.businessName || !this.newBranchForm.branchName) return;

    const userId = this.auth.getEffectiveUserId();
    const depts = this.newBranchForm.departments
      .split(',')
      .map(d => d.trim().toUpperCase())
      .filter(Boolean);

    const payload = {
      userId,
      businessName: this.newBranchForm.businessName,
      branchName: this.newBranchForm.branchName,
      businessType: this.newBranchForm.businessType,
      operatingDuration: '1 to 3 years',
      biggestChallenge: 'Multi-shop sales and profit tracking',
      departments: depts.length > 0 ? depts : ['SHOP', 'SALES'],
    };

    this.api.submitGrowIntake(payload).subscribe({
      next: res => {
        this.availableProfiles.unshift(res);
        this.setActiveProfile(res);
        this.showNewBranchModal = false;
        this.newBranchForm = {
          businessName: '',
          branchName: 'Main Branch',
          businessType: 'Retail & Services',
          departments: 'SHOP, SALES',
        };
        this.saveSuccessMessage = `Created branch ${res.businessName} (${res.branchName}) successfully!`;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  submitOnboarding(e: Event) {
    e.preventDefault();
    if (!this.onboardingForm.businessName || !this.onboardingForm.businessType) return;

    this.loading = true;
    const userId = this.auth.getEffectiveUserId();

    const depts = this.onboardingForm.departments
      .split(',')
      .map(d => d.trim().toUpperCase())
      .filter(Boolean);

    const payload = {
      userId,
      businessName: this.onboardingForm.businessName,
      branchName: 'Main Branch',
      businessType: this.onboardingForm.businessType,
      operatingDuration: this.onboardingForm.operatingDuration,
      biggestChallenge: 'Daily sales and expense tracking',
      departments: depts.length > 0 ? depts : ['SHOP', 'SALES'],
    };

    this.api.submitGrowIntake(payload).subscribe({
      next: res => {
        this.loading = false;
        this.availableProfiles = [res];
        this.setActiveProfile(res);
        this.currentTab = 'daily';
        this.cdr.detectChanges();
      },
      error: err => {
        this.loading = false;
        this.onboardingError = err?.error?.message || 'Failed to save business profile.';
        this.cdr.detectChanges();
      }
    });
  }

  saveStockItem() {
    if (!this.activeProfile || !this.newStockItem.name) return;
    this.savingStock = true;

    this.api.addStockItem(this.activeProfile._id, this.newStockItem).subscribe({
      next: res => {
        this.savingStock = false;
        this.setActiveProfile(res);
        this.newStockItem = { name: '', quantity: 1, buyingPrice: 0, sellingPrice: 0 };
        this.cdr.detectChanges();
      },
      error: () => {
        this.savingStock = false;
      }
    });
  }

  deleteStock(itemId: string) {
    if (!this.activeProfile) return;
    this.api.deleteStockItem(this.activeProfile._id, itemId).subscribe({
      next: res => {
        this.setActiveProfile(res);
      }
    });
  }
}
