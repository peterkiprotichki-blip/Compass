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
          <span>Business Compass · v1 Intake</span>
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
              1. What type of business are you operating?
            </label>
            <input
              type="text"
              [(ngModel)]="formData.businessType"
              name="businessType"
              placeholder="e.g. Mitumba shop, Fast food kiosk, Salon, Agribusiness"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            />
          </div>

          <!-- Field 2: Operating Duration -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              2. How long have you been operating?
            </label>
            <select
              [(ngModel)]="formData.operatingDuration"
              name="operatingDuration"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            >
              <option value="" disabled selected>Select operating age</option>
              <option value="Less than 6 months">Less than 6 months</option>
              <option value="6 to 12 months">6 to 12 months</option>
              <option value="1 to 3 years">1 to 3 years</option>
              <option value="More than 3 years">More than 3 years</option>
            </select>
          </div>

          <!-- Field 3: Monthly Sales -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              3. Estimated average monthly revenue
            </label>
            <select
              [(ngModel)]="formData.monthlySalesRange"
              name="monthlySalesRange"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            >
              <option value="" disabled selected>Select revenue range</option>
              <option value="Under KES 50,000">Under KES 50,000</option>
              <option value="KES 50,000 – 200,000">KES 50,000 – 200,000</option>
              <option value="KES 200,000 – 500,000">KES 200,000 – 500,000</option>
              <option value="Above KES 500,000">Above KES 500,000</option>
            </select>
          </div>

          <!-- Field 4: Biggest Challenge -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              4. What is your single biggest current bottleneck?
            </label>
            <select
              [(ngModel)]="formData.biggestChallenge"
              name="biggestChallenge"
              class="w-full p-3.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-sm focus:outline-none focus:border-gold"
              required
            >
              <option value="" disabled selected>Select primary hurdle</option>
              <option value="Customer acquisition & slow sales">Customer acquisition & slow sales</option>
              <option value="Cash flow & customer credit debt (deni)">Cash flow & customer credit debt (deni)</option>
              <option value="Lack of working capital for inventory">Lack of working capital for inventory</option>
              <option value="Staff reliability & daily operations">Staff reliability & daily operations</option>
              <option value="High costs & thin profit margins">High costs & thin profit margins</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              [disabled]="!isFormValid()"
              class="w-full bg-gold hover:bg-gold-soft disabled:opacity-40 text-charcoal font-semibold text-sm py-4 rounded-button shadow transition-all"
            >
              Generate Business Diagnostics →
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
            <span class="text-xs font-semibold text-gold uppercase tracking-wider">Diagnostic Analysis Complete</span>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              {{ diagnosticResult.diagnostics.verdict }}
            </h2>
          </div>
        </div>

        <!-- Priority Focus Area -->
        <div class="p-5 bg-forest-deep text-ivory rounded-card border border-forest-line space-y-2">
          <span class="text-[10px] text-gold uppercase font-bold tracking-widest">Recommended Primary Focus</span>
          <p class="text-xl font-serif font-bold text-ivory">{{ diagnosticResult.diagnostics.focusArea }}</p>
        </div>

        <!-- Actionable Recommendations -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold uppercase tracking-wider text-charcoal">
            Immediate Recommended Interventions:
          </h3>
          <ul class="space-y-2.5 text-xs text-charcoal/80">
            <li *ngFor="let rec of diagnosticResult.diagnostics.recommendations" class="flex items-start gap-2.5 p-3 rounded-button bg-ivory border border-forest-line/10">
              <span class="text-forest font-bold">👉</span>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>

        <!-- Concrete First Step -->
        <div class="p-5 bg-ivory border-l-4 border-gold rounded-r-card space-y-1">
          <span class="text-xs font-bold text-charcoal uppercase">Next Step for Monday Morning:</span>
          <p class="text-sm font-medium text-forest">
            {{ diagnosticResult.diagnostics.concreteFirstStep }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-forest-line/10">
          <button
            (click)="diagnosticResult = null"
            class="text-xs font-semibold text-charcoal/70 hover:text-charcoal"
          >
            ← Retake Diagnostic
          </button>

          <div class="flex items-center gap-3">
            <a
              routerLink="/learn"
              class="px-5 py-2.5 rounded-button border border-forest-line/20 hover:border-gold text-xs font-semibold text-charcoal"
            >
              Explore Growth Guides
            </a>
            <a
              routerLink="/"
              class="bg-forest text-ivory hover:bg-forest-deep px-6 py-2.5 rounded-button text-xs font-semibold shadow"
            >
              Return Home
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
