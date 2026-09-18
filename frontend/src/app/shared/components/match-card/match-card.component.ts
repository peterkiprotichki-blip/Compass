import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessMatchItem } from '../../../models/compass.models';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-card border border-forest-line/15 p-6 shadow-light-sm hover:shadow-light-lg transition-all duration-300 relative overflow-hidden group">
      
      <!-- Top header line: Rank circle + Title + Match badge -->
      <div class="flex items-start justify-between gap-4">
        
        <div class="flex items-center gap-4">
          <!-- Ranked Numeral in Gold circle -->
          <div class="w-11 h-11 rounded-full bg-gold/15 border-2 border-gold text-charcoal font-serif font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            {{ rank }}
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                {{ lang.isSwahili() ? match.categorySw : match.category }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-pill font-medium"
                [ngClass]="{
                  'bg-emerald-100 text-emerald-800': match.riskLevel === 'Low',
                  'bg-amber-100 text-amber-800': match.riskLevel === 'Medium',
                  'bg-orange-100 text-orange-800': match.riskLevel === 'High'
                }">
                {{ match.riskLevel }} Risk
              </span>
            </div>
            <h3 class="text-xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors mt-0.5">
              {{ lang.isSwahili() ? match.nameSw : match.name }}
            </h3>
          </div>
        </div>

        <!-- Match Score Badge -->
        <div class="flex flex-col items-end">
          <div class="flex items-baseline gap-0.5 bg-forest-deep text-gold px-3.5 py-1.5 rounded-button shadow-sm">
            <span class="font-serif font-bold text-lg">{{ match.matchScore }}</span>
            <span class="text-xs font-semibold">% Match</span>
          </div>
        </div>

      </div>

      <!-- Key Metrics Row -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 py-3 border-y border-forest-line/10 bg-ivory/50 rounded-lg px-4 text-xs">
        <div>
          <span class="block text-charcoal/55 uppercase tracking-wider text-[10px] font-semibold">
            {{ lang.isSwahili() ? 'Mtaji Unaohitajika' : 'Capital Needed' }}
          </span>
          <span class="font-bold text-charcoal text-sm">
            KES {{ match.capitalRequiredMin | number }} – {{ match.capitalRequiredMax | number }}
          </span>
        </div>
        <div>
          <span class="block text-charcoal/55 uppercase tracking-wider text-[10px] font-semibold">
            {{ lang.isSwahili() ? 'Wateja wa Kwanza' : 'First Customer' }}
          </span>
          <span class="font-bold text-charcoal text-sm">
            {{ match.firstCustomerTimeline }}
          </span>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <span class="block text-charcoal/55 uppercase tracking-wider text-[10px] font-semibold">
            {{ lang.isSwahili() ? 'Faida Kuu' : 'Biggest Advantage' }}
          </span>
          <span class="text-charcoal font-medium truncate block">
            {{ match.biggestAdvantage }}
          </span>
        </div>
      </div>

      <!-- Why it fits bullets -->
      <div class="space-y-1.5 text-xs text-charcoal/80 mb-5">
        <p class="font-semibold text-charcoal text-xs uppercase tracking-wider">
          {{ lang.isSwahili() ? 'Kwanini Inakufaa:' : 'Why It Fits You:' }}
        </p>
        <ul class="space-y-1">
          <li *ngFor="let reason of match.whyItFits" class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>{{ reason }}</span>
          </li>
        </ul>
      </div>

      <!-- Editorial Risk & Concrete First Step callout -->
      <div class="bg-ivory border border-forest-line/10 rounded-lg p-3.5 text-xs space-y-2 mb-5">
        <div class="flex items-start gap-2">
          <span class="font-semibold text-amber-700 whitespace-nowrap">
            {{ lang.isSwahili() ? 'Hatari Kuu:' : 'Your Biggest Risk:' }}
          </span>
          <span class="text-charcoal/80">{{ match.biggestRisk }}</span>
        </div>
        <div class="flex items-start gap-2 pt-1 border-t border-forest-line/10">
          <span class="font-semibold text-forest whitespace-nowrap">
            {{ lang.isSwahili() ? 'Hatua ya Kwanza:' : 'First Step:' }}
          </span>
          <span class="text-charcoal font-medium">{{ match.firstStep }}</span>
        </div>
      </div>

      <!-- Footer action bar -->
      <div class="flex items-center justify-between pt-2">
        <button
          (click)="savePath.emit(match.businessId)"
          class="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-button border border-forest-line/20 hover:border-gold hover:text-forest transition-colors"
          [class.bg-gold/10]="isSaved"
          [class.text-forest]="isSaved"
        >
          <svg class="w-4 h-4" [class.fill-gold]="isSaved" [class.text-gold]="isSaved" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          <span>{{ isSaved ? lang.t.btnSaved : lang.t.btnSaveThisPath }}</span>
        </button>

        <a
          [routerLink]="['/business', match.businessId]"
          class="inline-flex items-center gap-1.5 bg-forest hover:bg-forest-deep text-ivory text-xs font-semibold px-4 py-2 rounded-button shadow transition-all"
        >
          <span>{{ lang.t.btnViewDetails }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

    </div>
  `
})
export class MatchCardComponent {
  lang = inject(LanguageService);
  @Input() match!: BusinessMatchItem;
  @Input() rank: number = 1;
  @Input() isSaved: boolean = false;
  @Output() savePath = new EventEmitter<string>();
}
