import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      <div class="text-center space-y-3">
        <span class="text-xs font-semibold uppercase tracking-widest text-gold">Simple, Transparent Pricing</span>
        <h1 class="text-3xl sm:text-5xl font-serif font-bold text-charcoal">
          Invest in Clarity. Avoid Costly Mistakes.
        </h1>
        <p class="text-charcoal/70 text-base max-w-xl mx-auto">
          Starting the wrong business costs hundreds of thousands of shillings in lost capital. Compass gives you certainty before you invest.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        <!-- Free Tier -->
        <div class="bg-white rounded-sheet p-8 border border-forest-line/15 shadow-light-sm flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <h3 class="font-serif font-bold text-2xl text-charcoal">Free Explorer</h3>
            <p class="text-xs text-charcoal/60">Discover who you are as an entrepreneur.</p>
            <div class="pt-2">
              <span class="font-serif text-4xl font-bold text-charcoal">KES 0</span>
              <span class="text-xs text-charcoal/60"> / forever</span>
            </div>

            <ul class="space-y-3 text-xs text-charcoal/80 pt-4 border-t border-forest-line/10">
              <li class="flex items-center gap-2">✓ Full 22-question assessment</li>
              <li class="flex items-center gap-2">✓ Discovery of your Entrepreneur Archetype</li>
              <li class="flex items-center gap-2">✓ Business Readiness Score (out of 100)</li>
              <li class="flex items-center gap-2">✓ Top 5 Strengths Profile overview</li>
              <li class="flex items-center gap-2 text-charcoal/40">✕ Full Business Recommendations & Budgets</li>
              <li class="flex items-center gap-2 text-charcoal/40">✕ 30-Day Launch Action Plan & Tasks</li>
            </ul>
          </div>

          <a
            routerLink="/pathfinder"
            class="w-full text-center py-3.5 rounded-button border border-forest font-semibold text-xs text-forest hover:bg-ivory transition-colors"
          >
            Start Free Assessment
          </a>
        </div>

        <!-- Pathfinder Full Access (Featured) -->
        <div class="bg-forest rounded-sheet p-8 text-ivory border-2 border-gold shadow-2xl relative flex flex-col justify-between space-y-6">
          <div class="absolute -top-3.5 right-6 px-3 py-1 rounded-pill bg-gold text-charcoal text-[11px] font-bold uppercase tracking-wider shadow">
            Launch Special
          </div>

          <div class="space-y-4">
            <h3 class="font-serif font-bold text-2xl text-ivory">Business Pathfinder</h3>
            <p class="text-xs text-ivory/70">Full business intelligence and 30-day execution blueprint.</p>
            <div class="pt-2">
              <span class="font-serif text-4xl font-bold text-gold">KES 499</span>
              <span class="text-xs text-ivory/60"> / one-time unlock</span>
            </div>

            <ul class="space-y-3 text-xs text-ivory/90 pt-4 border-t border-forest-line">
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> Everything in Free Explorer</li>
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> <strong>Top 3 Matched Businesses</strong> with match scores</li>
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> Complete startup capital breakdown in KES</li>
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> Advantage, risk analysis & concrete first step</li>
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> <strong>30-Day Launch Roadmap</strong> with checkable tasks</li>
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> Capital Allocation Guide (Inventory, Ads, Reserve)</li>
              <li class="flex items-center gap-2"><span class="text-gold font-bold">✓</span> Printable PDF plan export</li>
            </ul>
          </div>

          <a
            routerLink="/pathfinder"
            class="w-full text-center py-3.5 rounded-button bg-gold hover:bg-gold-soft font-semibold text-xs text-charcoal shadow-lg transition-all"
          >
            Unlock Pathfinder for KES 499
          </a>
        </div>

      </div>

    </div>
  `
})
export class PricingComponent {
  lang = inject(LanguageService);
}
