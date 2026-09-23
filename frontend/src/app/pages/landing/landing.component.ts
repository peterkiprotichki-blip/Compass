import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ScoreRingComponent } from '../../shared/components/score-ring/score-ring.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ScoreRingComponent],
  template: `
    <div class="min-h-screen bg-ivory">
      
      <!-- HERO SECTION (Deep Forest full-bleed with gold accents) -->
      <section class="relative bg-forest text-ivory overflow-hidden pt-12 pb-24 md:py-28 border-b border-forest-line">
        
        <!-- Subtle background map / compass watermark -->
        <div class="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <!-- Ambient gold glow in top right -->
        <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Text Column -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Overline Badge -->
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-forest-deep border border-forest-line text-xs font-semibold text-gold uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span>{{ lang.isSwahili() ? 'Kwa Wajasiriamali wa Afrika' : 'For African Entrepreneurs · At Every Stage' }}</span>
              </div>

              <!-- Main Display Headline in Playfair Display -->
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-ivory leading-[1.1]">
                {{ lang.isSwahili() ? 'Njia bora zaidi ya kujenga mustakabali wako.' : 'A smarter way to build your future.' }}
              </h1>

              <!-- Subtitle -->
              <p class="text-lg sm:text-xl text-ivory/80 max-w-2xl font-normal leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Compass huwasaidia wajasiriamali wa Afrika kugundua, kuanzisha na kukuza biashara zenye faida kupitia mwongozo maalum, tathmini ya nguvu na hatua za kiutendaji.'
                  : 'Compass turns a person’s strengths, capital, location, time and goals into a clear business direction and a practical set of next steps.' 
                }}
              </p>

              <!-- Campaign signature in Playfair italic -->
              <div class="pt-1">
                <span class="font-serif italic text-gold text-2xl font-normal tracking-wide">
                  Ideas to Impact.
                </span>
              </div>

              <!-- CTA Buttons -->
              <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  routerLink="/pathfinder"
                  class="inline-flex items-center justify-center bg-gold hover:bg-gold-soft text-charcoal font-semibold text-base px-8 py-4 rounded-button shadow-lg hover:shadow-gold-glow transition-all duration-200"
                >
                  <span>{{ lang.t.btnStartMyBusiness }}</span>
                  <svg class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>

                <a
                  routerLink="/grow-business"
                  class="inline-flex items-center justify-center bg-forest-deep hover:bg-forest-line border border-forest-line text-ivory font-semibold text-base px-8 py-4 rounded-button transition-all duration-200"
                >
                  <span>{{ lang.t.btnGrowMyBusiness }}</span>
                </a>
              </div>

            </div>

            <!-- Right Hero Card / Compass Visual -->
            <div class="lg:col-span-5 flex justify-center">
              <div class="relative w-full max-w-md bg-forest-deep/90 border border-forest-line rounded-sheet p-8 shadow-2xl backdrop-blur-sm">
                
                <div class="flex items-center justify-between border-b border-forest-line pb-4 mb-6">
                  <div class="flex items-center gap-3">
                    <img src="brand/compass-mark.png" alt="Compass Mark" class="w-10 h-10 animate-spin-slow">
                    <div>
                      <h4 class="font-serif font-bold text-ivory text-base">
                        {{ lang.isSwahili() ? 'Dira ya Biashara' : 'Business Pathfinder' }}
                      </h4>
                      <p class="text-xs text-gold">
                        {{ lang.isSwahili() ? 'Maswali 22 · Nguvu 15' : '22 Questions · 15 Strengths' }}
                      </p>
                    </div>
                  </div>
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-pill bg-gold/15 text-gold border border-gold/30">
                    KES 499
                  </span>
                </div>

                <!-- Preview Metric -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between bg-forest p-4 rounded-card border border-forest-line">
                    <div>
                      <span class="text-xs text-ivory/60 uppercase font-semibold tracking-wider">
                        {{ lang.isSwahili() ? 'Mfano wa Haiba' : 'Example Archetype' }}
                      </span>
                      <p class="font-serif font-bold text-lg text-ivory">
                        {{ lang.isSwahili() ? 'Muuzaji Hodari' : 'The Seller' }}
                      </p>
                      <p class="text-xs text-gold mt-0.5">
                        {{ lang.isSwahili() ? 'Mauzo · Mawasiliano · Mtandao' : 'Sales · Communication · Network' }}
                      </p>
                    </div>
                    <app-score-ring [score]="94" [size]="75" [strokeWidth]="7" textColorClass="text-ivory"></app-score-ring>
                  </div>

                  <div class="p-3.5 bg-ivory/5 rounded-card text-xs text-ivory/70 space-y-1.5 border border-forest-line/50">
                    <p class="font-semibold text-gold">
                      {{ lang.isSwahili() ? 'Fursa Zilizolingana:' : 'Matched Opportunities:' }}
                    </p>
                    <p class="flex items-center justify-between">
                      <span>{{ lang.isSwahili() ? '1. Duka la Marashi na Manukato' : '1. Perfume & Fragrance Hub' }}</span>
                      <span class="text-emerald-400 font-bold">96% {{ lang.isSwahili() ? 'Ufaafu' : 'Match' }}</span>
                    </p>
                    <p class="flex items-center justify-between">
                      <span>{{ lang.isSwahili() ? '2. Duka Maalum la Mitumba' : '2. Curated Mitumba Boutique' }}</span>
                      <span class="text-emerald-400 font-bold">92% {{ lang.isSwahili() ? 'Ufaafu' : 'Match' }}</span>
                    </p>
                  </div>

                  <a
                    routerLink="/pathfinder"
                    class="w-full flex items-center justify-center bg-gold text-charcoal font-semibold text-sm py-3 rounded-button hover:bg-gold-soft transition-colors"
                  >
                    {{ lang.isSwahili() ? 'Fanya Tathmini ya Bure ya Dakika 3' : 'Take Free 3-Minute Assessment' }}
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      <!-- PROOF STATS STRIP -->
      <section class="bg-forest-deep border-b border-forest-line text-ivory py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div class="p-3">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-gold">KE</p>
              <p class="text-xs sm:text-sm text-ivory/70 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Imejengwa kwa Wakenya' : 'Built for Kenyan Founders' }}
              </p>
            </div>

            <div class="p-3 border-l border-forest-line/40">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-gold">30+</p>
              <p class="text-xs sm:text-sm text-ivory/70 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Mifumo ya Biashara za Kiafrika' : 'African Business Models' }}
              </p>
            </div>

            <div class="p-3 border-l border-forest-line/40">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-gold">2</p>
              <p class="text-xs sm:text-sm text-ivory/70 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Lugha (Kiingereza | Kiswahili)' : 'Languages (EN | SW)' }}
              </p>
            </div>

            <div class="p-3 border-l border-forest-line/40">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-gold">1 Goal</p>
              <p class="text-xs sm:text-sm text-ivory/70 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Afrika Yenye Mwangaza' : 'A Brighter Africa' }}
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- VALUE STRIP -->
      <section class="bg-ivory-sunk py-6 border-b border-forest-line/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span>{{ lang.isSwahili() ? 'Mwongozo wa Kibinafsi' : 'Personalised Guidance' }}</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span>{{ lang.isSwahili() ? 'Fursa za Kienyeji' : 'Local Opportunities' }}</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span>{{ lang.isSwahili() ? 'Hatua za Kiutendaji' : 'Practical Next Steps' }}</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span>{{ lang.isSwahili() ? 'Imejengwa kwa Watu Halisi' : 'Built for Real People' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- WHAT ARE YOU TRYING TO DO? JOURNEY CARDS -->
      <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Je, unajaribu kufanya nini leo?' : 'What are you trying to do today?' }}
          </h2>
          <p class="text-charcoal/70 text-base sm:text-lg mt-3 leading-relaxed">
            {{ lang.isSwahili() 
              ? 'Iwe ndio unaanza safari yako au tayari una biashara inayofanya kazi, Compass inakupa mwelekeo wa wazi na zana za kusonga mbele.'
              : 'Whether you are just getting started or already in business, Compass gives you the clarity and practical tools to move forward.' 
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <!-- Card 1: Start My Business (Pathfinder) -->
          <div class="bg-white rounded-sheet p-8 border border-forest-line/15 shadow-light-lg hover:border-gold transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                  <polygon points="12 7 16.5 16.5 7.5 16.5" fill="currentColor" opacity="0.8" />
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors">
                {{ lang.t.btnStartMyBusiness }}
              </h3>
              <p class="text-charcoal/70 text-sm leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Gundua biashara inayokufaa kulingana na nguvu zako, mtaji, muda na mazingira ya mtaa wako. Tathmini ya maswali 22 inayolinganishwa na mifumo 30+ halisi ya biashara.'
                  : 'Discover the best business ideas for you based on your strengths, capital, time and your local neighborhood environment. A 22-question assessment matched against 30+ real Kenyan business models.' 
                }}
              </p>
              <div class="space-y-2 pt-2 text-xs font-semibold text-charcoal/80">
                <p class="flex items-center gap-2">✓ {{ lang.isSwahili() ? 'Inagundua Haiba Yako ya Kiuasiriamali' : 'Discovers your Entrepreneur Archetype' }}</p>
                <p class="flex items-center gap-2">✓ {{ lang.isSwahili() ? 'Inapiga hesabu ya Utayari wa Kuanza kati ya 100' : 'Computes your 100-point Business Readiness Score' }}</p>
                <p class="flex items-center gap-2">✓ {{ lang.isSwahili() ? 'Biashara 3 bora zenye mpango kazi wa siku 30' : 'Top 3 Matched businesses with 30-day action plans' }}</p>
              </div>
            </div>

            <div class="pt-8">
              <a
                routerLink="/pathfinder"
                class="w-full flex items-center justify-between bg-gold hover:bg-gold-soft text-charcoal font-semibold text-sm px-6 py-3.5 rounded-button shadow transition-all"
              >
                <span>{{ lang.isSwahili() ? 'Anza Safari ya Pathfinder' : 'Launch Business Pathfinder' }}</span>
                <span class="w-8 h-8 rounded-full bg-charcoal text-ivory flex items-center justify-center">→</span>
              </a>
            </div>
          </div>

          <!-- Card 2: Grow My Business (Business Compass) -->
          <div class="bg-white rounded-sheet p-8 border border-forest-line/15 shadow-light-lg hover:border-forest transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors">
                {{ lang.t.btnGrowMyBusiness }}
              </h3>
              <p class="text-charcoal/70 text-sm leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Tayari unafanya biashara? Jibu maswali 4 ya haraka kueleza aina ya biashara, mapato na kikwazo kikuu, upokee uchambuzi na mbinu thabiti za kukuza mapato.'
                  : 'Already trading? Complete a 3-minute intake capturing your business type, revenue tier, and primary obstacle, and receive tailored diagnostics and practical growth levers.' 
                }}
              </p>
              <div class="space-y-2 pt-2 text-xs font-semibold text-charcoal/80">
                <p class="flex items-center gap-2">✓ {{ lang.isSwahili() ? 'Uchambuzi wa mtiririko wa fedha na hasara za bei' : 'Cash flow and pricing leakage diagnostics' }}</p>
                <p class="flex items-center gap-2">✓ {{ lang.isSwahili() ? 'Miongozo ya kuvutia na kudumisha wateja' : 'Customer acquisition & retention playbooks' }}</p>
                <p class="flex items-center gap-2">✓ {{ lang.isSwahili() ? 'Uboreshaji wa mtaji na mzunguko wa bidhaa' : 'Working capital and inventory turn optimization' }}</p>
              </div>
            </div>

            <div class="pt-8">
              <a
                routerLink="/grow-business"
                class="w-full flex items-center justify-between bg-forest hover:bg-forest-deep text-ivory font-semibold text-sm px-6 py-3.5 rounded-button shadow transition-all"
              >
                <span>{{ lang.isSwahili() ? 'Fanya Tathmini ya Biashara' : 'Diagnose My Business' }}</span>
                <span class="w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center">→</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <!-- HOW COMPASS WORKS (4 STEPS) -->
      <section class="py-20 bg-ivory-sunk border-y border-forest-line/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="text-xs font-semibold text-gold uppercase tracking-widest">
              {{ lang.isSwahili() ? 'Mchakato' : 'Process' }}
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal mt-2">
              {{ lang.isSwahili() ? 'Jinsi Compass Inavyofanya Kazi' : 'How Compass Works' }}
            </h2>
            <p class="text-charcoal/70 text-base mt-2">
              {{ lang.isSwahili() ? 'Njia rahisi na thabiti kutoka kwenye mkanganyiko hadi kwenye utekelezaji.' : 'A simple, powerful methodology from confusion to action.' }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold font-serif font-bold text-lg flex items-center justify-center">
                1
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Tueleze kukuhusu' : 'Tell us about you' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Jibu maswali 22 kuhusu uwezo wako, mtindo wa maisha, mtaji wako, na fursa za mtaa wako.'
                  : 'Answer 22 questions about your strengths, lifestyle, capital band, and local neighborhood scarcities.' 
                }}
              </p>
            </div>

            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold font-serif font-bold text-lg flex items-center justify-center">
                2
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Pata uchambuzi maalum' : 'Get personalised insights' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Mfumo wetu unachambua Haiba yako ya kiasili, nguvu 15, mwelekeo wa hatari, na alama ya utayari.'
                  : 'Our engine computes your natural Archetype, 15 strengths, risk posture, and 5-pillar readiness score.' 
                }}
              </p>
            </div>

            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold font-serif font-bold text-lg flex items-center justify-center">
                3
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Chukua hatua madhubuti' : 'Take concrete action' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Pokea biashara 3 zinazokufaa zikiwa na bajeti za mtaji kwa KES na mpango kazi wa siku 30.'
                  : 'Receive your top 3 matched business models with startup budgets in KES and step-by-step 30-day action plans.' 
                }}
              </p>
            </div>

            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold font-serif font-bold text-lg flex items-center justify-center">
                4
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Jenga na kukuza' : 'Build and grow' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Fuatilia majukumu ya kila wiki, epuka mitego, fungua mafunzo na anza biashara kwa ujasiri.'
                  : 'Track checkable weekly tasks, review blind spots, unlock resources, and launch your business with confidence.' 
                }}
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- QUOTE CALLOUT STRIP -->
      <section class="bg-forest text-ivory py-16">
        <div class="max-w-4xl mx-auto px-4 text-center space-y-4">
          <p class="text-2xl sm:text-3xl font-serif italic text-gold leading-relaxed">
            {{ lang.isSwahili() 
              ? '"Kila mjasiriamali anastahili taarifa sahihi kwa wakati sahihi."'
              : '"Every entrepreneur deserves the right information at the right time."' 
            }}
          </p>
          <p class="text-sm text-ivory/60 uppercase tracking-widest font-semibold">— Compass Platform</p>
        </div>
      </section>

      <!-- EMAIL CAPTURE / COMMUNITY -->
      <section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
          {{ lang.isSwahili() ? 'Jiunge na jumuiya inayokua ya wajasiriamali wa Kiafrika.' : 'Join a growing community of African entrepreneurs.' }}
        </h3>
        <p class="text-charcoal/70 text-sm max-w-lg mx-auto">
          {{ lang.isSwahili() 
            ? 'Kuwa wa kwanza kupata miongozo mipya ya biashara, mchanganuo wa sekta na fursa zinazochipukia Afrika.'
            : 'Be the first to know about new business playbooks, local sector breakdowns, and emerging African enterprise opportunities.' 
          }}
        </p>

        <form (submit)="onSubscribe($event)" class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            [placeholder]="lang.isSwahili() ? 'Ingiza anwani yako ya barua pepe' : 'Enter your email address'"
            class="w-full px-4 py-3 rounded-button border border-forest-line/20 bg-white text-charcoal text-sm focus:outline-none focus:border-gold"
            required
          />
          <button
            type="submit"
            class="w-full sm:w-auto bg-gold hover:bg-gold-soft text-charcoal font-semibold text-sm px-6 py-3 rounded-button shadow transition-colors"
          >
            {{ subscribed ? (lang.isSwahili() ? 'Umejiunga!' : 'Subscribed!') : (lang.isSwahili() ? 'Jiunge Sasa' : 'Join Now') }}
          </button>
        </form>
      </section>

    </div>
  `
})
export class LandingPageComponent {
  lang = inject(LanguageService);
  subscribed = false;

  onSubscribe(event: Event) {
    event.preventDefault();
    this.subscribed = true;
  }
}
