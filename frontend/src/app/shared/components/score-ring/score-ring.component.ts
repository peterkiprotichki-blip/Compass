import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-ring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center">
      <div class="relative flex items-center justify-center" [style.width.px]="size" [style.height.px]="size">
        <svg [attr.width]="size" [attr.height]="size" class="transform -rotate-90">
          <!-- Background track (12% opacity) -->
          <circle
            [attr.cx]="center"
            [attr.cy]="center"
            [attr.r]="radius"
            fill="transparent"
            [attr.stroke]="trackColor"
            [attr.stroke-width]="strokeWidth"
          />
          <!-- Active score stroke (Gold) -->
          <circle
            [attr.cx]="center"
            [attr.cy]="center"
            [attr.r]="radius"
            fill="transparent"
            [attr.stroke]="strokeColor"
            [attr.stroke-width]="strokeWidth"
            stroke-linecap="round"
            [attr.stroke-dasharray]="circumference"
            [attr.stroke-dashoffset]="dashOffset"
            class="transition-all duration-1000 ease-out"
          />
        </svg>

        <!-- Center percentage label in Playfair -->
        <div class="absolute flex flex-col items-center justify-center text-center">
          <span
            class="font-serif font-bold leading-none tracking-tight"
            [ngClass]="textColorClass"
            [style.font-size.px]="fontSize"
          >
            {{ score }}{{ suffix }}
          </span>
          <span *ngIf="sublabel" class="text-[10px] uppercase tracking-wider font-semibold opacity-70 mt-1">
            {{ sublabel }}
          </span>
        </div>
      </div>

      <p *ngIf="label" class="mt-2 text-sm font-semibold text-center text-charcoal">
        {{ label }}
      </p>
    </div>
  `
})
export class ScoreRingComponent {
  @Input() score: number = 85;
  @Input() size: number = 130;
  @Input() strokeWidth: number = 10;
  @Input() strokeColor: string = '#D4A017'; // Gold
  @Input() trackColor: string = 'rgba(212, 160, 23, 0.15)';
  @Input() textColorClass: string = 'text-charcoal';
  @Input() suffix: string = '%';
  @Input() label?: string;
  @Input() sublabel?: string;

  get center(): number {
    return this.size / 2;
  }

  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    const clamped = Math.min(Math.max(this.score, 0), 100);
    return this.circumference - (clamped / 100) * this.circumference;
  }

  get fontSize(): number {
    return Math.round(this.size * 0.28);
  }
}
