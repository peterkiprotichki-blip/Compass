import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <div class="flex items-center justify-between text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">
        <span>
          {{ lang.t.stepPrefix }} {{ currentStep }} {{ lang.t.stepOf }} {{ totalSteps }}
        </span>
        <span>{{ percentage }}%</span>
      </div>

      <!-- 2px Gold fill on 12% track -->
      <div class="w-full bg-forest/10 rounded-full h-1.5 overflow-hidden">
        <div
          class="bg-gold h-full rounded-full transition-all duration-300 ease-out"
          [style.width.%]="percentage"
        ></div>
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
}
