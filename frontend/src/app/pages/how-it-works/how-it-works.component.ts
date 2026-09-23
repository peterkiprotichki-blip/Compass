import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory text-charcoal">

      <!-- ================= 1. HERO SECTION ================= -->
      <section class="relative bg-forest text-ivory overflow-hidden pt-16 pb-24 md:py-28 border-b border-forest-line">
        <!-- Background accents -->
        <div class="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none"></div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-forest-deep border border-forest-line text-xs font-semibold text-gold uppercase tracking-wider">
            <svg class="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{{ lang.isSwahili() ? 'Mbinu na Sayansi ya Compass' : 'Methodology & Engine Architecture' }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-ivory max-w-4xl mx-auto leading-[1.15]">
            {{ lang.isSwahili()
              ? 'Kutoka Mkanganyiko Hadi Biashara Halisi Yenye Faida.'
              : 'How Compass Works: From Uncertainty to a Thriving Business.'
            }}
          </h1>

          <p class="text-base sm:text-xl text-ivory/80 max-w-2xl mx-auto font-normal leading-relaxed">
            {{ lang.isSwahili()
              ? 'Compass haitoi orodha za kubahatisha. Mfumo wetu unachanganua nguvu zako za asili, mtaji wako halisi wa KES, na mtaa unaoishi ili kukuunganisha na biashara 3 zilizothibitishwa.'
              : 'Compass replaces generic lists with proprietary African market scoring. We evaluate your natural strengths, exact capital in KES, and local trade realities to match you with vetted business models.'
            }}
          </p>

          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              routerLink="/pathfinder"
              class="w-full sm:w-auto inline-flex items-center justify-center bg-gold hover:bg-gold-soft text-charcoal font-semibold text-sm sm:text-base px-8 py-4 rounded-button shadow-lg hover:shadow-gold-glow transition-all"
            >
              <span>{{ lang.t.btnStartMyBusiness }}</span>
              <svg class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>

            <a
              routerLink="/grow-business"
              class="w-full sm:w-auto inline-flex items-center justify-center bg-forest-deep hover:bg-forest-line border border-forest-line text-ivory font-semibold text-sm sm:text-base px-8 py-4 rounded-button transition-all"
            >
              <span>{{ lang.t.btnGrowMyBusiness }}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ================= 2. TWO CLEAR PATHWAYS ================= -->
      <section class="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <span class="text-xs font-bold text-gold uppercase tracking-widest">
            {{ lang.isSwahili() ? 'Njia Mbili Tofauti' : 'Two Tailored Journeys' }}
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Imeundwa Kulingana na Hatua Yako Sasa' : 'Engineered for Where You Stand Today' }}
          </h2>
          <p class="text-charcoal/70 text-sm sm:text-base">
            {{ lang.isSwahili()
              ? 'Iwe bado unafikiria biashara ya kuanzisha au tayari una duka au huduma inayofanya kazi, chagua njia inayokufaa.'
              : 'Whether exploring your first venture or already managing daily inventory and cash flow, Compass has a dedicated system.'
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Track 1: Pathfinder -->
          <div class="bg-white rounded-sheet p-8 border border-forest-line/20 shadow-light-md flex flex-col justify-between space-y-6 group hover:border-gold transition-all">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                  <polygon points="12 7 16.5 16.5 7.5 16.5" fill="currentColor" opacity="0.8" />
                </svg>
              </div>

              <div>
                <span class="text-xs font-bold text-gold uppercase tracking-wider">Journey 1</span>
                <h3 class="text-2xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors mt-0.5">
                  Business Pathfinder
                </h3>
              </div>

              <p class="text-xs text-charcoal/80 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Kwa watu wanaotaka kuanzisha biashara lakini hawajui ipi inawafaa zaidi, wana mtaji na hawajui jinsi ya kuutumia bila kupata hasara, au wanataka kuthibitisha wazo lao kwanza.'
                  : 'For prospective founders deciding what to launch, entrepreneurs with capital seeking optimal allocation, and career changers assessing business readiness.'
                }}
              </p>

              <div class="pt-2 border-t border-forest-line/10 space-y-2 text-xs text-charcoal/80">
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Tathmini ya maswali 22 ya nguvu, mtaji, na mazingira' : '22-question assessment of strengths, capital, and trade context' }}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Ugunduzi wa Haiba Yako ya Kiuasiriamali na Alama ya Utayari' : 'Entrepreneur Archetype discovery & 100-point Readiness Score' }}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Biashara 3 bora zilizolingana na mpango kazi wa siku 30' : 'Top 3 matched Kenyan models with weekly launch roadmaps' }}</span>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <a
                routerLink="/pathfinder"
                class="w-full flex items-center justify-between bg-gold hover:bg-gold-soft text-charcoal font-semibold text-xs py-3.5 px-5 rounded-button shadow transition-all"
              >
                <span>{{ lang.isSwahili() ? 'Anza Tathmini ya Pathfinder' : 'Start Business Pathfinder' }}</span>
                <span class="w-6 h-6 rounded-full bg-charcoal text-ivory flex items-center justify-center text-xs">→</span>
              </a>
            </div>
          </div>

          <!-- Track 2: Grow My Business -->
          <div class="bg-white rounded-sheet p-8 border border-forest-line/20 shadow-light-md flex flex-col justify-between space-y-6 group hover:border-forest transition-all">
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center shadow-sm">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>

              <div>
                <span class="text-xs font-bold text-forest uppercase tracking-wider">Journey 2</span>
                <h3 class="text-2xl font-serif font-bold text-charcoal group-hover:text-forest transition-colors mt-0.5">
                  Business Compass (Grow My Business)
                </h3>
              </div>

              <p class="text-xs text-charcoal/80 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Kwa wafanyabiashara ambao tayari wanafanya biashara: duka, huduma, genge, duka la dawa n.k. Inasaidia kurekodi mauzo ya kila siku, kutambua upotevu wa fedha, na kupata mwongozo wa mshahara.'
                  : 'For active traders and shop owners: kiosks, chemists, salons, hardware, and service businesses. Records daily sales & expenses, tracks unit margins, and prevents cash leakage.'
                }}
              </p>

              <div class="pt-2 border-t border-forest-line/10 space-y-2 text-xs text-charcoal/80">
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Kurekodi kwa haraka mauzo na matumizi ya kila siku' : 'Fast daily sales & operational expense logging' }}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Kupunguza mzigo dukani kiotomatiki na kuzuia kutofautiana kwa mauzo' : 'Automatic stock decrements & itemized mismatch detection' }}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ lang.isSwahili() ? 'Muhtasari wa fedha na ripoti ya kina ya KSh 499 (M-Pesa)' : 'Live business snapshot & KSh 499 Pro 30-day tactical blueprint' }}</span>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <a
                routerLink="/grow-business"
                class="w-full flex items-center justify-between bg-forest hover:bg-forest-deep text-ivory font-semibold text-xs py-3.5 px-5 rounded-button shadow transition-all"
              >
                <span>{{ lang.isSwahili() ? 'Fungua Mfumo wa Kukuza Biashara' : 'Launch Growth Diagnostic' }}</span>
                <span class="w-6 h-6 rounded-full bg-gold text-charcoal flex items-center justify-center text-xs">→</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <!-- ================= 3. THE 5 EVALUATION ENGINES ================= -->
      <section class="py-20 bg-ivory-sunk border-y border-forest-line/15">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <span class="text-xs font-bold text-gold uppercase tracking-widest">
              {{ lang.isSwahili() ? 'Mifumo ya Uchambuzi' : 'Under The Hood' }}
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
              {{ lang.isSwahili() ? 'Mifumo 5 Inayofanya Kazi Nyuma ya Compass' : 'The 5 Evaluation Engines Powering Your Results' }}
            </h2>
            <p class="text-charcoal/70 text-sm sm:text-base">
              {{ lang.isSwahili()
                ? 'Unapojibu maswali 22, taarifa zako hupimwa kwa kutumia vigezo vitano vya kisayansi vilivyotengenezwa kwa ajili ya mazingira ya Afrika.'
                : 'Every response is processed by five interconnected algorithmic engines calibrated specifically for Kenyan market dynamics.'
              }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Engine 1 -->
            <div class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 class="font-serif font-bold text-base text-charcoal">
                1. {{ lang.isSwahili() ? 'Mfumo wa Nguvu 15 za Kiasili' : '15-Strength Normalization' }}
              </h4>
              <p class="text-xs text-charcoal/75 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Inapima nguvu 15 muhimu kama vile Mauzo, Majadiliano, Uvumilivu, Nidhamu ya Fedha, Usimamizi na Utatuzi wa Matatizo na kuzipanga kwenye mizani ya 0–100.'
                  : 'Scores 15 entrepreneurial competencies (Selling, Negotiation, Resilience, Financial Literacy, Hustle) normalized against theoretical maximums.'
                }}
              </p>
            </div>

            <!-- Engine 2 -->
            <div class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 class="font-serif font-bold text-base text-charcoal">
                2. {{ lang.isSwahili() ? 'Haiba 6 za Kiuasiriamali' : '6 Entrepreneur Archetypes' }}
              </h4>
              <p class="text-xs text-charcoal/75 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Inakugundua kama Muuzaji (The Seller), Mjenzi (The Builder), Mbunifu (The Creator), Mwalimu (The Teacher), Mwendeshaji (The Operator), au Mtatuzi wa Matatizo.'
                  : 'Categorizes you into your primary and secondary operational archetype (Seller, Builder, Creator, Teacher, Operator, Problem Solver) with custom behavioral modifiers.'
                }}
              </p>
            </div>

            <!-- Engine 3 -->
            <div class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 class="font-serif font-bold text-base text-charcoal">
                3. {{ lang.isSwahili() ? 'Tathmini ya Mwelekeo wa Hatari' : 'Risk Posture Profile' }}
              </h4>
              <p class="text-xs text-charcoal/75 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Hupima iwapo unapaswa kuanza na biashara yenye mtiririko wa haraka wa pesa usio na hatari kubwa (Conservative), ya wastani (Moderate), au yenye ukuaji wa juu (Aggressive).'
                  : 'Calculates your risk appetite to protect capital from premature exposure, recommending fast-turnaround vs long-gestation models.'
                }}
              </p>
            </div>

            <!-- Engine 4 -->
            <div class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-3">
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 class="font-serif font-bold text-base text-charcoal">
                4. {{ lang.isSwahili() ? 'Alama ya Utayari wa Kuanza (Pillars 5)' : '5-Pillar Readiness Score' }}
              </h4>
              <p class="text-xs text-charcoal/75 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Inapima nguzo 5 muhimu: Mtaji uliopo, Masaa ya kufanya kazi kila wiki, Uwazi wa malengo, Utambuzi wa fursa mtaani, na Ulinganifu wa nguvu zako.'
                  : 'Calculates an actionable 100-point score across 5 essential pillars: Capital, Weekly Commitment, Goal Clarity, Market Scarcity, and Strengths Alignment.'
                }}
              </p>
            </div>

            <!-- Engine 5 -->
            <div class="bg-white p-6 rounded-card border border-forest-line/15 shadow-light-sm space-y-3 md:col-span-2">
              <div class="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 class="font-serif font-bold text-base text-charcoal">
                5. {{ lang.isSwahili() ? 'Mfumo wa Kulinganisha Biashara 30+ Halisi za Kenya' : '30+ African Business Matching Model' }}
              </h4>
              <p class="text-xs text-charcoal/75 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Badala ya mifano ya nchi za mbali, Compass inalinganisha maelezo yako na orodha ya mifumo 30+ halisi inayofanya kazi Nairobi, Kisumu, Nakuru, Eldoret na Mombasa ikiwa na mchanganuo halisi wa mtaji kwa KES, faida, na fursa za mtaa wako.'
                  : 'Scores your profile against 30+ vetted enterprise models tailored for Nairobi, Mombasa, Kisumu, Nakuru, Eldoret and local counties. Incorporates exact starting capital bands in KES, margin structures, and real local neighborhood requirements.'
                }}
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ================= 4. WHAT YOU WALK AWAY WITH ================= -->
      <section class="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <span class="text-xs font-bold text-gold uppercase tracking-widest">
            {{ lang.isSwahili() ? 'Matokeo na Manufaa' : 'Tangible Deliverables' }}
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Kile Unachopokea Baada ya Tathmini' : 'What You Walk Away With' }}
          </h2>
          <p class="text-charcoal/70 text-sm sm:text-base">
            {{ lang.isSwahili()
              ? 'Ripoti ya Compass sio nadharia tu. Ni mwongozo kamili wa kiutendaji wenye hatua halisi unazoweza kuanza kutekeleza leo.'
              : 'Your personalized report is not high-level inspiration. It is a tactical launch kit with concrete figures and dates.'
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="bg-white rounded-sheet p-6 border border-forest-line/15 shadow-light-sm space-y-4">
            <div class="w-10 h-10 rounded-full bg-gold/20 text-forest font-bold flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-serif font-bold text-lg text-charcoal">
              {{ lang.isSwahili() ? 'Biashara 3 Bora na Bajeti ya KES' : 'Top 3 Businesses with KES Budget' }}
            </h3>
            <p class="text-xs text-charcoal/80 leading-relaxed">
              {{ lang.isSwahili()
                ? 'Mchanganuo kamili wa gharama za kuanzia: bidhaa za kwanza, kodi, leseni na vibali vya kaunti, na akiba ya dharura ili kuzuia kukwama kabla ya kuanza.'
                : 'Exact startup capital breakdown in Kenyan Shillings: inventory, rent buffer, county permits, and initial reserve cash.'
              }}
            </p>
          </div>

          <div class="bg-white rounded-sheet p-6 border border-forest-line/15 shadow-light-sm space-y-4">
            <div class="w-10 h-10 rounded-full bg-gold/20 text-forest font-bold flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 class="font-serif font-bold text-lg text-charcoal">
              {{ lang.isSwahili() ? 'Mpango Kazi wa Siku 30' : '30-Day Tactical Launch Roadmap' }}
            </h3>
            <p class="text-xs text-charcoal/80 leading-relaxed">
              {{ lang.isSwahili()
                ? 'Majukumu 4 ya kila wiki yanayoweza kuwekwa tiki: Wiki 1: Utafiti na Wauzaji, Wiki 2: Usajili na Sehemu, Wiki 3: Bidhaa na Masoko, Wiki 4: Kufungua Rasmi na Wateja 10 wa Kwanza.'
                : 'Four progressive weekly checklists: Week 1: Supplier Scouting, Week 2: Permits & Location, Week 3: Stocking & Pricing, Week 4: First 10 Paying Customers.'
              }}
            </p>
          </div>

          <div class="bg-white rounded-sheet p-6 border border-forest-line/15 shadow-light-sm space-y-4">
            <div class="w-10 h-10 rounded-full bg-gold/20 text-forest font-bold flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="font-serif font-bold text-lg text-charcoal">
              {{ lang.isSwahili() ? 'Ushauri wa Kimkakati wa Gemini AI' : 'Gemini AI Strategic Advisory' }}
            </h3>
            <p class="text-xs text-charcoal/80 leading-relaxed">
              {{ lang.isSwahili()
                ? 'Mawazo maalum ya ushindani wa soko la Afrika, ulinzi wa mtaji (Risk Shield), na uwezo wa kuuliza maswali kupitia gumzo la moja kwa moja la kijasusi.'
                : 'Custom local market competitive moat, capital protection mechanisms, and an interactive conversational advisor tailored to your exact location.'
              }}
            </p>
          </div>

        </div>
      </section>

      <!-- ================= 5. STEP-BY-STEP USER JOURNEY ================= -->
      <section class="py-20 bg-forest text-ivory border-y border-forest-line relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div class="text-center max-w-3xl mx-auto space-y-3">
            <span class="text-xs font-bold text-gold uppercase tracking-widest">
              {{ lang.isSwahili() ? 'Mlolongo wa Hatua' : 'The Experience' }}
            </span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-ivory">
              {{ lang.isSwahili() ? 'Jinsi Safari Yako Inavyoanza' : 'How Your Journey Unfolds' }}
            </h2>
            <p class="text-ivory/70 text-sm sm:text-base">
              {{ lang.isSwahili()
                ? 'Dakika chache pekee zinaweza kukuokoa miezi mingi ya kupoteza mtaji au kujaribu biashara isiyokufaa.'
                : 'A few structured minutes will save you months of trial-and-error and preventable capital loss.'
              }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div class="bg-forest-deep p-6 rounded-card border border-forest-line space-y-3">
              <div class="w-8 h-8 rounded-full bg-gold text-charcoal font-serif font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h4 class="font-serif font-bold text-base text-ivory">
                {{ lang.isSwahili() ? 'Tengeneza Wasifu Kwanza' : 'Create Profile Upfront' }}
              </h4>
              <p class="text-xs text-ivory/70 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Weka jina lako na barua pepe au ingia kwa mbofyo mmoja wa Google ili maendeleo yako na majibu yako yahifadhiwe salama.'
                  : 'Enter your name and contact details or sign in with 1-click Google to keep your assessment secure across all devices.'
                }}
              </p>
            </div>

            <div class="bg-forest-deep p-6 rounded-card border border-forest-line space-y-3">
              <div class="w-8 h-8 rounded-full bg-gold text-charcoal font-serif font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h4 class="font-serif font-bold text-base text-ivory">
                {{ lang.isSwahili() ? 'Jibu Maswali 22' : 'Answer 22 Questions' }}
              </h4>
              <p class="text-xs text-ivory/70 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Hakuna majibu sahihi au makosa. Unaeleza hali yako halisi ya mtaji, muda, uwezo na mazingira ya mtaa wako.'
                  : 'Practical, scenario-based multiple choices. No trick questions — simply your honest operational realities.'
                }}
              </p>
            </div>

            <div class="bg-forest-deep p-6 rounded-card border border-forest-line space-y-3">
              <div class="w-8 h-8 rounded-full bg-gold text-charcoal font-serif font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h4 class="font-serif font-bold text-base text-ivory">
                {{ lang.isSwahili() ? 'Uchambuzi wa Papo Hapo' : 'Instant Computation' }}
              </h4>
              <p class="text-xs text-ivory/70 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Mifumo 5 inapiga hesabu ya nguvu zako, haiba yako, alama ya utayari, na kulinganisha na mifumo 30+ ya biashara.'
                  : 'Calculates your readiness pillars and scores matches against verified Kenyan startup databases.'
                }}
              </p>
            </div>

            <div class="bg-forest-deep p-6 rounded-card border border-forest-line space-y-3">
              <div class="w-8 h-8 rounded-full bg-gold text-charcoal font-serif font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h4 class="font-serif font-bold text-base text-ivory">
                {{ lang.isSwahili() ? 'Utekelezaji wa Siku 30' : '30-Day Execution' }}
              </h4>
              <p class="text-xs text-ivory/70 leading-relaxed">
                {{ lang.isSwahili()
                  ? 'Anza kutekeleza majukumu ya kila wiki moja baada ya nyingine ukiwa na uhakika na dira ya wazi.'
                  : 'Follow week-by-week checkpoints to secure suppliers, test pricing, and capture your first customer.'
                }}
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- ================= 6. FREQUENTLY ASKED QUESTIONS ================= -->
      <section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="text-center space-y-2">
          <span class="text-xs font-bold text-gold uppercase tracking-widest">FAQ</span>
          <h2 class="text-3xl font-serif font-bold text-charcoal">
            {{ lang.isSwahili() ? 'Maswali Yanayoulizwa Mara kwa Mara' : 'Frequently Asked Questions' }}
          </h2>
        </div>

        <div class="space-y-4">
          
          <div class="bg-white p-5 rounded-card border border-forest-line/15 space-y-2">
            <h4 class="font-serif font-bold text-base text-forest">
              {{ lang.isSwahili() ? 'Je, tathmini ya kwanza ni ya bure au inalipishwa?' : 'Is the assessment free or paid?' }}
            </h4>
            <p class="text-xs text-charcoal/80 leading-relaxed">
              {{ lang.isSwahili()
                ? 'Tathmini ya kwanza ni ya bure kabisa (Free Explorer). Unaweza kugundua Haiba Yako ya Kiuasiriamali, Nguvu zako kuu 5, na Alama yako ya Utayari (kati ya 100). Iwapo unataka kufungua biashara 3 zilizolingana, bajeti kamili ya mtaji, na mpango kazi wa siku 30, ada ya mara moja tu ya KSh 499 inatozwa kupitia M-Pesa.'
                : 'The full 22-question assessment is 100% free to explore. You discover your Entrepreneur Archetype, top 5 strengths, and 100-point Readiness Score. Unlocking full business matches, exact KES budgets, and the 30-Day launch plan is a simple one-time payment of KSh 499 via M-Pesa.'
              }}
            </p>
          </div>

          <div class="bg-white p-5 rounded-card border border-forest-line/15 space-y-2">
            <h4 class="font-serif font-bold text-base text-forest">
              {{ lang.isSwahili() ? 'Je, ninaweza kuitumia nikiwa na mtaji mdogo sana (mfano KSh 10,000 - 30,000)?' : 'Can I use Compass with low starting capital (e.g. KSh 10,000 - 30,000)?' }}
            </h4>
            <p class="text-xs text-charcoal/80 leading-relaxed">
              {{ lang.isSwahili()
                ? 'Ndiyo kabisa. Hiyo ndiyo sababu kuu Compass ilijengwa. Mifumo yetu inajumuisha biashara za mitaji midogo sana inayozunguka haraka (kama vile mitumba maalum, marashi na urembo, vibanda vya huduma) ili kuhakikisha hupati mapendekezo yasiyo na uhalisia.'
                : 'Absolutely. That is why Compass was built for the African market. Our database includes high-turnover, lean-capital business models (e.g. curated thrift, fragrance decanting, specialized snacks, agency services) that do not require hefty bank loans.'
              }}
            </p>
          </div>

          <div class="bg-white p-5 rounded-card border border-forest-line/15 space-y-2">
            <h4 class="font-serif font-bold text-base text-forest">
              {{ lang.isSwahili() ? 'Je, inafaa kwa mtu ambaye tayari ana duka au biashara inayofanya kazi?' : 'Is Compass suitable if I already have an active business?' }}
            </h4>
            <p class="text-xs text-charcoal/80 leading-relaxed">
              {{ lang.isSwahili()
                ? 'Ndiyo! Unaweza kuchagua safari ya "Grow My Business". Hukuruhusu kurekodi mauzo na matumizi ya kila siku, kufuatilia faida halisi ya makadirio, na kufahamu ni kiasi gani unachoweza kujilipa kama mshahara bila kuathiri mtaji.'
                : 'Yes! Select the "Grow My Business" journey. It provides daily sales and expense tracking, unit margin calculations, a live business health snapshot, and guidance on sustainable owner pay.'
              }}
            </p>
          </div>

        </div>
      </section>

      <!-- ================= 7. BOTTOM CALL TO ACTION ================= -->
      <section class="py-16 bg-forest-deep text-ivory border-t border-forest-line text-center space-y-6">
        <div class="max-w-2xl mx-auto px-4 space-y-3">
          <h2 class="text-3xl font-serif font-bold text-ivory">
            {{ lang.isSwahili() ? 'Uko Tayari Kugundua Dira Yako?' : 'Ready to Discover Your Optimal Path?' }}
          </h2>
          <p class="text-xs sm:text-sm text-ivory/80 leading-relaxed">
            {{ lang.isSwahili()
              ? 'Chukua dakika 3 leo ili kupata mwelekeo wa uhakika na zana thabiti za kiutendaji.'
              : 'Take 3 minutes today to lock in your business direction and receive an execution-ready plan.'
            }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            routerLink="/pathfinder"
            class="w-full sm:w-auto bg-gold hover:bg-gold-soft text-charcoal font-bold text-sm px-8 py-4 rounded-button shadow-light-lg transition-all"
          >
            {{ lang.t.btnStartMyBusiness }} →
          </a>
          <a
            routerLink="/grow-business"
            class="w-full sm:w-auto bg-forest hover:bg-forest-line border border-forest-line text-ivory font-bold text-sm px-8 py-4 rounded-button transition-all"
          >
            {{ lang.t.btnGrowMyBusiness }} →
          </a>
        </div>
      </section>

    </div>
  `
})
export class HowItWorksComponent {
  lang = inject(LanguageService);
}
