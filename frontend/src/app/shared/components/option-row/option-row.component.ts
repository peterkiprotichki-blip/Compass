import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-option-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (click)="selectedChange.emit(!isSelected)"
      class="w-full rounded-button p-4 cursor-pointer transition-all duration-200 border flex items-center justify-between text-left select-none"
      [ngClass]="{
        'bg-ivory border-gold shadow-sm ring-1 ring-gold': isSelected,
        'bg-ivory border-forest/15 hover:border-forest/35 hover:bg-ivory-sunk': !isSelected
      }"
    >
      <div class="pr-4">
        <p class="font-medium text-charcoal text-[15px]" [class.font-semibold]="isSelected">
          {{ label }}
        </p>
        <p *ngIf="subtitle" class="text-xs text-charcoal/60 mt-0.5">
          {{ subtitle }}
        </p>
      </div>

      <!-- Selector Icon (Circle for single, Square for multi) -->
      <div class="flex-shrink-0 flex items-center justify-center">
        <!-- Single select circle -->
        <div
          *ngIf="!isMulti"
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
          [ngClass]="{
            'border-gold bg-gold': isSelected,
            'border-forest/25 bg-transparent': !isSelected
          }"
        >
          <div *ngIf="isSelected" class="w-2 h-2 rounded-full bg-charcoal"></div>
        </div>

        <!-- Multi select square -->
        <div
          *ngIf="isMulti"
          class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
          [ngClass]="{
            'border-gold bg-gold': isSelected,
            'border-forest/25 bg-transparent': !isSelected
          }"
        >
          <svg *ngIf="isSelected" class="w-3.5 h-3.5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>
    </div>
  `
})
export class OptionRowComponent {
  @Input() label: string = '';
  @Input() subtitle?: string;
  @Input() isSelected: boolean = false;
  @Input() isMulti: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();
}
