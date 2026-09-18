import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      
      <!-- Header -->
      <div class="text-center space-y-3">
        <span class="text-xs font-semibold uppercase tracking-widest text-gold">Compass Academy</span>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
          Practical Guides for African Entrepreneurs
        </h1>
        <p class="text-charcoal/70 text-sm max-w-xl mx-auto">
          No jargon, no theoretical MBA models. Just practical, tested operational playbooks tailored to East African realities.
        </p>
      </div>

      <!-- Categories Filter -->
      <div class="flex flex-wrap items-center justify-center gap-2">
        <button
          *ngFor="let cat of categories"
          (click)="selectedCategory = cat"
          class="px-4 py-2 rounded-pill text-xs font-semibold transition-all border"
          [ngClass]="{
            'bg-forest text-gold border-forest shadow': selectedCategory === cat,
            'bg-white text-charcoal/70 border-forest-line/15 hover:border-gold': selectedCategory !== cat
          }"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Guides Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let guide of filteredGuides" class="bg-white rounded-card border border-forest-line/15 p-6 shadow-light-sm hover:shadow-light-lg transition-all duration-300 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gold px-2.5 py-1 rounded-pill bg-ivory-sunk inline-block">
              {{ guide.category }}
            </span>
            <h3 class="font-serif font-bold text-lg text-charcoal leading-snug">
              {{ guide.title }}
            </h3>
            <p class="text-xs text-charcoal/70 leading-relaxed">
              {{ guide.summary }}
            </p>
          </div>

          <div class="pt-4 border-t border-forest-line/10 flex items-center justify-between text-xs font-semibold text-forest">
            <span>{{ guide.readTime }} read</span>
            <span class="group-hover:translate-x-1 transition-transform">Read Guide →</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LearnComponent {
  lang = inject(LanguageService);
  selectedCategory = 'All';

  categories = ['All', 'Cash Flow & Pricing', 'Marketing & Sales', 'Operations & Permits'];

  guides = [
    {
      category: 'Cash Flow & Pricing',
      title: 'How to Stop Customer Credit (Deni) from Killing Your Business',
      summary: 'Practical psychological scripts and polite signage to collect money without losing client goodwill.',
      readTime: '4 min'
    },
    {
      category: 'Cash Flow & Pricing',
      title: 'Calculating True Unit Costs in Retail & Food',
      summary: 'Factoring in transport fare, packaging bags, and county fees so you never sell at an invisible loss.',
      readTime: '6 min'
    },
    {
      category: 'Marketing & Sales',
      title: 'The WhatsApp Status Playbook for Kenyan Hustlers',
      summary: 'How to post high-converting video clips and photos that generate direct orders every morning.',
      readTime: '5 min'
    },
    {
      category: 'Marketing & Sales',
      title: 'Getting Your First 20 Customers with Zero Ad Budget',
      summary: 'Cold outreach, physical door drops, and word-of-mouth incentives that work in residential estates.',
      readTime: '7 min'
    },
    {
      category: 'Operations & Permits',
      title: 'Navigating County Business Permits & Health Certificates',
      summary: 'Step-by-step documentation requirements to operate legally and avoid harassment from local authorities.',
      readTime: '5 min'
    },
    {
      category: 'Operations & Permits',
      title: 'Hiring on Commission: Incentivizing Attendants & Barbers',
      summary: 'Structuring win-win agreements that reward hard workers while protecting your baseline operating rent.',
      readTime: '6 min'
    }
  ];

  get filteredGuides() {
    if (this.selectedCategory === 'All') return this.guides;
    return this.guides.filter(g => g.category === this.selectedCategory);
  }
}
