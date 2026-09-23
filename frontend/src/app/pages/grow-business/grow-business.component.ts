import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

interface ItemSoldDraft {
  itemName: string;
  quantity: number;
  sellingPrice: number;
}

@Component({
  selector: 'app-grow-business',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-line/15 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-forest text-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <span>{{ lang.isSwahili() ? 'Dira ya Biashara · Grow My Business' : 'Business Compass · Grow My Business' }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Kukuza Biashara Yako' : 'Grow & Track Your Business' }}
          </h1>
          <p class="text-charcoal/70 text-xs sm:text-sm mt-1">
            {{ lang.isSwahili() 
              ? 'Kutoka kuweka kumbukumbu hadi kuelewa faida na kuchukua hatua sahihi.' 
              : 'Track → Understand → Act. Built specifically for informal and small enterprises.' 
            }}
          </p>
        </div>

        <!-- Mode / Switcher if profile exists -->
        <div *ngIf="activeProfile" class="flex items-center gap-3">
          <span 
            class="px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-wider"
            [ngClass]="activeProfile.isUnlocked ? 'bg-gold text-forest-deep' : 'bg-forest-line/20 text-charcoal'"
          >
            {{ activeProfile.isUnlocked ? (lang.isSwahili() ? 'Kifurushi cha KSh 499 Kimefunguliwa' : 'KSh 499 Pro Unlocked') : (lang.isSwahili() ? 'Toleo la Bure (Free)' : 'Free Tier') }}
          </span>
          <button
            (click)="resetProfile()"
            class="text-xs text-charcoal/60 hover:text-charcoal underline"
          >
            {{ lang.isSwahili() ? 'Anzisha Upya' : 'New Profile' }}
          </button>
        </div>
      </div>

      <!-- ================= 1. REVISED ONBOARDING FLOW ================= -->
      <div *ngIf="!activeProfile" class="bg-white rounded-sheet border border-forest-line/15 shadow-light-md p-6 sm:p-10 space-y-8">
        
        <div class="border-b border-forest-line/10 pb-4">
          <h2 class="text-xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? '1. Wasifu wa Biashara Yako' : '1. Business Profile & Basics' }}
          </h2>
          <p class="text-xs text-charcoal/70 mt-1">
            {{ lang.isSwahili()
              ? 'Tueleze kile unachojua tayari. Compass inakutana nawe pale ulipo bila kukulazimisha kubuni nambari.'
              : 'Tell us what you know. Compass meets you where you are without forcing you to invent numbers.'
            }}
          </p>
        </div>

        <form (submit)="submitOnboarding($event)" class="space-y-6">
          
          <!-- Business Basics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <!-- What business do you own? -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Unaendesha biashara ya aina gani?' : 'What business do you own?' }} *
              </label>
              <input
                type="text"
                [(ngModel)]="onboardingForm.businessType"
                name="businessType"
                [placeholder]="lang.isSwahili() ? 'mfano: Duka la Mitumba, Kibanda cha Mboga, Saluni, Boda Boda' : 'e.g., Mitumba clothes shop, Grocery kiosk, Salon, Boda courier'"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
                required
              />
            </div>

            <!-- How long operating? -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Umekuwa ukiendesha kwa muda gani?' : 'How long have you been operating?' }} *
              </label>
              <select
                [(ngModel)]="onboardingForm.operatingDuration"
                name="operatingDuration"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
                required
              >
                <option value="" disabled>{{ lang.isSwahili() ? 'Chagua muda wa uendeshaji' : 'Select operating duration' }}</option>
                <option value="Less than 6 months">{{ lang.isSwahili() ? 'Chini ya miezi 6' : 'Less than 6 months' }}</option>
                <option value="6 to 12 months">{{ lang.isSwahili() ? 'Miezi 6 hadi 12' : '6 to 12 months' }}</option>
                <option value="1 to 3 years">{{ lang.isSwahili() ? 'Mwaka 1 hadi miaka 3' : '1 to 3 years' }}</option>
                <option value="More than 3 years">{{ lang.isSwahili() ? 'Zaidi ya miaka 3' : 'More than 3 years' }}</option>
              </select>
            </div>

            <!-- How much originally invested? -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Uliwekeza mtaji kiasi gani mwanzoni?' : 'How much did you originally invest?' }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  [(ngModel)]="onboardingForm.originalInvestment"
                  name="originalInvestment"
                  [disabled]="onboardingForm.investmentUnknown"
                  [placeholder]="onboardingForm.investmentUnknown ? (lang.isSwahili() ? 'Sijui kwa sasa' : 'I don’t know yet') : (lang.isSwahili() ? 'mfano: KSh 35,000' : 'e.g., KSh 35,000')"
                  class="flex-1 p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold disabled:opacity-50"
                />
                <button
                  type="button"
                  (click)="toggleInvestmentUnknown()"
                  class="px-3 py-3 rounded-button border text-xs font-medium transition-all"
                  [ngClass]="onboardingForm.investmentUnknown ? 'bg-gold text-forest font-semibold border-gold' : 'border-forest-line/20 text-charcoal/70 hover:bg-forest-line/10'"
                >
                  {{ lang.isSwahili() ? 'Sijui Bado' : "I don't know" }}
                </button>
              </div>
            </div>

            <!-- People working -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Watu wangapi wanafanya kazi katika biashara?' : 'How many people work in the business?' }}
              </label>
              <select
                [(ngModel)]="onboardingForm.peopleCount"
                name="peopleCount"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              >
                <option value="1">{{ lang.isSwahili() ? 'Mimi peke yangu (1)' : 'Just me (1 person)' }}</option>
                <option value="2-3">{{ lang.isSwahili() ? 'Watu 2 hadi 3' : '2 to 3 people' }}</option>
                <option value="4-10">{{ lang.isSwahili() ? 'Watu 4 hadi 10' : '4 to 10 people' }}</option>
                <option value="10+">{{ lang.isSwahili() ? 'Zaidi ya watu 10' : 'More than 10 people' }}</option>
              </select>
            </div>

            <!-- Biggest challenge -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Ni kikwazo gani kikuu kinachokukabili?' : 'What is your biggest business challenge?' }} *
              </label>
              <select
                [(ngModel)]="onboardingForm.biggestChallenge"
                name="biggestChallenge"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
                required
              >
                <option value="" disabled>{{ lang.isSwahili() ? 'Chagua kikwazo kikuu' : 'Select primary hurdle' }}</option>
                <option value="Customer acquisition & slow sales">{{ lang.isSwahili() ? 'Kupata wateja wapya na mauzo duni' : 'Customer acquisition & slow sales' }}</option>
                <option value="Cash flow & customer credit debt (deni)">{{ lang.isSwahili() ? 'Mtiririko wa fedha na madeni ya wateja (deni)' : 'Cash flow & customer credit debt (deni)' }}</option>
                <option value="Lack of working capital for inventory">{{ lang.isSwahili() ? 'Ukosefu wa mtaji wa kununua mzigo' : 'Lack of working capital for inventory' }}</option>
                <option value="Staff reliability & daily operations">{{ lang.isSwahili() ? 'Uaminifu wa wafanyakazi na uendeshaji' : 'Staff reliability & daily operations' }}</option>
                <option value="High costs & thin profit margins">{{ lang.isSwahili() ? 'Gharama kubwa na faida finyu' : 'High costs & thin profit margins' }}</option>
              </select>
            </div>

            <!-- What would you most like to improve? -->
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Ungependa kuboresha nini zaidi?' : 'What would you most like to improve?' }}
              </label>
              <select
                [(ngModel)]="onboardingForm.mostLikeToImprove"
                name="mostLikeToImprove"
                class="w-full p-3 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              >
                <option value="Increase daily sales">{{ lang.isSwahili() ? 'Kuongeza mauzo ya kila siku' : 'Increase daily sales' }}</option>
                <option value="Control costs & expenses">{{ lang.isSwahili() ? 'Kudhibiti gharama na matumizi' : 'Control costs & expenses' }}</option>
                <option value="Manage stock / prevent loss">{{ lang.isSwahili() ? 'Kusimamia mzigo vizuri na kuzuia hasara' : 'Manage stock / prevent loss' }}</option>
                <option value="Pay myself consistently">{{ lang.isSwahili() ? 'Kujilipa mshahara thabiti' : 'Pay myself consistently' }}</option>
                <option value="Separate business & personal money">{{ lang.isSwahili() ? 'Kutenga fedha za biashara na za kibinafsi' : 'Separate business & personal money' }}</option>
                <option value="Attract new customers">{{ lang.isSwahili() ? 'Kuvutia wateja wapya' : 'Attract new customers' }}</option>
              </select>
            </div>

          </div>

          <!-- Section 2: Current Financial Tracking Ability -->
          <div class="p-5 rounded-card bg-ivory border border-forest-line/15 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? 'Je, kwa sasa unafuatilia mauzo na matumizi yako?' : 'Do you currently track your sales and expenses?' }}
              </label>
              <p class="text-xs text-charcoal/70 mt-0.5">
                {{ lang.isSwahili() ? 'Chagua kile kinachoelezea hali yako halisi kwa sasa.' : 'Select the option that best reflects your current routine.' }}
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                *ngFor="let opt of trackingOptions"
                (click)="onboardingForm.financialTrackingAbility = opt.id"
                class="p-3 rounded-button border text-xs text-center transition-all flex flex-col items-center justify-center gap-1.5"
                [ngClass]="onboardingForm.financialTrackingAbility === opt.id ? 'bg-forest text-ivory border-forest font-semibold shadow-sm' : 'bg-white text-charcoal border-forest-line/20 hover:border-gold'"
              >
                <ng-container [ngSwitch]="opt.id">
                  <svg *ngSwitchCase="'yes_regularly'" class="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg *ngSwitchCase="'sometimes'" class="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <svg *ngSwitchCase="'estimate'" class="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <svg *ngSwitchDefault class="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </ng-container>
                <span>{{ lang.isSwahili() ? opt.labelSw : opt.label }}</span>
              </button>
            </div>

            <!-- Reassurance Card when informal/estimating -->
            <div *ngIf="onboardingForm.financialTrackingAbility !== 'yes_regularly'" class="p-4 rounded-button bg-gold/15 border border-gold/40 flex items-start gap-3">
              <svg class="w-5 h-5 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div class="text-xs text-charcoal">
                <p class="font-bold text-forest">
                  {{ lang.isSwahili() ? 'Usijali, uko mahali sahihi!' : "Don't worry, you're in the right place!" }}
                </p>
                <p class="mt-1 leading-relaxed text-charcoal/80">
                  {{ lang.isSwahili() 
                    ? 'Wafanyabiashara wengi wadogo hawana rekodi kamili za uhasibu na hukadiria. Compass haitakulazimisha kubuni nambari — tutaanza kurekodi kuanzia leo.'
                    : 'Many small and informal business owners do not have accurate financial records. Compass will never force you to invent numbers. We will help you start tracking simply from today.' 
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Section 3: Optional Approximate Financial Information (Not Mandatory) -->
          <div class="border border-forest-line/15 rounded-card p-4 sm:p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-charcoal">
                  {{ lang.isSwahili() ? 'Taarifa za Kifedha za Hiari / Makadirio' : 'Optional / Approximate Financial Info' }}
                </h3>
                <p class="text-[11px] text-charcoal/60">
                  {{ lang.isSwahili() 
                    ? 'Si lazima kujaza sasa. Unaweza kuweka makadirio au kuendelea iwapo bado hujui.' 
                    : 'Not mandatory. Enter approximate values if you know them, or skip if you do not.' 
                  }}
                </p>
              </div>
              <button
                type="button"
                (click)="showOptionalFinances = !showOptionalFinances"
                class="text-xs text-gold font-semibold hover:underline"
              >
                {{ showOptionalFinances ? (lang.isSwahili() ? 'Ficha' : 'Hide') : (lang.isSwahili() ? '+ Onyesha Viwango' : '+ Show Fields') }}
              </button>
            </div>

            <div *ngIf="showOptionalFinances" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-charcoal/80">{{ lang.isSwahili() ? 'Kodi ya chumba / duka (Rent)' : 'Monthly Rent (KSh)' }}</label>
                <input type="text" [(ngModel)]="onboardingForm.rent" name="rent" placeholder="KSh 0" class="w-full p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-charcoal/80">{{ lang.isSwahili() ? 'Mishahara ya wafanyakazi' : 'Employee Wages (KSh)' }}</label>
                <input type="text" [(ngModel)]="onboardingForm.wages" name="wages" placeholder="KSh 0" class="w-full p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-charcoal/80">{{ lang.isSwahili() ? 'Bili (Maji, Stima n.k)' : 'Monthly Utilities (KSh)' }}</label>
                <input type="text" [(ngModel)]="onboardingForm.utilities" name="utilities" placeholder="KSh 0" class="w-full p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-charcoal/80">{{ lang.isSwahili() ? 'Malipo ya mkopo (Loan repayments)' : 'Loan Repayments (KSh)' }}</label>
                <input type="text" [(ngModel)]="onboardingForm.loanRepayments" name="loanRepayments" placeholder="KSh 0" class="w-full p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-charcoal/80">{{ lang.isSwahili() ? 'Gharama ya mzigo kwa mwezi' : 'Monthly Stock Purchases (KSh)' }}</label>
                <input type="text" [(ngModel)]="onboardingForm.averageStockPurchases" name="averageStockPurchases" placeholder="KSh 0" class="w-full p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-charcoal/80">{{ lang.isSwahili() ? 'Makadirio ya mauzo kwa mwezi' : 'Estimated Monthly Sales' }}</label>
                <input type="text" [(ngModel)]="onboardingForm.monthlySales" name="monthlySales" placeholder="KSh 0" class="w-full p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs" />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              [disabled]="!onboardingForm.businessType || !onboardingForm.operatingDuration || !onboardingForm.biggestChallenge || loading"
              class="w-full bg-gold hover:bg-gold-soft disabled:opacity-40 text-forest-deep font-bold text-sm py-4 rounded-button shadow-light-md transition-all flex items-center justify-center gap-2"
            >
              <svg *ngIf="loading" class="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>{{ lang.isSwahili() ? 'Kamilisha Wasifu & Anza Kufuatilia →' : 'Complete Profile & Start Tracking →' }}</span>
            </button>
          </div>

        </form>

      </div>

      <!-- ================= 2. ACTIVE BUSINESS COMPASS DASHBOARD ================= -->
      <div *ngIf="activeProfile" class="space-y-8">
        
        <!-- Top Banner: Intelligence Layer "Your Next Best Step" -->
        <div class="p-6 sm:p-7 rounded-sheet bg-forest text-ivory border border-gold/40 shadow-light-lg relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-gold/10 rounded-full blur-2xl"></div>
          
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-card bg-gold/20 text-gold flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/15 px-2 py-0.5 rounded-pill">
                  {{ lang.isSwahili() ? 'Mfumo wa Akili · Hatua Yako Bora Inayofuata' : 'Intelligence Layer · Your Next Best Step' }}
                </span>
              </div>
              <h2 class="text-lg sm:text-xl font-serif font-bold text-ivory">
                {{ lang.isSwahili() ? (activeProfile.nextBestStep?.headlineSw || activeProfile.nextBestStep?.headline) : activeProfile.nextBestStep?.headline }}
              </h2>
              <p class="text-xs text-ivory/80 leading-relaxed max-w-2xl">
                {{ lang.isSwahili() ? (activeProfile.nextBestStep?.reasonSw || activeProfile.nextBestStep?.reason) : activeProfile.nextBestStep?.reason }}
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 border-b border-forest-line/15 overflow-x-auto pb-1">
          <button
            *ngFor="let tab of tabs"
            (click)="currentTab = tab.id"
            class="px-4 py-2.5 text-xs font-bold rounded-t-card transition-all border-b-2 whitespace-nowrap flex items-center gap-2"
            [ngClass]="currentTab === tab.id 
              ? 'border-gold text-forest bg-white shadow-sm' 
              : 'border-transparent text-charcoal/60 hover:text-charcoal hover:bg-forest-line/5'"
          >
            <ng-container [ngSwitch]="tab.id">
              <svg *ngSwitchCase="'daily'" class="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <svg *ngSwitchCase="'stock'" class="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <svg *ngSwitchCase="'snapshot'" class="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <svg *ngSwitchCase="'money'" class="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <svg *ngSwitchCase="'unlock'" class="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </ng-container>
            <span>{{ lang.isSwahili() ? tab.labelSw : tab.label }}</span>
            <span *ngIf="tab.badge" class="px-1.5 py-0.5 rounded-pill bg-gold text-forest-deep text-[10px] font-bold">
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <!-- TAB 1: DAILY SALES & EXPENSE TRACKING -->
        <div *ngIf="currentTab === 'daily'" class="space-y-6">
          
          <!-- Daily Entry Form -->
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-line/10 pb-4">
              <div>
                <h3 class="text-lg font-serif font-bold text-charcoal">
                  {{ lang.isSwahili() ? 'Rekodi Mauzo na Matumizi ya Leo' : 'Record Today’s Sales & Expenses' }}
                </h3>
                <p class="text-xs text-charcoal/70">
                  {{ lang.isSwahili() ? 'Uzoefu mwepesi: huhitaji kuingiza kila risiti, nambari jumla inatosha.' : 'Default simple mode: enter total amounts without itemizing every single receipt.' }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <label class="text-xs text-charcoal/70">{{ lang.isSwahili() ? 'Tarehe:' : 'Date:' }}</label>
                <input
                  type="date"
                  [(ngModel)]="dailyDraft.date"
                  class="p-2 text-xs rounded-button border border-forest-line/20 bg-ivory"
                />
              </div>
            </div>

            <!-- Two Main Inputs -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <!-- Sales -->
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-forest">
                  {{ lang.isSwahili() ? 'Je, mauzo yako yalikuwa kiasi gani leo?' : 'What were your sales today?' }} (KSh)
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-xs font-bold text-charcoal/50">KSh</span>
                  <input
                    type="number"
                    [(ngModel)]="dailyDraft.sales"
                    (input)="onSalesAmountChange()"
                    placeholder="0"
                    class="w-full pl-12 pr-4 py-3 rounded-button border border-forest-line/20 bg-white text-charcoal text-base font-bold focus:outline-none focus:border-gold"
                  />
                </div>
                <p class="text-[11px] text-charcoal/60">
                  {{ lang.isSwahili() ? 'Jumla ya fedha zilizopokelewa kwa M-Pesa na taslimu.' : 'Total cash + M-Pesa collected from customers today.' }}
                </p>
              </div>

              <!-- Expenses -->
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-risk">
                  {{ lang.isSwahili() ? 'Je, matumizi yako ya biashara yalikuwa kiasi gani leo?' : 'What were your business expenses today?' }} (KSh)
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-xs font-bold text-charcoal/50">KSh</span>
                  <input
                    type="number"
                    [(ngModel)]="dailyDraft.expenses"
                    placeholder="0"
                    class="w-full pl-12 pr-4 py-3 rounded-button border border-forest-line/20 bg-white text-charcoal text-base font-bold focus:outline-none focus:border-gold"
                  />
                </div>
                <p class="text-[11px] text-charcoal/60">
                  {{ lang.isSwahili() ? 'Nauli, ununuzi wa mzigo mdogo, chakula, bili n.k.' : 'Transport, minor stock runs, staff lunch, bags, etc.' }}
                </p>
              </div>

            </div>

            <!-- ESTIMATED PROFIT DISPLAY (Spec: Clearly labeled as estimated profit) -->
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
                  ? 'Imebainishwa wazi kama makadirio ya faida; hailengi kuchukua nafasi ya uhasibu rasmi.' 
                  : 'Clearly labeled as estimated profit; not intended to replace formal statutory accounting.' 
                }}
              </div>
            </div>

            <!-- OPTIONAL ITEM-LEVEL SALES TRACKING (+ Add Items Sold) -->
            <div class="border border-forest-line/15 rounded-card p-4 sm:p-5 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                    <svg class="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>{{ lang.isSwahili() ? 'Kufuatilia Bidhaa Moja Moja (Hiari)' : 'Optional Item-Level Sales Tracking' }}</span>
                  </h4>
                  <p class="text-[11px] text-charcoal/60">
                    {{ lang.isSwahili() 
                      ? 'Si lazima. Ukitaka kufuatilia bidhaa zilizouzwa ili kupunguza mzigo dukani.' 
                      : 'Never mandatory. Add specific products sold to automatically reduce stock quantities.' 
                    }}
                  </p>
                </div>
                
                <button
                  type="button"
                  (click)="showItemSales = !showItemSales"
                  class="px-3 py-1.5 rounded-button text-xs font-semibold border transition-all"
                  [ngClass]="showItemSales ? 'bg-forest text-ivory border-forest' : 'border-forest-line/20 text-charcoal hover:bg-forest-line/10'"
                >
                  {{ showItemSales ? (lang.isSwahili() ? 'Ficha Bidhaa' : 'Hide Items') : (lang.isSwahili() ? '+ Ongeza Bidhaa Zilizouzwa' : '+ Add Items Sold') }}
                </button>
              </div>

              <!-- Item-level Editor -->
              <div *ngIf="showItemSales" class="space-y-4 pt-2 border-t border-forest-line/10">
                
                <div *ngFor="let item of draftItemsSold; let i = index" class="grid grid-cols-12 gap-2 items-center bg-ivory p-2.5 rounded-button border border-forest-line/15">
                  <div class="col-span-5">
                    <input
                      type="text"
                      [(ngModel)]="item.itemName"
                      [placeholder]="lang.isSwahili() ? 'Jina la bidhaa (mfano: Maziwa)' : 'Item name (e.g., Milk)'"
                      class="w-full p-2 rounded text-xs border border-forest-line/20 bg-white"
                    />
                  </div>
                  <div class="col-span-2">
                    <input
                      type="number"
                      [(ngModel)]="item.quantity"
                      min="1"
                      [placeholder]="lang.isSwahili() ? 'Idadi' : 'Qty'"
                      class="w-full p-2 rounded text-xs border border-forest-line/20 bg-white text-center"
                    />
                  </div>
                  <div class="col-span-3">
                    <input
                      type="number"
                      [(ngModel)]="item.sellingPrice"
                      [placeholder]="lang.isSwahili() ? 'Bei (KSh)' : 'Price (KSh)'"
                      class="w-full p-2 rounded text-xs border border-forest-line/20 bg-white"
                    />
                  </div>
                  <div class="col-span-2 text-right flex items-center justify-end gap-1">
                    <span class="text-xs font-bold text-forest hidden sm:inline">
                      {{ (item.quantity * item.sellingPrice) | number }}
                    </span>
                    <button
                      type="button"
                      (click)="removeItemSold(i)"
                      class="text-risk font-bold text-xs p-1 hover:bg-risk/10 rounded flex items-center justify-center"
                      title="Remove"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    (click)="addItemSoldRow()"
                    class="text-xs font-bold text-forest hover:text-forest-deep flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>{{ lang.isSwahili() ? 'Ongeza Bidhaa Nyingine' : 'Add Another Product' }}</span>
                  </button>

                  <span class="text-xs text-charcoal/70">
                    {{ lang.isSwahili() ? 'Jumla ya Bidhaa:' : 'Items Sum:' }} 
                    <strong class="text-charcoal font-bold">KSh {{ getItemsSoldTotal() | number }}</strong>
                  </span>
                </div>

                <!-- MISMATCH CHECK (Spec: Prompt user if item total differs from total sales amount) -->
                <div *ngIf="hasItemSalesMismatch()" class="p-3.5 rounded-card bg-gold/20 border border-gold/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div class="flex items-start gap-2 text-charcoal">
                    <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p class="font-bold">
                        {{ lang.isSwahili() ? 'Kutofautiana kwa Jumla ya Mauzo' : 'Total Sales & Items Mismatch' }}
                      </p>
                      <p class="text-[11px] text-charcoal/80">
                        {{ lang.isSwahili()
                          ? 'Jumla ya bidhaa (KSh ' + (getItemsSoldTotal() | number) + ') inatofautiana na mauzo uliyoweka (KSh ' + (dailyDraft.sales | number) + ').'
                          : 'Item total (KSh ' + (getItemsSoldTotal() | number) + ') differs from entered total sales (KSh ' + (dailyDraft.sales | number) + ').'
                        }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="syncSalesWithItemsTotal()"
                    class="px-3 py-1.5 rounded-button bg-forest text-gold text-xs font-bold whitespace-nowrap self-end sm:self-center"
                  >
                    {{ lang.isSwahili() ? 'Sawazisha na KSh ' + (getItemsSoldTotal() | number) : 'Sync Total to KSh ' + (getItemsSoldTotal() | number) }}
                  </button>
                </div>

              </div>
            </div>

            <!-- Save Daily Record Button -->
            <div>
              <button
                type="button"
                (click)="saveDailyRecord()"
                [disabled]="(!dailyDraft.sales && !dailyDraft.expenses) || savingDaily"
                class="w-full bg-forest hover:bg-forest-deep text-gold font-bold text-sm py-4 rounded-button shadow transition-all flex items-center justify-center gap-2"
              >
                <svg *ngIf="savingDaily" class="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <svg class="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ lang.isSwahili() ? 'Hifadhi Kumbukumbu ya Leo' : 'Save Today’s Record' }}</span>
              </button>
            </div>

          </div>

          <!-- RECENT DAILY RECORDS TABLE -->
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 shadow-light-md space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-serif font-bold text-charcoal uppercase tracking-wider">
                {{ lang.isSwahili() ? 'Rekodi za Siku Zilizopita' : 'Recorded Daily History' }}
              </h4>
              <span class="text-xs text-charcoal/60">
                {{ (activeProfile.dailyRecords?.length || 0) }} {{ lang.isSwahili() ? 'siku zilizorekodiwa' : 'days logged' }}
              </span>
            </div>

            <div *ngIf="(!activeProfile.dailyRecords || activeProfile.dailyRecords.length === 0)" class="text-center py-8 text-xs text-charcoal/50 bg-ivory rounded-card">
              {{ lang.isSwahili() ? 'Bado hujarekodi siku yoyote. Weka nambari zako hapo juu kuanza!' : 'No daily records yet. Enter today’s sales and expenses above to begin!' }}
            </div>

            <div *ngIf="activeProfile.dailyRecords && activeProfile.dailyRecords.length > 0" class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-forest-line/10 text-charcoal/60 uppercase text-[10px]">
                    <th class="pb-2">{{ lang.isSwahili() ? 'Tarehe' : 'Date' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Mauzo (Sales)' : 'Sales' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Matumizi (Expenses)' : 'Expenses' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Faida ya Makadirio' : 'Estimated Profit' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Bidhaa Zilizouzwa' : 'Items Sold' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let rec of activeProfile.dailyRecords">
                    <td class="py-3 font-semibold text-charcoal">{{ rec.date }}</td>
                    <td class="py-3 font-medium text-forest">KSh {{ rec.sales | number }}</td>
                    <td class="py-3 text-risk font-medium">KSh {{ rec.expenses | number }}</td>
                    <td class="py-3 font-bold" [ngClass]="rec.estimatedProfit >= 0 ? 'text-forest' : 'text-risk'">
                      KSh {{ rec.estimatedProfit | number }}
                    </td>
                    <td class="py-3 text-charcoal/70">
                      <span *ngIf="!rec.itemsSold || rec.itemsSold.length === 0">—</span>
                      <span *ngIf="rec.itemsSold && rec.itemsSold.length > 0">
                        {{ rec.itemsSold.length }} {{ lang.isSwahili() ? 'aina' : 'items' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- TAB 2: SIMPLE STOCK TEMPLATE -->
        <div *ngIf="currentTab === 'stock'" class="space-y-6">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-line/10 pb-4">
              <div>
                <h3 class="text-lg font-serif font-bold text-charcoal">
                  {{ lang.isSwahili() ? 'Mfumo Rahisi wa Kusimamia Mzigo (Stock Template)' : 'Simple Stock Template' }}
                </h3>
                <p class="text-xs text-charcoal/70">
                  {{ lang.isSwahili() 
                    ? 'Ongeza bidhaa zako polepole. Mauzo ya kila siku yanapunguza mzigo kiotomatiki.' 
                    : 'Add products gradually. Recording item sales automatically reduces stock quantities.' 
                  }}
                </p>
              </div>

              <!-- Quick Stock Total Value -->
              <div class="px-4 py-2 bg-ivory rounded-card border border-forest-line/15 text-right">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">
                  {{ lang.isSwahili() ? 'Thamani ya Mzigo' : 'Total Stock Value' }}
                </span>
                <p class="text-sm font-bold text-forest">
                  KSh {{ (activeProfile.snapshot?.stockInventoryValue || 0) | number }}
                </p>
              </div>
            </div>

            <!-- New Stock Item Inline Form -->
            <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-charcoal">
                {{ lang.isSwahili() ? '+ Ongeza Bidhaa Mpya Dukani' : '+ Add New Stock Item' }}
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  [(ngModel)]="newStockItem.name"
                  [placeholder]="lang.isSwahili() ? 'Jina la bidhaa (mfano: Sukari 1kg)' : 'Product name (e.g. Sugar 1kg)'"
                  class="p-2.5 rounded-button border border-forest-line/20 bg-white text-xs"
                />
                <input
                  type="number"
                  [(ngModel)]="newStockItem.quantity"
                  [placeholder]="lang.isSwahili() ? 'Idadi ya mzigo' : 'Quantity in stock'"
                  class="p-2.5 rounded-button border border-forest-line/20 bg-white text-xs"
                />
                <input
                  type="number"
                  [(ngModel)]="newStockItem.buyingPrice"
                  [placeholder]="lang.isSwahili() ? 'Bei ya kununua (KSh)' : 'Buying price (KSh)'"
                  class="p-2.5 rounded-button border border-forest-line/20 bg-white text-xs"
                />
                <input
                  type="number"
                  [(ngModel)]="newStockItem.sellingPrice"
                  [placeholder]="lang.isSwahili() ? 'Bei ya kuuza (KSh)' : 'Selling price (KSh)'"
                  class="p-2.5 rounded-button border border-forest-line/20 bg-white text-xs"
                />
              </div>

              <div class="flex justify-end">
                <button
                  type="button"
                  (click)="saveStockItem()"
                  [disabled]="!newStockItem.name || savingStock"
                  class="px-5 py-2.5 rounded-button bg-forest text-gold text-xs font-bold hover:bg-forest-deep disabled:opacity-40"
                >
                  {{ lang.isSwahili() ? 'Hifadhi Bidhaa Dukani' : 'Add to Stock' }}
                </button>
              </div>
            </div>

            <!-- Stock Table -->
            <div *ngIf="(!activeProfile.stockItems || activeProfile.stockItems.length === 0)" class="text-center py-8 text-xs text-charcoal/50 bg-ivory rounded-card">
              {{ lang.isSwahili() ? 'Hakuna bidhaa kwenye orodha bado. Tumia fomu hapo juu kuongeza.' : 'No stock items added yet. Use the form above to add your first products.' }}
            </div>

            <div *ngIf="activeProfile.stockItems && activeProfile.stockItems.length > 0" class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-forest-line/10 text-charcoal/60 uppercase text-[10px]">
                    <th class="pb-2">{{ lang.isSwahili() ? 'Bidhaa' : 'Product' }}</th>
                    <th class="pb-2 text-center">{{ lang.isSwahili() ? 'Idadi (Qty)' : 'Quantity' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Bei ya Kununua' : 'Buying Price' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Bei ya Kuuza' : 'Selling Price' }}</th>
                    <th class="pb-2">{{ lang.isSwahili() ? 'Faida kwa Kizio' : 'Unit Margin' }}</th>
                    <th class="pb-2 text-right">{{ lang.isSwahili() ? 'Kitendo' : 'Actions' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let s of activeProfile.stockItems">
                    <td class="py-3 font-bold text-charcoal">{{ s.name }}</td>
                    <td class="py-3 text-center">
                      <span 
                        class="px-2.5 py-1 rounded-pill text-xs font-bold"
                        [ngClass]="s.quantity <= 3 ? 'bg-risk/15 text-risk' : 'bg-forest/10 text-forest'"
                      >
                        {{ s.quantity }}
                      </span>
                    </td>
                    <td class="py-3 text-charcoal/80">KSh {{ s.buyingPrice | number }}</td>
                    <td class="py-3 text-charcoal font-semibold">KSh {{ s.sellingPrice | number }}</td>
                    <td class="py-3 font-bold text-forest">
                      +KSh {{ (s.sellingPrice - s.buyingPrice) | number }}
                    </td>
                    <td class="py-3 text-right">
                      <button
                        (click)="deleteStock(s.id)"
                        class="text-risk hover:underline text-[11px]"
                      >
                        {{ lang.isSwahili() ? 'Futa' : 'Delete' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

        <!-- TAB 3: BUSINESS SNAPSHOT -->
        <div *ngIf="currentTab === 'snapshot'" class="space-y-6">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="border-b border-forest-line/10 pb-4">
              <h3 class="text-lg font-serif font-bold text-charcoal">
                {{ lang.isSwahili() ? 'Muhtasari wa Biashara (Business Snapshot)' : 'Business Snapshot' }}
              </h3>
              <p class="text-xs text-charcoal/70">
                {{ lang.isSwahili()
                  ? 'Unapoendelea kuweka kumbukumbu, Compass hujenga picha kamili ya nambari zako.'
                  : 'As you enter information, Compass gradually aggregates a live picture of your financial reality.'
                }}
              </p>
            </div>

            <!-- Grid of Key Metrics -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">
                  {{ lang.isSwahili() ? 'Wastani wa Mauzo kwa Siku' : 'Average Daily Sales' }}
                </span>
                <p class="text-xl font-bold text-forest">
                  KSh {{ (activeProfile.snapshot?.averageDailySales || 0) | number }}
                </p>
              </div>

              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">
                  {{ lang.isSwahili() ? 'Makadirio ya Mauzo kwa Mwezi' : 'Average Monthly Sales' }}
                </span>
                <p class="text-xl font-bold text-forest">
                  KSh {{ (activeProfile.snapshot?.averageMonthlySales || 0) | number }}
                </p>
              </div>

              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">
                  {{ lang.isSwahili() ? 'Wastani wa Matumizi kwa Siku' : 'Average Daily Expenses' }}
                </span>
                <p class="text-xl font-bold text-risk">
                  KSh {{ (activeProfile.snapshot?.averageExpenses || 0) | number }}
                </p>
              </div>

              <div class="p-4 rounded-card bg-forest-deep text-ivory border border-forest-line space-y-1">
                <span class="text-[10px] uppercase font-bold text-gold">
                  {{ lang.isSwahili() ? 'Makadirio ya Faida kwa Mwezi' : 'Estimated Monthly Profit' }}
                </span>
                <p class="text-xl font-serif font-bold text-gold">
                  KSh {{ (activeProfile.snapshot?.estimatedMonthlyProfit || 0) | number }}
                </p>
              </div>

              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">
                  {{ lang.isSwahili() ? 'Gharama Zisizobadilika (Fixed Costs)' : 'Fixed Monthly Costs' }}
                </span>
                <p class="text-xl font-bold text-charcoal">
                  KSh {{ (activeProfile.snapshot?.fixedMonthlyCosts || 0) | number }}
                </p>
              </div>

              <div class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-1">
                <span class="text-[10px] uppercase font-bold text-charcoal/60">
                  {{ lang.isSwahili() ? 'Lengo la Mshahara Wako (Owner Pay)' : 'Recommended Owner Pay' }}
                </span>
                <p class="text-xl font-bold text-forest">
                  KSh {{ (activeProfile.snapshot?.ownerPay || 0) | number }}
                </p>
              </div>

            </div>

          </div>

        </div>

        <!-- TAB 4: BUSINESS MONEY PLAN -->
        <div *ngIf="currentTab === 'money'" class="space-y-6">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-6">
            <div class="border-b border-forest-line/10 pb-4">
              <h3 class="text-lg font-serif font-bold text-charcoal">
                {{ lang.isSwahili() ? 'Mpango wa Fedha za Biashara (Business Money Plan)' : 'Business Money Plan' }}
              </h3>
              <p class="text-xs text-charcoal/70">
                {{ lang.isSwahili()
                  ? 'Nini kinapaswa kutokea kwa fedha biashara yako inayozalisha? Mgawanyo unaozingatia hali na hatua yako.'
                  : 'What should happen to the money your business generates. Tailored by your actual business stage.'
                }}
              </p>
            </div>

            <!-- Golden Rule Banner -->
            <div class="p-4 rounded-card bg-gold/15 border border-gold/40 flex items-start gap-3">
              <div class="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 text-forest">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-xs text-charcoal">
                <p class="font-bold text-forest uppercase tracking-wider">
                  {{ lang.isSwahili() ? 'Kanuni Kuu ya Nidhamu ya Fedha' : 'Core Financial Principle' }}
                </p>
                <p class="mt-1 leading-relaxed">
                  {{ lang.isSwahili() ? activeProfile.moneyPlan?.recommendationSw : activeProfile.moneyPlan?.recommendation }}
                </p>
              </div>
            </div>

            <!-- Allocation Blocks -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngFor="let item of activeProfile.moneyPlan?.allocations" class="p-4 rounded-card bg-ivory border border-forest-line/15 space-y-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold text-charcoal">
                    {{ lang.isSwahili() ? item.categorySw : item.category }}
                  </h4>
                  <span class="px-2 py-0.5 rounded-pill bg-forest text-gold text-xs font-bold">
                    {{ item.percentage }}%
                  </span>
                </div>
                <p class="text-xs text-charcoal/70 leading-relaxed">
                  {{ lang.isSwahili() ? item.purposeSw : item.purpose }}
                </p>
              </div>
            </div>

          </div>

        </div>

        <!-- TAB 5: FREE VS KSH 499 UNLOCK -->
        <div *ngIf="currentTab === 'unlock'" class="space-y-6">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 p-6 sm:p-8 shadow-light-md space-y-8">
            
            <div class="text-center max-w-xl mx-auto space-y-2">
              <span class="text-xs font-bold uppercase tracking-widest text-gold bg-forest px-3 py-1 rounded-pill">
                {{ lang.isSwahili() ? 'Bure vs KSh 499' : 'Free vs KSh 499 Unlock' }}
              </span>
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                {{ lang.isSwahili() ? 'FREE = Ona biashara yako. KSh 499 = Ielewe & jua cha kufanya.' : 'FREE = See your business. KSh 499 = Understand it + know what to do next.' }}
              </h3>
            </div>

            <!-- Comparison Table (from Spec) -->
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left border border-forest-line/15 rounded-card overflow-hidden">
                <thead>
                  <tr class="bg-forest-deep text-ivory">
                    <th class="p-3 font-semibold w-1/2">{{ lang.isSwahili() ? 'BURE (FREE)' : 'FREE' }}</th>
                    <th class="p-3 font-bold text-gold w-1/2">{{ lang.isSwahili() ? 'KSh 499 UNLOCK' : 'KSh 499 UNLOCK' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10 bg-ivory">
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Wasifu wa Biashara (Business profile)' : 'Business profile' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Uchambuzi wa kina wa biashara' : 'Deeper business analysis' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Kurekodi mauzo ya kila siku' : 'Daily sales tracking' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Tathmini kamili ya afya ya biashara' : 'Business health snapshot' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Kurekodi matumizi ya kila siku' : 'Daily expense tracking' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Tafsiri ya faida na mtiririko wa fedha' : 'Profit / cash-flow interpretation' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Orodha rahisi ya mzigo (Basic stock template)' : 'Basic stock template' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Mwongozo wa mshahara wa mwenye biashara' : 'Owner-pay guidance' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Taarifa za gharama zisizobadilika' : 'Fixed-cost information' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Mwongozo wa akiba na mfuko wa dharura' : 'Savings / reserve guidance' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Makadirio ya faida (Estimated profit)' : 'Estimated profit' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Mwongozo wa kuwekeza tena mtaji' : 'Reinvestment guidance' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3">✓ {{ lang.isSwahili() ? 'Muhtasari wa msingi wa biashara' : 'Basic business snapshot' }}</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Mbinu za mzigo (Stock insights)' : 'Stock insights' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3 text-charcoal/40">—</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Mapendekezo maalum ya kibinafsi' : 'Personalised recommendations' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3 text-charcoal/40">—</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Hatua Yako Bora Inayofuata (Intelligence layer)' : '“Your Next Best Step”' }}</td>
                  </tr>
                  <tr>
                    <td class="p-3 text-charcoal/40">—</td>
                    <td class="p-3 font-bold text-forest">✓ {{ lang.isSwahili() ? 'Mpango wa utekelezaji wa siku 30' : '30-day tactical action plan' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- UNLOCK ACTION / PREVIEW -->
            <div *ngIf="!activeProfile.isUnlocked" class="p-6 rounded-sheet bg-forest-deep text-ivory border border-gold/40 text-center space-y-4">
              <h4 class="text-xl font-serif font-bold text-gold">
                {{ lang.isSwahili() ? 'Fungua Ripoti Kamili ya Afya ya Biashara' : 'Unlock Full Business Health Analysis' }}
              </h4>
              <p class="text-xs text-ivory/80 max-w-md mx-auto">
                {{ lang.isSwahili()
                  ? 'Gharama ya mara moja tu ya KSh 499 kupitia M-Pesa. Pata mwongozo kamili wa siku 30 wa kuongeza faida.'
                  : 'One-time investment of KSh 499 via M-Pesa. Receive your complete 30-day margin improvement blueprint.'
                }}
              </p>
              <button
                type="button"
                (click)="unlockPro()"
                [disabled]="unlocking"
                class="px-8 py-3.5 rounded-button bg-gold hover:bg-gold-soft text-forest-deep font-bold text-sm shadow-light-lg transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <svg *ngIf="unlocking" class="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>{{ lang.isSwahili() ? 'Fungua kwa KSh 499 (M-Pesa)' : 'Unlock with KSh 499 (M-Pesa)' }}</span>
              </button>
            </div>

            <!-- UNLOCKED VIEW: 30-DAY ACTION PLAN & INSIGHTS -->
            <div *ngIf="activeProfile.isUnlocked" class="space-y-6 pt-4 border-t border-forest-line/15">
              
              <div class="flex items-center gap-3 p-4 rounded-card bg-gold/15 border border-gold/50">
                <div class="w-10 h-10 rounded-full bg-gold/30 flex items-center justify-center flex-shrink-0 text-forest">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-serif font-bold text-forest text-sm sm:text-base">
                    {{ lang.isSwahili() ? 'Ripoti Kamili ya KSh 499 Imefunguliwa!' : 'KSh 499 Pro Report Unlocked!' }}
                  </h4>
                  <p class="text-xs text-charcoal/80">
                    {{ lang.isSwahili() ? 'Mpango wako wa utekelezaji wa wiki 4 uko tayari hapa chini.' : 'Your 4-week margin improvement roadmap is detailed below.' }}
                  </p>
                </div>
              </div>

              <!-- 30-Day Action Plan Weeks -->
              <div class="space-y-4">
                <h4 class="text-sm font-bold uppercase tracking-wider text-charcoal">
                  {{ lang.isSwahili() ? 'Mpango wa Utekelezaji wa Siku 30 (30-Day Action Plan):' : '30-Day Tactical Action Plan:' }}
                </h4>

                <div 
                  *ngFor="let week of activeProfile.diagnostics?.premiumDeliverables?.actionPlan30Days"
                  class="p-5 rounded-card bg-ivory border border-forest-line/15 space-y-3"
                >
                  <h5 class="text-xs font-bold uppercase tracking-wider text-forest">
                    {{ lang.isSwahili() ? week.weekSw : week.week }}
                  </h5>
                  <ul class="space-y-2 text-xs text-charcoal/80">
                    <li *ngFor="let task of (lang.isSwahili() ? week.tasksSw : week.tasks)" class="flex items-start gap-2.5">
                      <span class="text-gold font-bold">✓</span>
                      <span>{{ task }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Owner Pay Guidance & Warning -->
              <div class="p-5 rounded-card bg-forest-deep text-ivory border border-gold/30 space-y-2">
                <span class="text-[10px] uppercase font-bold text-gold tracking-widest">
                  {{ lang.isSwahili() ? 'Mwongozo wa Mshahara Wako' : 'Owner-Pay Guidance' }}
                </span>
                <p class="text-xs text-ivory/90 leading-relaxed">
                  {{ lang.isSwahili() ? activeProfile.diagnostics?.premiumDeliverables?.ownerPayGuidance?.recommendedRuleSw : activeProfile.diagnostics?.premiumDeliverables?.ownerPayGuidance?.recommendedRule }}
                </p>
                <div class="pt-2 border-t border-forest-line/30 text-[11px] text-gold/80 italic flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{{ lang.isSwahili() ? activeProfile.diagnostics?.premiumDeliverables?.ownerPayGuidance?.warningSw : activeProfile.diagnostics?.premiumDeliverables?.ownerPayGuidance?.warning }}</span>
                </div>
              </div>

            </div>

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

  loading = false;
  savingDaily = false;
  savingStock = false;
  unlocking = false;
  showOptionalFinances = false;
  showItemSales = false;

  currentTab: 'daily' | 'stock' | 'snapshot' | 'money' | 'unlock' = 'daily';

  tabs = [
    { id: 'daily' as const, label: 'Daily Tracking', labelSw: 'Rekodi za Kila Siku' },
    { id: 'stock' as const, label: 'Stock Template', labelSw: 'Orodha ya Mzigo' },
    { id: 'snapshot' as const, label: 'Business Snapshot', labelSw: 'Muhtasari' },
    { id: 'money' as const, label: 'Money Plan', labelSw: 'Mpango wa Fedha' },
    { id: 'unlock' as const, label: 'KSh 499 Unlock', labelSw: 'KSh 499 Pro', badge: 'PRO' },
  ];

  trackingOptions = [
    { id: 'yes_regularly', label: 'Yes, regularly', labelSw: 'Ndiyo, mara kwa mara' },
    { id: 'sometimes', label: 'Sometimes', labelSw: 'Wakati mwingine' },
    { id: 'estimate', label: 'No, I mostly estimate', labelSw: 'Hapana, nakadiria' },
    { id: 'unknown', label: "I don't know yet", labelSw: 'Sijui bado' },
  ];

  onboardingForm = {
    businessType: '',
    operatingDuration: '',
    originalInvestment: '',
    investmentUnknown: false,
    peopleCount: '1',
    biggestChallenge: '',
    mostLikeToImprove: 'Increase daily sales',
    financialTrackingAbility: 'estimate',
    rent: '',
    wages: '',
    utilities: '',
    loanRepayments: '',
    averageStockPurchases: '',
    monthlySales: '',
  };

  dailyDraft = {
    date: new Date().toISOString().split('T')[0],
    sales: 0,
    expenses: 0,
  };

  draftItemsSold: ItemSoldDraft[] = [];

  newStockItem = {
    name: '',
    quantity: 1,
    buyingPrice: 0,
    sellingPrice: 0,
  };

  activeProfile: any = null;

  ngOnInit() {
    this.checkExistingProfile();
  }

  checkExistingProfile() {
    const userId = this.auth.getEffectiveUserId();
    const savedId = localStorage.getItem('compass_active_grow_id');

    if (savedId) {
      this.api.getGrowIntake(savedId).subscribe({
        next: res => {
          this.activeProfile = res;
        },
        error: () => {
          localStorage.removeItem('compass_active_grow_id');
        }
      });
    } else {
      this.api.getRecentIntakes(userId).subscribe({
        next: (list: any[]) => {
          if (list && list.length > 0) {
            this.activeProfile = list[0];
            localStorage.setItem('compass_active_grow_id', this.activeProfile._id);
          }
        },
        error: (err: any) => console.warn(err)
      });
    }
  }

  toggleInvestmentUnknown() {
    this.onboardingForm.investmentUnknown = !this.onboardingForm.investmentUnknown;
    if (this.onboardingForm.investmentUnknown) {
      this.onboardingForm.originalInvestment = "I don't know yet";
    } else {
      this.onboardingForm.originalInvestment = '';
    }
  }

  submitOnboarding(e: Event) {
    e.preventDefault();
    if (!this.onboardingForm.businessType || !this.onboardingForm.operatingDuration || !this.onboardingForm.biggestChallenge) {
      return;
    }

    this.loading = true;
    const userId = this.auth.getEffectiveUserId();

    const payload = {
      userId,
      businessType: this.onboardingForm.businessType,
      operatingDuration: this.onboardingForm.operatingDuration,
      originalInvestment: this.onboardingForm.investmentUnknown ? 'unknown' : this.onboardingForm.originalInvestment,
      peopleCount: this.onboardingForm.peopleCount,
      biggestChallenge: this.onboardingForm.biggestChallenge,
      mostLikeToImprove: this.onboardingForm.mostLikeToImprove,
      financialTrackingAbility: this.onboardingForm.financialTrackingAbility,
      optionalFinancials: {
        rent: this.onboardingForm.rent,
        wages: this.onboardingForm.wages,
        utilities: this.onboardingForm.utilities,
        loanRepayments: this.onboardingForm.loanRepayments,
        averageStockPurchases: this.onboardingForm.averageStockPurchases,
        monthlySales: this.onboardingForm.monthlySales,
      },
      monthlySalesRange: this.onboardingForm.monthlySales ? `KES ${this.onboardingForm.monthlySales}` : 'Under KES 50,000',
    };

    this.api.submitGrowIntake(payload).subscribe({
      next: res => {
        this.loading = false;
        this.activeProfile = res;
        localStorage.setItem('compass_active_grow_id', res._id);
        this.currentTab = 'daily';
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  resetProfile() {
    this.activeProfile = null;
    localStorage.removeItem('compass_active_grow_id');
  }

  getEstimatedDailyProfit(): number {
    const sales = Number(this.dailyDraft.sales) || 0;
    const expenses = Number(this.dailyDraft.expenses) || 0;
    return sales - expenses;
  }

  addItemSoldRow() {
    this.draftItemsSold.push({
      itemName: '',
      quantity: 1,
      sellingPrice: 0,
    });
  }

  removeItemSold(index: number) {
    this.draftItemsSold.splice(index, 1);
  }

  getItemsSoldTotal(): number {
    return this.draftItemsSold.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.sellingPrice)), 0);
  }

  hasItemSalesMismatch(): boolean {
    if (!this.showItemSales || this.draftItemsSold.length === 0) return false;
    const itemTotal = this.getItemsSoldTotal();
    const salesTotal = Number(this.dailyDraft.sales) || 0;
    return itemTotal > 0 && salesTotal > 0 && itemTotal !== salesTotal;
  }

  syncSalesWithItemsTotal() {
    this.dailyDraft.sales = this.getItemsSoldTotal();
  }

  onSalesAmountChange() {
    // If user types custom sales amount, it's allowed (Design principle in spec)
  }

  saveDailyRecord() {
    if (!this.activeProfile) return;
    this.savingDaily = true;

    const items = this.draftItemsSold
      .filter(i => i.itemName.trim().length > 0)
      .map(i => ({
        itemName: i.itemName.trim(),
        quantity: Number(i.quantity) || 1,
        sellingPrice: Number(i.sellingPrice) || 0,
        subtotal: (Number(i.quantity) || 1) * (Number(i.sellingPrice) || 0),
      }));

    const payload = {
      date: this.dailyDraft.date,
      sales: Number(this.dailyDraft.sales) || 0,
      expenses: Number(this.dailyDraft.expenses) || 0,
      itemsSold: items,
    };

    this.api.recordDailyTracking(this.activeProfile._id, payload).subscribe({
      next: (res: any) => {
        this.savingDaily = false;
        this.activeProfile = res.intake;

        // If items sold were not in stock, notify smoothly
        if (res.newItemsNotInStock && res.newItemsNotInStock.length > 0) {
          const names = res.newItemsNotInStock.join(', ');
          const msg = this.lang.isSwahili()
            ? `Bidhaa (${names}) hazipo kwenye orodha yako ya mzigo. Je, ungependa kuziweka kwenye orodha ya mzigo?`
            : `(${names}) aren't in your stock yet. You can add them under Stock Template!`;
          alert(msg);
        }

        // Reset inputs
        this.dailyDraft.sales = 0;
        this.dailyDraft.expenses = 0;
        this.draftItemsSold = [];
        this.showItemSales = false;
      },
      error: (err: any) => {
        this.savingDaily = false;
        console.error(err);
      }
    });
  }

  saveStockItem() {
    if (!this.activeProfile || !this.newStockItem.name) return;
    this.savingStock = true;

    this.api.addStockItem(this.activeProfile._id, this.newStockItem).subscribe({
      next: res => {
        this.savingStock = false;
        this.activeProfile = res;
        this.newStockItem = { name: '', quantity: 1, buyingPrice: 0, sellingPrice: 0 };
      },
      error: (err: any) => {
        this.savingStock = false;
        console.error(err);
      }
    });
  }

  deleteStock(itemId: string) {
    if (!this.activeProfile) return;
    this.api.deleteStockItem(this.activeProfile._id, itemId).subscribe({
      next: res => {
        this.activeProfile = res;
      },
      error: (err: any) => console.error(err)
    });
  }

  unlockPro() {
    if (!this.activeProfile) return;
    this.unlocking = true;

    // Simulate M-Pesa STK push or instant unlock
    setTimeout(() => {
      this.api.unlockGrowPremium(this.activeProfile._id).subscribe({
        next: res => {
          this.unlocking = false;
          this.activeProfile = res;
        },
        error: (err: any) => {
          this.unlocking = false;
          console.error(err);
        }
      });
    }, 900);
  }
}

