import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full space-y-2">
      <!-- Top header line with Step count and Percentage pill -->
      <div class="flex items-center justify-between text-xs font-semibold">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-forest-deep text-gold border border-forest-line text-[11px] font-bold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            <span>{{ lang.t.stepPrefix }} {{ currentStep }} {{ lang.t.stepOf }} {{ totalSteps }}</span>
          </span>
          <span class="hidden sm:inline text-xs text-charcoal/60 font-medium">
            {{ milestoneText }}
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold text-forest">{{ percentage }}%</span>
          <span class="text-[10px] uppercase tracking-wider text-charcoal/50 font-semibold">{{ lang.isSwahili() ? 'Imekamilika' : 'Complete' }}</span>
        </div>
      </div>

      <!-- Glowing Gold Progress Bar with Milestone Pips -->
      <div class="relative w-full bg-forest-line/15 rounded-full h-2 overflow-hidden shadow-inner">
        <!-- Filled bar with luxury gold gradient -->
        <div
          class="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-soft transition-all duration-400 ease-out relative shadow-sm"
          [style.width.%]="percentage"
        >
          <!-- Glowing leading edge light -->
          <div class="absolute right-0 top-0 bottom-0 w-3 bg-white/70 blur-[2px] rounded-full"></div>
        </div>
      </div>

      <!-- Encouraging motivational sub-text for mobile / concise view -->
      <div class="flex sm:hidden items-center justify-between text-[11px] text-charcoal/60 font-medium pt-0.5">
        <span>{{ milestoneText }}</span>
      </div>
    </div>
  `
})
export class ProgressBarComponent {
  lang = inject(LanguageService);
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 22;

  get percentage(): number {
    return Math.min(Math.max(Math.round((this.currentStep / this.totalSteps) * 100), 0), 100);
  }

  get milestoneText(): string {
    const p = this.percentage;
    const sw = this.lang.isSwahili();

    if (p <= 20) {
      return sw ? 'Msingi: Eneo na Mtaji wako' : 'Laying foundation: Location & Starting budget';
    } else if (p <= 45) {
      return sw ? 'Ugunduzi wa Nguvu: Kujenga Haiba Yako' : 'Strength discovery: Uncovering your Archetype';
    } else if (p <= 70) {
      return sw ? 'Mtindo wa Kazi: Jinsi unavyopata Wateja' : 'Work style: Calibrating your operating rhythm';
    } else if (p <= 88) {
      return sw ? 'Malengo ya Mapato: Kulinganisha Biashara' : 'Financial goals: Matching revenue models';
    } else {
      return sw ? 'Hatua ya Mwisho: Inaandaa Biashara 3 Bora!' : 'Final step: Preparing your top 3 matches!';
    }
  }
}
