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
        <span class="text-xs font-semibold uppercase tracking-widest text-gold">
          {{ lang.isSwahili() ? 'Chuo cha Compass' : 'Compass Academy' }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
          {{ lang.isSwahili() ? 'Miongozo ya Vitendo kwa Wajasiriamali wa Afrika' : 'Practical Guides for African Entrepreneurs' }}
        </h1>
        <p class="text-charcoal/70 text-sm max-w-xl mx-auto">
          {{ lang.isSwahili() 
            ? 'Bila maneno magumu ya kinadharia. Miongozo halisi na ya vitendo iliyojaribiwa kwa mazingira ya Afrika Mashariki.'
            : 'No jargon, no theoretical MBA models. Just practical, tested operational playbooks tailored to East African realities.' 
          }}
        </p>
      </div>

      <!-- Categories Filter -->
      <div class="flex flex-wrap items-center justify-center gap-2">
        <button
          *ngFor="let cat of categories"
          (click)="selectedCategory = cat.id"
          class="px-4 py-2 rounded-pill text-xs font-semibold transition-all border"
          [ngClass]="{
            'bg-forest text-gold border-forest shadow': selectedCategory === cat.id,
            'bg-white text-charcoal/70 border-forest-line/15 hover:border-gold': selectedCategory !== cat.id
          }"
        >
          {{ lang.isSwahili() ? cat.labelSw : cat.label }}
        </button>
      </div>

      <!-- Guides Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let guide of filteredGuides" class="bg-white rounded-card border border-forest-line/15 p-6 shadow-light-sm hover:shadow-light-lg transition-all duration-300 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gold px-2.5 py-1 rounded-pill bg-ivory-sunk inline-block">
              {{ lang.isSwahili() ? guide.categorySw : guide.category }}
            </span>
            <h3 class="font-serif font-bold text-lg text-charcoal leading-snug">
              {{ lang.isSwahili() ? guide.titleSw : guide.title }}
            </h3>
            <p class="text-xs text-charcoal/70 leading-relaxed">
              {{ lang.isSwahili() ? guide.summarySw : guide.summary }}
            </p>
          </div>

          <div class="pt-4 border-t border-forest-line/10 flex items-center justify-between text-xs font-semibold text-forest">
            <span>{{ guide.readTime }} {{ lang.isSwahili() ? 'kusoma' : 'read' }}</span>
            <span class="group-hover:translate-x-1 transition-transform">
              {{ lang.isSwahili() ? 'Soma Mwongozo →' : 'Read Guide →' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LearnComponent {
  lang = inject(LanguageService);
  selectedCategory = 'All';

  categories = [
    { id: 'All', label: 'All', labelSw: 'Yote' },
    { id: 'Cash Flow & Pricing', label: 'Cash Flow & Pricing', labelSw: 'Mtiririko wa Fedha na Bei' },
    { id: 'Marketing & Sales', label: 'Marketing & Sales', labelSw: 'Masoko na Mauzo' },
    { id: 'Operations & Permits', label: 'Operations & Permits', labelSw: 'Uendeshaji na Vibali' },
  ];

  guides = [
    {
      category: 'Cash Flow & Pricing',
      categorySw: 'Mtiririko wa Fedha na Bei',
      title: 'How to Stop Customer Credit (Deni) from Killing Your Business',
      titleSw: 'Jinsi ya Kuzuia Madeni ya Wateja (Deni) Kuumiza Biashara Yako',
      summary: 'Practical psychological scripts and polite signage to collect money without losing client goodwill.',
      summarySw: 'Mbinu za kisaikolojia na maneno ya heshima ya kudai fedha zako bila kupoteza uhusiano mwema na wateja.',
      readTime: '4 min'
    },
    {
      category: 'Cash Flow & Pricing',
      categorySw: 'Mtiririko wa Fedha na Bei',
      title: 'Calculating True Unit Costs in Retail & Food',
      titleSw: 'Kupiga Hesabu ya Gharama Halisi ya Bidhaa Katika Rejareja na Chakula',
      summary: 'Factoring in transport fare, packaging bags, and county fees so you never sell at an invisible loss.',
      summarySw: 'Kujumuisha nauli, mifuko ya vifungashio, na ushuru wa kaunti ili usiwahi kuuza kwa hasara bila kujua.',
      readTime: '6 min'
    },
    {
      category: 'Marketing & Sales',
      categorySw: 'Masoko na Mauzo',
      title: 'The WhatsApp Status Playbook for Kenyan Hustlers',
      titleSw: 'Mwongozo wa WhatsApp Status kwa Wajasiriamali wa Kenya',
      summary: 'How to post high-converting video clips and photos that generate direct orders every morning.',
      summarySw: 'Jinsi ya kupakia video na picha fupi zinazovutia na kuleta oda za papo kwa papo kila asubuhi.',
      readTime: '5 min'
    },
    {
      category: 'Marketing & Sales',
      categorySw: 'Masoko na Mauzo',
      title: 'Getting Your First 20 Customers with Zero Ad Budget',
      titleSw: 'Kupata Wateja Wako 20 wa Kwanza Bila Bajeti ya Matangazo',
      summary: 'Cold outreach, physical door drops, and word-of-mouth incentives that work in residential estates.',
      summarySw: 'Mbinu za kuwafikia watu mtaani, vipeperushi na motisha za wateja kukuletea wenzao mtaani kwako.',
      readTime: '7 min'
    },
    {
      category: 'Operations & Permits',
      categorySw: 'Uendeshaji na Vibali',
      title: 'Navigating County Business Permits & Health Certificates',
      titleSw: 'Kupata Vibali vya Biashara vya Kaunti na Vyeti vya Afya',
      summary: 'Step-by-step documentation requirements to operate legally and avoid harassment from local authorities.',
      summarySw: 'Mahitaji yote ya nyaraka hatua kwa hatua ili kufanya biashara kihalali na kuepuka usumbufu wa maafisa.',
      readTime: '5 min'
    },
    {
      category: 'Operations & Permits',
      categorySw: 'Uendeshaji na Vibali',
      title: 'Hiring on Commission: Incentivizing Attendants & Barbers',
      titleSw: 'Kuajiri kwa Kamisheni: Kuwapa Motisha Wahudumu na Vinyozi',
      summary: 'Structuring win-win agreements that reward hard workers while protecting your baseline operating rent.',
      summarySw: 'Kupanga makubaliano yenye manufaa kwa pande zote yanayolipa wachapakazi huku ukilinda kodi yako ya pango.',
      readTime: '6 min'
    }
  ];

  get filteredGuides() {
    if (this.selectedCategory === 'All') return this.guides;
    return this.guides.filter(g => g.category === this.selectedCategory);
  }
}
