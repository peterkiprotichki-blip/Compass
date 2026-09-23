import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { Business } from '../../models/compass.models';
import { WeekBlockComponent } from '../../shared/components/week-block/week-block.component';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, WeekBlockComponent],
  template: `
    <div class="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10" *ngIf="business">
      
      <!-- Back Navigation -->
      <div>
        <button (click)="goBack()" class="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 hover:text-charcoal transition-colors">
          {{ lang.isSwahili() ? '← Rudi kwenye Matokeo' : '← Back to Results' }}
        </button>
      </div>

      <!-- Business Hero Header Card -->
      <div class="bg-forest rounded-sheet p-8 sm:p-12 text-ivory border border-forest-line shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div class="lg:col-span-8 space-y-4">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-widest text-gold">
                {{ lang.isSwahili() ? (business.categorySw || business.category) : business.category }}
              </span>
              <span class="text-xs px-2.5 py-0.5 rounded-pill font-medium"
                [ngClass]="{
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30': business.riskLevel === 'Low',
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30': business.riskLevel === 'Medium',
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30': business.riskLevel === 'High'
                }">
                {{ business.riskLevel === 'Low' ? (lang.isSwahili() ? 'Hatari Ndogo' : 'Low Risk') : (business.riskLevel === 'Medium' ? (lang.isSwahili() ? 'Hatari ya Wastani' : 'Medium Risk') : (lang.isSwahili() ? 'Hatari Kubwa' : 'High Risk')) }}
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory">
              {{ lang.isSwahili() ? (business.nameSw || business.name) : business.name }}
            </h1>

            <p class="text-sm text-ivory/80 leading-relaxed max-w-2xl">
              {{ lang.isSwahili() ? (business.descriptionSw || business.description) : business.description }}
            </p>

            <div class="pt-2 flex flex-wrap gap-2">
              <span *ngFor="let arch of business.bestArchetypes" class="px-3 py-1 rounded-pill bg-forest-deep border border-forest-line text-xs text-gold font-medium">
                {{ lang.isSwahili() ? 'Inamfaa: ' : 'Best For: ' }}{{ arch }}
              </span>
            </div>
          </div>

          <!-- Quick Stat Badge Box -->
          <div class="lg:col-span-4 bg-forest-deep p-6 rounded-card border border-forest-line space-y-4">
            <div>
              <span class="text-[10px] text-ivory/60 uppercase font-semibold tracking-wider block">
                {{ lang.isSwahili() ? 'Mtaji Unaohitajika' : 'Capital Required' }}
              </span>
              <p class="font-serif font-bold text-xl text-gold">
                KES {{ business.capitalRequiredMin | number }} – {{ business.capitalRequiredMax | number }}
              </p>
            </div>
            <div>
              <span class="text-[10px] text-ivory/60 uppercase font-semibold tracking-wider block">
                {{ lang.isSwahili() ? 'Muda wa Mteja wa Kwanza' : 'First Customer Timeline' }}
              </span>
              <p class="font-medium text-sm text-ivory">{{ business.firstCustomerTimeline }}</p>
            </div>
            <div>
              <span class="text-[10px] text-ivory/60 uppercase font-semibold tracking-wider block">
                {{ lang.isSwahili() ? 'Muda kwa Wiki' : 'Time Commitment' }}
              </span>
              <p class="font-medium text-sm text-ivory">{{ business.timeCommitment }} / {{ lang.isSwahili() ? 'wiki' : 'week' }}</p>
            </div>
            <div>
              <span class="text-[10px] text-ivory/60 uppercase font-semibold tracking-wider block">
                {{ lang.isSwahili() ? 'Ufaafu wa Eneo' : 'Location Suitability' }}
              </span>
              <p class="font-medium text-sm text-ivory">{{ business.locationFit.join(', ') }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-card border border-forest-line/10 shadow-light-sm">
        <button
          (click)="onToggleSave()"
          class="inline-flex items-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-button border border-forest-line/20 hover:border-gold transition-colors"
          [class.bg-gold/15]="isSaved"
          [class.text-forest]="isSaved"
        >
          <span>{{ isSaved ? (lang.isSwahili() ? '✓ Imehifadhiwa kwenye Wasifu' : '✓ Saved to Profile') : (lang.isSwahili() ? '★ Hifadhi Fursa Hii' : '★ Save This Path') }}</span>
        </button>

        <button
          (click)="onStartJourney()"
          class="bg-gold hover:bg-gold-soft text-charcoal font-semibold text-xs px-6 py-2.5 rounded-button shadow transition-all flex items-center gap-2"
        >
          <span>{{ lang.isSwahili() ? 'Anza Safari ya Utekelezaji' : 'Start My Tracked Journey' }}</span>
          <span>→</span>
        </button>
      </div>

      <!-- Editorial Overview (Who is it for, Advantage, Risk, First Step) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-white rounded-sheet p-6 border border-forest-line/15 shadow-light-sm space-y-4">
          <h3 class="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
            <svg class="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>{{ lang.isSwahili() ? 'Faida Kuu za Kimkakati' : 'Strategic Advantages' }}</span>
          </h3>
          <div class="space-y-3 text-xs text-charcoal/80">
            <div>
              <strong class="text-charcoal block mb-0.5">
                {{ lang.isSwahili() ? 'Inamfaa nani zaidi:' : 'Who this is best for:' }}
              </strong>
              <p>{{ business.whoIsThisBestFor }}</p>
            </div>
            <div>
              <strong class="text-forest block mb-0.5">
                {{ lang.isSwahili() ? 'Faida Kubwa Zaidi:' : 'Biggest Advantage:' }}
              </strong>
              <p>{{ business.biggestAdvantage }}</p>
            </div>
            <div>
              <strong class="text-charcoal block mb-0.5">
                {{ lang.isSwahili() ? 'Uwezo wa Kukuza:' : 'Growth Potential:' }}
              </strong>
              <p>{{ business.growthPotential }} {{ lang.isSwahili() ? 'uwezo mkubwa wa kukuza biashara na faida nzuri.' : 'scalability with high margin potential.' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-sheet p-6 border border-forest-line/15 shadow-light-sm space-y-4">
          <h3 class="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{{ lang.isSwahili() ? 'Udhibiti wa Hatari' : 'Risk Management' }}</span>
          </h3>
          <div class="space-y-3 text-xs text-charcoal/80">
            <div>
              <strong class="text-amber-700 block mb-0.5">
                {{ lang.isSwahili() ? 'Hatari Kuu ya Kiutendaji:' : 'Biggest Operational Risk:' }}
              </strong>
              <p>{{ business.biggestRisk }}</p>
            </div>
            <div>
              <strong class="text-charcoal block mb-0.5">
                {{ lang.isSwahili() ? 'Nani anapaswa kuepuka:' : 'Who should avoid this:' }}
              </strong>
              <p>{{ business.whoShouldAvoid }}</p>
            </div>
            <div class="pt-1 border-t border-forest-line/10">
              <strong class="text-forest block mb-0.5">
                {{ lang.isSwahili() ? 'Hatua Yako ya Kwanza Thabiti:' : 'Your Concrete First Step:' }}
              </strong>
              <p class="font-medium text-charcoal">{{ business.firstStep }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Startup Capital Split -->
      <div class="bg-white rounded-sheet p-6 sm:p-8 border border-forest-line/15 shadow-light-sm space-y-6">
        <div class="border-b border-forest-line/10 pb-4">
          <h3 class="text-xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Mchanganuo wa Mgawanyo wa Mtaji wa Kuanzia' : 'Startup Capital Allocation Breakdown' }}
          </h3>
          <p class="text-xs text-charcoal/60 mt-1">
            {{ lang.isSwahili() ? 'Asilimia zilizopendekezwa ili kuepuka kuishiwa na fedha za uendeshaji.' : 'Recommended percentage distribution to avoid running out of operating cash.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
            <p class="font-serif text-2xl font-bold text-forest">{{ business.capitalSplit.inventory }}%</p>
            <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">
              {{ lang.isSwahili() ? 'Bidhaa na Maandalizi' : 'Stock & Setup' }}
            </p>
          </div>
          <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
            <p class="font-serif text-2xl font-bold text-gold">{{ business.capitalSplit.marketing }}%</p>
            <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">
              {{ lang.isSwahili() ? 'Masoko na Uzinduzi' : 'Marketing & Launch' }}
            </p>
          </div>
          <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
            <p class="font-serif text-2xl font-bold text-charcoal">{{ business.capitalSplit.operations }}%</p>
            <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">
              {{ lang.isSwahili() ? 'Akiba ya Uendeshaji' : 'Operating Buffer' }}
            </p>
          </div>
          <div class="p-4 rounded-card bg-ivory border border-forest-line/10">
            <p class="font-serif text-2xl font-bold text-emerald-600">{{ business.capitalSplit.emergencyFund }}%</p>
            <p class="text-xs font-semibold text-charcoal/70 uppercase tracking-wider mt-1">
              {{ lang.isSwahili() ? 'Mfuko wa Dharura' : 'Emergency Reserve' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 30-Day Launch Roadmap (Week 1 to Week 4) -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-gold uppercase tracking-wider">
              {{ lang.isSwahili() ? 'Utekelezaji' : 'Implementation' }}
            </span>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              {{ lang.isSwahili() ? 'Mpango Kazi wa Siku 30' : '30-Day Launch Roadmap' }}
            </h2>
          </div>
          <span class="text-xs text-charcoal/60">{{ lang.isSwahili() ? 'Mavungu 4 ya Wiki' : '4 Week Blocks' }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-week-block
            *ngFor="let plan of business.thirtyDayPlan"
            [weekNumber]="plan.week"
            [title]="plan.title"
            [tasks]="getFormattedTasks(plan)"
            [interactive]="false"
          ></app-week-block>
        </div>
      </div>

    </div>
  `
})
export class BusinessDetailPageComponent implements OnInit {
  @Input() slug!: string;
  api = inject(ApiService);
  lang = inject(LanguageService);
  auth = inject(AuthService);
  router = inject(Router);

  business: Business | null = null;

  ngOnInit() {
    if (this.slug) {
      this.api.getBusinessBySlug(this.slug).subscribe({
        next: res => this.business = res,
        error: err => console.error(err)
      });
    }
  }

  get isSaved(): boolean {
    return this.business ? this.auth.isSaved(this.business.slug) : false;
  }

  onToggleSave() {
    if (!this.business) return;
    const userId = this.auth.getEffectiveUserId();
    this.api.toggleSavePath(userId, this.business.slug).subscribe({
      next: res => this.auth.updateSavedPaths(res.savedPaths)
    });
  }

  onStartJourney() {
    if (!this.business) return;
    const userId = this.auth.getEffectiveUserId();
    this.api.startJourney(userId, this.business.slug).subscribe({
      next: journey => this.router.navigate(['/journey', journey._id])
    });
  }

  getFormattedTasks(plan: any) {
    return (plan.tasks || []).map((t: string, idx: number) => ({
      id: `w${plan.week}_t${idx}`,
      title: t,
      completed: false
    }));
  }

  goBack() {
    window.history.back();
  }
}
