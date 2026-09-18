import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-grow-business',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      <!-- Header -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-forest text-gold text-xs font-semibold uppercase">
          <span>{{ lang.isSwahili() ? 'Dira ya Biashara · Tathmini ya Awali' : 'Business Compass · v1 Intake' }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
          {{ lang.isSwahili() ? 'Kukuza Biashara Yako Inayofanya Kazi' : 'Diagnose and Scale Your Business' }}
        </h1>
        <p class="text-charcoal/70 text-sm sm:text-base max-w-xl mx-auto">
          {{ lang.isSwahili() 
            ? 'Ingiza taarifa fupi kuhusu biashara yako kupokea uchunguzi wa haraka na mbinu za kuongeza mapato.'
            : 'For entrepreneurs already trading. Answer 4 questions to identify margin leaks and strategic levers.' 
          }}
        </p>
      </div>

      <!-- INTAKE FORM (When not submitted) -->
      <div *ngIf="!diagnosticResult" class="bg-white p-8 sm:p-10 rounded-sheet border border-forest-line/15 shadow-light-md space-y-6">
        
        <form (submit)="onSubmit($event)" class="space-y-6">
          
          <!-- Field 1: Business Type -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              {{ lang.isSwahili() ? '1. Unaendesha biashara ya aina gani?' : '1. What type of business are you operating?' }}
            </label>
            <input
              type="text"
              [(ngModel)]="formData.businessType"
              name="businessType"
              [placeholder]="lang.isSwahili() ? 'mfano: Duka la Mitumba, Kibanda cha Chakula, Saluni, Kilimo-Biashara' : 'e.g. Mitumba shop, Fast food kiosk, Salon, Agribusiness'"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            />
          </div>

          <!-- Field 2: Operating Duration -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              {{ lang.isSwahili() ? '2. Umekuwa ukiendesha biashara hii kwa muda gani?' : '2. How long have you been operating?' }}
            </label>
            <select
              [(ngModel)]="formData.operatingDuration"
              name="operatingDuration"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            >
              <option value="" disabled selected>{{ lang.isSwahili() ? 'Chagua muda wa uendeshaji' : 'Select operating age' }}</option>
              <option value="Less than 6 months">{{ lang.isSwahili() ? 'Chini ya miezi 6' : 'Less than 6 months' }}</option>
              <option value="6 to 12 months">{{ lang.isSwahili() ? 'Miezi 6 hadi 12' : '6 to 12 months' }}</option>
              <option value="1 to 3 years">{{ lang.isSwahili() ? 'Mwaka 1 hadi miaka 3' : '1 to 3 years' }}</option>
              <option value="More than 3 years">{{ lang.isSwahili() ? 'Zaidi ya miaka 3' : 'More than 3 years' }}</option>
            </select>
          </div>

          <!-- Field 3: Monthly Sales -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              {{ lang.isSwahili() ? '3. Makadirio ya wastani wa mapato kwa mwezi' : '3. Estimated average monthly revenue' }}
            </label>
            <select
              [(ngModel)]="formData.monthlySalesRange"
              name="monthlySalesRange"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            >
              <option value="" disabled selected>{{ lang.isSwahili() ? 'Chagua makadirio ya mapato' : 'Select revenue range' }}</option>
              <option value="Under KES 50,000">{{ lang.isSwahili() ? 'Chini ya KES 50,000' : 'Under KES 50,000' }}</option>
              <option value="KES 50,000 – 200,000">KES 50,000 – 200,000</option>
              <option value="KES 200,000 – 500,000">KES 200,000 – 500,000</option>
              <option value="Above KES 500,000">{{ lang.isSwahili() ? 'Zaidi ya KES 500,000' : 'Above KES 500,000' }}</option>
            </select>
          </div>

          <!-- Field 4: Biggest Challenge -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              {{ lang.isSwahili() ? '4. Ni kikwazo gani kikuu kinachokukabili kwa sasa?' : '4. What is your single biggest current bottleneck?' }}
            </label>
            <select
              [(ngModel)]="formData.biggestChallenge"
              name="biggestChallenge"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            >
              <option value="" disabled selected>{{ lang.isSwahili() ? 'Chagua kikwazo kikuu' : 'Select primary hurdle' }}</option>
              <option value="Customer acquisition & slow sales">{{ lang.isSwahili() ? 'Kupata wateja na mauzo duni' : 'Customer acquisition & slow sales' }}</option>
              <option value="Cash flow & customer credit debt (deni)">{{ lang.isSwahili() ? 'Mtiririko wa fedha na madeni ya wateja (deni)' : 'Cash flow & customer credit debt (deni)' }}</option>
              <option value="Lack of working capital for inventory">{{ lang.isSwahili() ? 'Ukosefu wa mtaji wa kuongeza bidhaa / mzigo' : 'Lack of working capital for inventory' }}</option>
              <option value="Staff reliability & daily operations">{{ lang.isSwahili() ? 'Uaminifu wa wafanyakazi na uendeshaji wa kila siku' : 'Staff reliability & daily operations' }}</option>
              <option value="High costs & thin profit margins">{{ lang.isSwahili() ? 'Gharama kubwa na faida finyu' : 'High costs & thin profit margins' }}</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              [disabled]="!isFormValid()"
              class="w-full bg-gold hover:bg-gold-soft disabled:opacity-40 text-charcoal font-semibold text-sm py-4 rounded-button shadow transition-all"
            >
              {{ lang.isSwahili() ? 'Tengeneza Tathmini ya Biashara →' : 'Generate Business Diagnostics →' }}
            </button>
          </div>

        </form>

      </div>

      <!-- DIAGNOSTIC RESULTS (After submission) -->
      <div *ngIf="diagnosticResult" class="bg-white p-8 sm:p-10 rounded-sheet border border-forest-line/15 shadow-light-lg space-y-8 animate-fadeIn">
        
        <div class="flex items-center gap-4 border-b border-forest-line/10 pb-6">
          <div class="w-12 h-12 rounded-full bg-forest text-gold flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <div>
            <span class="text-xs font-semibold text-gold uppercase tracking-wider">
              {{ lang.isSwahili() ? 'Uchambuzi wa Biashara Umekamilika' : 'Diagnostic Analysis Complete' }}
            </span>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              {{ lang.isSwahili() ? (diagnosticResult.diagnostics.verdictSw || diagnosticResult.diagnostics.verdict) : diagnosticResult.diagnostics.verdict }}
            </h2>
          </div>
        </div>

        <!-- Priority Focus Area -->
        <div class="p-5 bg-forest-deep text-ivory rounded-card border border-forest-line space-y-2">
          <span class="text-[10px] text-gold uppercase font-bold tracking-widest">
            {{ lang.isSwahili() ? 'Eneo Kuu Lililopendekezwa Kuzingatiwa' : 'Recommended Primary Focus' }}
          </span>
          <p class="text-xl font-serif font-bold text-ivory">
            {{ lang.isSwahili() ? (diagnosticResult.diagnostics.focusAreaSw || diagnosticResult.diagnostics.focusArea) : diagnosticResult.diagnostics.focusArea }}
          </p>
        </div>

        <!-- Actionable Recommendations -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold uppercase tracking-wider text-charcoal">
            {{ lang.isSwahili() ? 'Hatua za Haraka Zinazopendekezwa:' : 'Immediate Recommended Interventions:' }}
          </h3>
          <ul class="space-y-2.5 text-xs text-charcoal/80">
            <li *ngFor="let rec of (lang.isSwahili() && diagnosticResult.diagnostics.recommendationsSw ? diagnosticResult.diagnostics.recommendationsSw : diagnosticResult.diagnostics.recommendations)" class="flex items-start gap-2.5 p-3 rounded-button bg-ivory border border-forest-line/10">
              <span class="text-forest font-bold">👉</span>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>

        <!-- Concrete First Step -->
        <div class="p-5 bg-ivory border-l-4 border-gold rounded-r-card space-y-1">
          <span class="text-xs font-bold text-charcoal uppercase">
            {{ lang.isSwahili() ? 'Hatua ya Kwanza ya Jumatatu Asubuhi:' : 'Next Step for Monday Morning:' }}
          </span>
          <p class="text-sm font-medium text-forest">
            {{ lang.isSwahili() ? (diagnosticResult.diagnostics.concreteFirstStepSw || diagnosticResult.diagnostics.concreteFirstStep) : diagnosticResult.diagnostics.concreteFirstStep }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-forest-line/10">
          <button
            (click)="diagnosticResult = null"
            class="text-xs font-semibold text-charcoal/70 hover:text-charcoal"
          >
            {{ lang.isSwahili() ? '← Rudia Tathmini' : '← Retake Diagnostic' }}
          </button>

          <div class="flex items-center gap-3">
            <a
              routerLink="/learn"
              class="px-5 py-2.5 rounded-button border border-forest-line/20 hover:border-gold text-xs font-semibold text-charcoal"
            >
              {{ lang.isSwahili() ? 'Gundua Miongozo ya Ukuaji' : 'Explore Growth Guides' }}
            </a>
            <a
              routerLink="/"
              class="bg-forest text-ivory hover:bg-forest-deep px-6 py-2.5 rounded-button text-xs font-semibold shadow"
            >
              {{ lang.isSwahili() ? 'Rudi Nyumbani' : 'Return Home' }}
            </a>
          </div>
        </div>

      </div>

    </div>
  `
})
export class GrowBusinessComponent {
  api = inject(ApiService);
  lang = inject(LanguageService);
  auth = inject(AuthService);

  formData = {
    businessType: '',
    operatingDuration: '',
    monthlySalesRange: '',
    biggestChallenge: '',
  };

  diagnosticResult: any = null;

  isFormValid(): boolean {
    return !!(
      this.formData.businessType &&
      this.formData.operatingDuration &&
      this.formData.monthlySalesRange &&
      this.formData.biggestChallenge
    );
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.isFormValid()) return;

    const userId = this.auth.getEffectiveUserId();
    this.api.submitGrowIntake({
      userId,
      ...this.formData
    }).subscribe({
      next: res => {
        this.diagnosticResult = res;
      },
      error: err => console.error(err)
    });
  }
}
