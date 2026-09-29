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
      
      <!-- HERO SECTION (Deep Forest full-bleed with African dawn landscape & gold accents) -->
      <section class="relative bg-forest text-ivory overflow-hidden pt-12 pb-24 md:py-28 border-b border-forest-line">
        
        <!-- Cinematic African Dawn Landscape Background -->
        <div class="absolute inset-0 z-0">
          <img
            src="brand/hero-landscape.jpg"
            alt="African Highlands at Dawn"
            class="w-full h-full object-cover object-center opacity-50 transform scale-105 transition-transform duration-1000 ease-out"
          />
          <!-- Deep Forest left fade for perfect headline readability and sunrise glow on right -->
          <div class="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest-deep/45"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-forest-deep/75"></div>
          <!-- Ambient Gold Glow in Top Right Horizon -->
          <div class="absolute -top-24 right-0 w-[550px] h-[550px] rounded-full bg-gold/25 blur-[120px] pointer-events-none"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Text Column -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Overline Badge -->
              <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-pill bg-forest-deep/90 border border-gold/30 text-xs font-semibold text-gold-soft uppercase tracking-wider backdrop-blur-md shadow-sm">
                <span class="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span>{{ lang.isSwahili() ? 'Kwa Wajasiriamali wa Afrika' : 'For African Entrepreneurs · At Every Stage' }}</span>
              </div>

              <!-- Main Display Headline in Playfair Display -->
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-ivory leading-[1.12]">
                {{ lang.isSwahili() ? 'Njia bora zaidi ya kujenga mustakabali wako.' : 'A smarter way to build your future.' }}
              </h1>

              <!-- Subtitle -->
              <p class="text-lg sm:text-xl text-ivory/85 max-w-2xl font-normal leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Compass huwasaidia wajasiriamali wa Afrika kugundua, kuanzisha na kukuza biashara zenye faida kupitia mwongozo maalum, tathmini ya nguvu na hatua za kiutendaji.'
                  : 'Compass turns a person’s strengths, capital, location, time and goals into a clear business direction and a practical set of next steps.' 
                }}
              </p>

              <!-- Campaign signature in Playfair italic -->
              <div class="pt-1">
                <span class="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-soft text-2xl sm:text-3xl font-normal tracking-wide drop-shadow-sm">
                  Ideas to Impact.
                </span>
              </div>

              <!-- CTA Buttons -->
              <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  routerLink="/pathfinder"
                  class="btn-gold-luxury inline-flex items-center justify-center text-base px-8 py-4 rounded-button hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>{{ lang.t.btnStartMyBusiness }}</span>
                  <svg class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>

                <a
                  routerLink="/grow-business"
                  class="inline-flex items-center justify-center bg-forest-deep/70 hover:bg-forest-line/70 border border-gold/40 hover:border-gold text-ivory hover:text-gold-soft font-semibold text-base px-8 py-4 rounded-button backdrop-blur-md transition-all duration-300"
                >
                  <span>{{ lang.t.btnGrowMyBusiness }}</span>
                </a>
              </div>

            </div>

            <!-- Right Hero Card / Compass Visual -->
            <div class="lg:col-span-5 flex justify-center">
              <div class="relative w-full max-w-md bg-forest-deep/85 border border-gold/25 rounded-sheet p-8 shadow-forest-card backdrop-blur-md">
                
                <div class="flex items-center justify-between border-b border-forest-line pb-4 mb-6">
                  <div class="flex items-center gap-3">
                    <img src="brand/compass-mark.png" alt="Compass Mark" class="w-10 h-10 animate-spin-slow">
                    <div>
                      <h4 class="font-serif font-bold text-ivory text-base">
                        {{ lang.isSwahili() ? 'Dira ya Biashara' : 'Business Pathfinder' }}
                      </h4>
                      <p class="text-xs text-gold-soft">
                        {{ lang.isSwahili() ? 'Maswali 22 · Nguvu 15' : '22 Questions · 15 Strengths' }}
                      </p>
                    </div>
                  </div>
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-pill bg-gold/15 text-gold-soft border border-gold/40 shadow-sm">
                    KES 499
                  </span>
                </div>

                <!-- Preview Metric -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between bg-forest/80 p-4 rounded-card border border-gold/15">
                    <div>
                      <span class="text-xs text-ivory/60 uppercase font-semibold tracking-wider">
                        {{ lang.isSwahili() ? 'Mfano wa Haiba' : 'Example Archetype' }}
                      </span>
                      <p class="font-serif font-bold text-lg text-ivory">
                        {{ lang.isSwahili() ? 'Muuzaji Hodari' : 'The Seller' }}
                      </p>
                      <p class="text-xs text-gold-soft mt-0.5">
                        {{ lang.isSwahili() ? 'Mauzo · Mawasiliano · Mtandao' : 'Sales · Communication · Network' }}
                      </p>
                    </div>
                    <app-score-ring [score]="94" [size]="75" [strokeWidth]="7" textColorClass="text-ivory"></app-score-ring>
                  </div>

                  <div class="p-3.5 bg-forest-darker/60 rounded-card text-xs text-ivory/80 space-y-1.5 border border-forest-line/50">
                    <p class="font-semibold text-gold-soft">
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
                    class="btn-gold-luxury w-full flex items-center justify-center text-sm py-3.5 rounded-button hover:shadow-gold-glow transition-all"
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
      <section class="bg-forest-darker border-b border-forest-line text-ivory py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div class="p-3">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-soft">KE</p>
              <p class="text-xs sm:text-sm text-ivory/75 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Imejengwa kwa Wakenya' : 'Built for Kenyan Founders' }}
              </p>
            </div>

            <div class="p-3 border-l border-forest-line/50">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-soft">100+</p>
              <p class="text-xs sm:text-sm text-ivory/75 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Mifumo ya Biashara za Kiafrika' : 'African Business Models' }}
              </p>
            </div>

            <div class="p-3 border-l border-forest-line/50">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-soft">2</p>
              <p class="text-xs sm:text-sm text-ivory/75 mt-1 uppercase tracking-wider font-semibold">
                {{ lang.isSwahili() ? 'Lugha (Kiingereza | Kiswahili)' : 'Languages (EN | SW)' }}
              </p>
            </div>

            <div class="p-3 border-l border-forest-line/50">
              <p class="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-soft">1 Goal</p>
              <p class="text-xs sm:text-sm text-ivory/75 mt-1 uppercase tracking-wider font-semibold">
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
              <span class="w-2 h-2 rounded-full bg-gold"></span>
              <span>{{ lang.isSwahili() ? 'Mwongozo wa Kibinafsi' : 'Personalised Guidance' }}</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gold"></span>
              <span>{{ lang.isSwahili() ? 'Fursa za Kienyeji' : 'Local Opportunities' }}</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gold"></span>
              <span>{{ lang.isSwahili() ? 'Hatua za Kiutendaji' : 'Practical Next Steps' }}</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gold"></span>
              <span>{{ lang.isSwahili() ? 'Imejengwa kwa Watu Halisi' : 'Built for Real People' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- WHAT ARE YOU TRYING TO DO? JOURNEY CARDS -->
      <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Je, unajaribu kufanya nini leo?' : 'What are you trying to do?' }}
          </h2>
          <p class="text-charcoal/70 text-base sm:text-lg mt-3 leading-relaxed">
            {{ lang.isSwahili() 
              ? 'Iwe ndio unaanza safari yako au tayari una biashara inayofanya kazi, Compass inakupa mwelekeo wa wazi na zana za kusonga mbele.'
              : 'Whether you are just getting started or already in business, Compass gives you the clarity and tools to move forward.' 
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
          
          <!-- Card 1: Start My Business (Pathfinder) -->
          <div class="lg:col-span-5 bg-white rounded-sheet p-8 border border-forest-line/15 shadow-light-lg hover:border-gold/60 transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-full bg-forest text-gold-soft flex items-center justify-center shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors">
                {{ lang.t.btnStartMyBusiness }}
              </h3>
              <p class="text-charcoal/70 text-sm leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Gundua biashara inayokufaa kulingana na nguvu zako, rasilimali na mazingira yako.'
                  : 'Discover the best business ideas for you based on your strengths, resources and your environment.' 
                }}
              </p>
              <div class="space-y-2 pt-2 text-xs font-semibold text-charcoal/80">
                <p class="flex items-center gap-2"><span class="text-forest font-bold">✓</span> {{ lang.isSwahili() ? 'Inagundua Haiba Yako ya Kiuasiriamali' : 'Discovers your Entrepreneur Archetype' }}</p>
                <p class="flex items-center gap-2"><span class="text-forest font-bold">✓</span> {{ lang.isSwahili() ? 'Inapiga hesabu ya Utayari wa Kuanza kati ya 100' : 'Computes your 100-point Business Readiness Score' }}</p>
                <p class="flex items-center gap-2"><span class="text-forest font-bold">✓</span> {{ lang.isSwahili() ? 'Biashara 3 bora zenye mpango kazi wa siku 30' : 'Top 3 Matched businesses with 30-day action plans' }}</p>
              </div>
            </div>

            <div class="pt-8">
              <a
                routerLink="/pathfinder"
                class="btn-gold-luxury w-full flex items-center justify-between text-sm px-6 py-3.5 rounded-button transition-all"
              >
                <span>{{ lang.isSwahili() ? 'Anza Safari ya Pathfinder' : 'Launch Business Pathfinder' }}</span>
                <span class="w-8 h-8 rounded-full bg-charcoal text-ivory flex items-center justify-center font-bold">→</span>
              </a>
            </div>
          </div>

          <!-- Card 2: Grow My Business (Business Compass) -->
          <div class="lg:col-span-4 bg-white rounded-sheet p-8 border border-forest-line/15 shadow-light-lg hover:border-forest transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-full bg-forest text-gold-soft flex items-center justify-center shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors">
                {{ lang.t.btnGrowMyBusiness }}
              </h3>
              <p class="text-charcoal/70 text-sm leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Pokea uchambuzi maalum na mapendekezo ya kukuza na kuimarisha biashara yako.'
                  : 'Get personalised insights and recommendations to help you improve and grow.' 
                }}
              </p>
              <div class="space-y-2 pt-2 text-xs font-semibold text-charcoal/80">
                <p class="flex items-center gap-2"><span class="text-forest font-bold">✓</span> {{ lang.isSwahili() ? 'Uchambuzi wa mtiririko wa fedha' : 'Cash flow and pricing diagnostics' }}</p>
                <p class="flex items-center gap-2"><span class="text-forest font-bold">✓</span> {{ lang.isSwahili() ? 'Miongozo ya kuvutia wateja' : 'Customer acquisition playbooks' }}</p>
                <p class="flex items-center gap-2"><span class="text-forest font-bold">✓</span> {{ lang.isSwahili() ? 'Uboreshaji wa mtaji' : 'Working capital optimization' }}</p>
              </div>
            </div>

            <div class="pt-8">
              <a
                routerLink="/grow-business"
                class="w-full flex items-center justify-between bg-forest hover:bg-forest-deep text-ivory font-semibold text-sm px-6 py-3.5 rounded-button shadow transition-all border border-forest-line"
              >
                <span>{{ lang.isSwahili() ? 'Fanya Tathmini ya Biashara' : 'Diagnose My Business' }}</span>
                <span class="w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center font-bold">→</span>
              </a>
            </div>
          </div>

          <!-- Highlight Quote Box as seen on Brand Board Panel 2 -->
          <div class="lg:col-span-3 bg-ivory-sunk/80 border-l-4 border-gold rounded-r-sheet p-8 flex flex-col justify-center shadow-light-sm">
            <span class="text-gold font-serif text-5xl leading-none select-none">“</span>
            <p class="font-serif italic text-xl text-charcoal leading-snug -mt-3">
              {{ lang.isSwahili() ? 'Taarifa bora hujenga biashara zenye nguvu.' : 'Better information builds stronger businesses.' }}
            </p>
            <p class="text-xs uppercase tracking-widest text-charcoal/50 font-semibold mt-4">
              — Compass Platform
            </p>
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
              {{ lang.isSwahili() ? 'Njia rahisi na thabiti kutoka kwenye mkanganyiko hadi kwenye utekelezaji.' : 'A simple, powerful process from insight to action.' }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3 hover:border-gold/40 transition-colors">
              <div class="w-10 h-10 rounded-full bg-forest text-gold-soft font-serif font-bold text-lg flex items-center justify-center shadow-sm">
                1
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Tueleze kukuhusu' : 'Tell us about you' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Jibu maswali machache kuhusu malengo yako, nguvu na rasilimali zako.'
                  : 'Answer a few questions about your goals, strengths and resources.' 
                }}
              </p>
            </div>

            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3 hover:border-gold/40 transition-colors">
              <div class="w-10 h-10 rounded-full bg-forest text-gold-soft font-serif font-bold text-lg flex items-center justify-center shadow-sm">
                2
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Pata uchambuzi maalum' : 'Get personalised insights' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Gundua haiba yako, alama ya utayari na biashara zinazolingana nawe.'
                  : 'Discover your archetype, readiness score and top business matches.' 
                }}
              </p>
            </div>

            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3 hover:border-gold/40 transition-colors">
              <div class="w-10 h-10 rounded-full bg-forest text-gold-soft font-serif font-bold text-lg flex items-center justify-center shadow-sm">
                3
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Chukua hatua madhubuti' : 'Take action' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Pata mpango wazi wenye hatua halisi na rasilimali zinazohitajika.'
                  : 'Get a clear plan with practical next steps and resources.' 
                }}
              </p>
            </div>

            <div class="bg-white rounded-card p-6 border border-forest-line/10 shadow-light-sm space-y-3 hover:border-gold/40 transition-colors">
              <div class="w-10 h-10 rounded-full bg-forest text-gold-soft font-serif font-bold text-lg flex items-center justify-center shadow-sm">
                4
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal">
                {{ lang.isSwahili() ? 'Jenga na kukuza' : 'Build and grow' }}
              </h4>
              <p class="text-xs text-charcoal/70 leading-relaxed">
                {{ lang.isSwahili() 
                  ? 'Tumia Compass mara kwa mara kufuatilia maendeleo na kufungua fursa mpya.'
                  : 'Use Compass regularly to track progress and unlock new opportunities.' 
                }}
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- QUOTE CALLOUT STRIP -->
      <section class="bg-forest text-ivory py-16 border-y border-forest-line">
        <div class="max-w-4xl mx-auto px-4 text-center space-y-4">
          <p class="text-2xl sm:text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-soft leading-relaxed">
            {{ lang.isSwahili() 
              ? '"Kila mjasiriamali anastahili taarifa sahihi kwa wakati sahihi."'
              : '"Every entrepreneur deserves the right information at the right time."' 
            }}
          </p>
          <p class="text-xs text-ivory/60 uppercase tracking-widest font-semibold">— Compass Platform</p>
        </div>
      </section>

      <!-- EMAIL CAPTURE / COMMUNITY -->
      <section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
          {{ lang.isSwahili() ? 'Jiunge na jumuiya inayokua ya wajasiriamali wa Kiafrika.' : 'Join a growing community of African entrepreneurs.' }}
        </h3>
        <p class="text-charcoal/70 text-sm max-w-lg mx-auto">
          {{ lang.isSwahili() 
            ? 'Kuwa wa kwanza kupata taarifa za vipengele vipya, rasilimali na fursa.'
            : 'Be the first to know about new features, resources and opportunities.' 
          }}
        </p>

        <form (submit)="onSubscribe($event)" class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            [placeholder]="lang.isSwahili() ? 'Ingiza barua pepe yako' : 'Enter your email'"
            class="w-full px-4 py-3 rounded-button border border-forest-line/20 bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
            required
          />
          <button
            type="submit"
            class="btn-gold-luxury w-full sm:w-auto text-sm px-7 py-3 rounded-button transition-all flex-shrink-0"
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
