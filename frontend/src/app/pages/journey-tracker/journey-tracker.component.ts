import { Component, OnInit, inject, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Journey } from '../../models/compass.models';
import { WeekBlockComponent } from '../../shared/components/week-block/week-block.component';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-journey-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule, WeekBlockComponent],
  template: `
    <!-- Loading State -->
    <div *ngIf="isLoading" class="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-20 bg-ivory">
      <div class="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-medium text-charcoal/70">
        {{ lang.isSwahili() ? 'Inapakia safari yako ya utekelezaji...' : 'Loading your 30-day launch roadmap...' }}
      </p>
    </div>

    <!-- Error State -->
    <div *ngIf="error && !isLoading" class="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto my-12 bg-white rounded-sheet border border-forest-line/15 shadow-sm">
      <div class="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3 class="font-serif font-bold text-xl text-charcoal">
        {{ lang.isSwahili() ? 'Safari Haikupatikana' : 'Journey Not Found' }}
      </h3>
      <p class="text-xs text-charcoal/70">{{ error }}</p>
      <a routerLink="/profile" class="px-5 py-2.5 rounded-button bg-forest text-gold text-xs font-semibold hover:bg-forest-deep transition-all">
        {{ lang.isSwahili() ? '← Rudi kwenye Dashibodi' : '← Return to Dashboard' }}
      </a>
    </div>

    <div class="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10" *ngIf="journey && !isLoading">
      
      <!-- Back Link -->
      <div>
        <a routerLink="/profile" class="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 hover:text-charcoal transition-colors">
          {{ lang.isSwahili() ? '← Rudi kwenye Dashibodi' : '← Back to Dashboard' }}
        </a>
      </div>

      <!-- Header Card with Progress Ring -->
      <div class="bg-forest rounded-sheet p-8 text-ivory border border-forest-line shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center sm:text-left">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Active Business Journey</span>
          <h1 class="text-3xl font-serif font-bold text-ivory">
            {{ journey.businessName }}
          </h1>
          <p class="text-xs text-ivory/70">
            30-Day Launch Roadmap · Check off milestones as you execute
          </p>
        </div>

        <div class="flex items-center gap-4 bg-forest-deep px-6 py-4 rounded-card border border-forest-line">
          <div class="text-right">
            <span class="text-2xl font-serif font-bold text-gold">{{ journey.progressPercentage }}%</span>
            <span class="block text-[10px] uppercase font-semibold text-ivory/60">Completed</span>
          </div>
          <div class="w-16 bg-forest/20 rounded-full h-2 overflow-hidden w-24">
            <div class="bg-gold h-full rounded-full transition-all duration-300" [style.width.%]="journey.progressPercentage"></div>
          </div>
        </div>
      </div>

      <!-- Completion Banner when 100% -->
      <div *ngIf="journey.isCompleted" class="bg-emerald-800/15 border-2 border-emerald-600 rounded-sheet p-6 text-center space-y-3 animate-fadeIn">
        <div class="w-12 h-12 mx-auto rounded-full bg-emerald-600/20 text-emerald-800 flex items-center justify-center">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 class="font-serif font-bold text-xl text-emerald-900">
          {{ lang.isSwahili() ? 'Hongera! Umekamilisha Mpango wa Siku 30!' : 'Congratulations! You completed your 30-Day Launch Roadmap!' }}
        </h3>
        <p class="text-xs text-emerald-800">
          {{ lang.isSwahili() ? 'Biashara yako sasa imezinduliwa rasmi. Endelea kutekeleza taratibu za kila siku.' : 'Your business is officially launched. Keep executing daily systems for sustainable growth.' }}
        </p>
      </div>

      <!-- 4 Stacked Week Blocks -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-serif font-bold text-charcoal">
            Weekly Milestones & Checklists
          </h3>
          <span class="text-xs text-charcoal/60">Click any task to toggle complete</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-week-block
            *ngFor="let week of journey.weeks"
            [weekNumber]="week.week"
            [title]="week.title"
            [tasks]="week.tasks"
            [interactive]="true"
            (taskToggle)="onToggleTask($event)"
          ></app-week-block>
        </div>
      </div>

    </div>
  `
})
export class JourneyTrackerPageComponent implements OnInit {
  @Input() id!: string;
  api = inject(ApiService);
  lang = inject(LanguageService);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  journey: Journey | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const journeyId = params.get('id') || this.id;
      if (journeyId) {
        this.loadJourney(journeyId);
      } else {
        this.isLoading = false;
        this.error = 'No journey identifier provided.';
        this.cdr.detectChanges();
      }
    });
  }

  loadJourney(journeyId: string) {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.api.getJourneyById(journeyId).subscribe({
      next: res => {
        this.journey = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load journey', err);
        this.journey = null;
        this.isLoading = false;
        this.error = this.lang.isSwahili()
          ? 'Samahani, hatukuweza kupata safari hii ya biashara.'
          : 'Sorry, we could not find this business journey.';
        this.cdr.detectChanges();
      }
    });
  }

  onToggleTask(taskId: string) {
    if (!this.journey) return;
    this.api.toggleJourneyTask(this.journey._id, taskId).subscribe({
      next: updated => {
        this.journey = updated;
        this.cdr.detectChanges();
        if (updated.isCompleted) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      },
      error: err => {
        console.error('Failed to toggle task', err);
      }
    });
  }
}

