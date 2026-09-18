import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

export interface CheckableTask {
  id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-week-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-card border border-forest-line/15 p-5 shadow-light-sm transition-all duration-200">
      
      <!-- Week Title Banner -->
      <div class="flex items-center justify-between border-b border-forest-line/10 pb-3 mb-4">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center px-3 py-1 rounded-pill bg-forest-deep text-gold font-serif font-bold text-xs">
            {{ lang.isSwahili() ? 'Wiki ' + weekNumber : 'Week ' + weekNumber }}
          </span>
          <h4 class="font-serif font-bold text-charcoal text-base">
            {{ title }}
          </h4>
        </div>

        <span class="text-xs font-semibold text-charcoal/50">
          {{ completedCount }} / {{ tasks.length }} {{ lang.isSwahili() ? 'zimekamilika' : 'done' }}
        </span>
      </div>

      <!-- Tasks Checklist -->
      <div class="space-y-2.5">
        <div
          *ngFor="let task of tasks"
          (click)="interactive && onTaskToggle(task.id)"
          class="flex items-start gap-3 p-2.5 rounded-button transition-colors"
          [ngClass]="{
            'cursor-pointer hover:bg-ivory': interactive,
            'opacity-65': task.completed
          }"
        >
          <!-- Checkbox -->
          <div
            class="w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
            [ngClass]="{
              'bg-emerald-600 border-emerald-600 text-white': task.completed,
              'border-forest/30 bg-transparent': !task.completed
            }"
          >
            <svg *ngIf="task.completed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <!-- Title -->
          <span
            class="text-sm text-charcoal leading-snug"
            [class.line-through]="task.completed"
            [class.text-charcoal/60]="task.completed"
          >
            {{ task.title }}
          </span>
        </div>
      </div>

    </div>
  `
})
export class WeekBlockComponent {
  lang = inject(LanguageService);
  @Input() weekNumber: number = 1;
  @Input() title: string = '';
  @Input() tasks: CheckableTask[] = [];
  @Input() interactive: boolean = true;
  @Output() taskToggle = new EventEmitter<string>();

  get completedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  onTaskToggle(taskId: string) {
    this.taskToggle.emit(taskId);
  }
}
