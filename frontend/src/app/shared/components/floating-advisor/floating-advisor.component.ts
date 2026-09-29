import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter, Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { AssessmentResult, Journey } from '../../../models/compass.models';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-floating-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Floating Trigger Beacon (Bottom Right) -->
    <div *ngIf="shouldShowFloatingBeacon" class="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto">
      
      <!-- Proactive contextual bubble hint (if not open and not dismissed) -->
      <div
        *ngIf="!isOpen && showProactiveHint && proactiveMessage"
        class="mb-3 max-w-xs bg-forest text-ivory text-xs p-3 rounded-card border border-gold/40 shadow-2xl relative animate-fadeIn transition-all cursor-pointer hover:border-gold"
        (click)="openAdvisor()"
      >
        <button
          (click)="dismissProactiveHint($event)"
          class="absolute -top-2 -right-2 w-5 h-5 bg-forest-deep text-gold rounded-full border border-gold/40 flex items-center justify-center text-[10px] hover:bg-gold hover:text-charcoal transition-all"
        >
          ×
        </button>
        <div class="flex items-start gap-2">
          <span class="w-2 h-2 rounded-full bg-gold animate-ping mt-1 flex-shrink-0"></span>
          <p class="leading-relaxed text-[11px] text-ivory/90">
            <strong class="text-gold font-semibold block mb-0.5">Compass AI Advisor</strong>
            {{ proactiveMessage }}
          </p>
        </div>
      </div>

      <!-- Main Floating Launcher Pill / Button -->
      <button
        *ngIf="!isOpen"
        (click)="openAdvisor()"
        class="group flex items-center gap-3 bg-gradient-to-r from-forest via-forest-deep to-forest border border-gold/40 hover:border-gold text-ivory px-4 py-3 rounded-pill shadow-forest-card hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-0.5"
        title="Ask Compass AI Advisor"
      >
        <div class="relative w-7 h-7 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-gold/25 blur-sm group-hover:scale-125 transition-transform"></div>
          <svg class="w-5 h-5 text-gold relative z-10 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41M12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        </div>
        <div class="text-left pr-1 hidden sm:block">
          <span class="block text-xs font-serif font-bold text-ivory tracking-wide">Ask Compass AI</span>
          <span class="block text-[10px] text-gold/85 uppercase tracking-wider font-mono">
            {{ userArchetype ? userArchetype : 'Personal Advisor' }}
          </span>
        </div>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-forest animate-pulse"></span>
      </button>

      <!-- Floating Chat Window (Drawer) -->
      <div
        *ngIf="isOpen"
        class="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-ivory rounded-sheet border border-forest-line/20 shadow-2xl flex flex-col overflow-hidden animate-fadeIn transition-all duration-300"
      >
        <!-- Chat Header -->
        <div class="bg-forest text-ivory p-4 border-b border-forest-line flex items-center justify-between relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-gold/15 rounded-full blur-2xl pointer-events-none"></div>

          <div class="flex items-center gap-3 relative z-10">
            <div class="w-9 h-9 rounded-full bg-forest-deep border border-gold/40 flex items-center justify-center text-gold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-serif font-bold text-sm text-ivory">Compass AI Advisor</h3>
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p class="text-[10px] text-ivory/70 truncate max-w-[220px]">
                {{ contextSummary || 'Tailored to your African business goals' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 relative z-10">
            <button
              (click)="resetConversation()"
              title="Reset conversation"
              class="w-7 h-7 rounded-full text-ivory/60 hover:text-gold hover:bg-forest-deep flex items-center justify-center transition-colors text-xs"
            >
              ↺
            </button>
            <button
              (click)="closeAdvisor()"
              title="Close advisor"
              class="w-7 h-7 rounded-full text-ivory/60 hover:text-ivory hover:bg-forest-deep flex items-center justify-center transition-colors font-bold text-base"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Dynamic Context Bar -->
        <div class="bg-forest-deep px-3 py-1.5 text-[10px] text-gold/90 border-b border-forest-line flex items-center justify-between">
          <span class="truncate flex items-center gap-1.5">
            <span class="text-gold font-bold">●</span>
            <span>{{ activeJourney ? ('Active: ' + activeJourney.businessName + ' (' + activeJourney.progressPercentage + '%)') : (userArchetype ? ('Archetype: ' + userArchetype) : 'Informed by your Compass Profile') }}</span>
          </span>
          <span class="text-ivory/50 font-mono text-[9px] uppercase">Live</span>
        </div>

        <!-- Chat Messages Conversation Stream -->
        <div #messagesContainer class="flex-1 p-4 overflow-y-auto space-y-3 bg-ivory">
          
          <div *ngFor="let msg of chatMessages" class="flex flex-col" [ngClass]="{'items-end': msg.role === 'user', 'items-start': msg.role === 'model'}">
            <div
              class="max-w-[88%] p-3 rounded-card text-xs leading-relaxed"
              [ngClass]="{
                'bg-forest text-ivory font-medium': msg.role === 'user',
                'bg-white text-charcoal border border-forest-line/15 shadow-sm': msg.role === 'model'
              }"
            >
              <div [innerHTML]="formatChatMessage(msg.text, msg.role === 'user')"></div>
            </div>
            <span class="text-[9px] text-charcoal/40 mt-1 px-1">
              {{ msg.role === 'user' ? 'You' : 'Compass AI' }}
            </span>
          </div>

          <!-- Loading message indicator -->
          <div *ngIf="isChatLoading" class="flex items-center gap-2 text-xs text-charcoal/60 p-2 bg-white rounded-card border border-forest-line/10 max-w-[80%]">
            <div class="w-2 h-2 rounded-full bg-gold animate-bounce"></div>
            <div class="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]"></div>
            <div class="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]"></div>
            <span class="text-[11px] text-charcoal/70">Analyzing your business context...</span>
          </div>
        </div>

        <!-- Quick Smart Suggestions Based on User Context -->
        <div class="p-2.5 bg-ivory-cream border-t border-forest-line/10 flex flex-nowrap overflow-x-auto gap-1.5 no-scrollbar">
          <button
            *ngFor="let prompt of smartPrompts"
            (click)="askQuickPrompt(prompt)"
            [disabled]="isChatLoading"
            class="text-[10px] font-medium px-2.5 py-1 rounded-pill bg-white hover:bg-forest/5 text-charcoal border border-forest-line/20 transition-all flex-shrink-0 whitespace-nowrap disabled:opacity-40"
          >
            💡 {{ prompt }}
          </button>
        </div>

        <!-- Input Bar -->
        <div class="p-3 bg-white border-t border-forest-line/15 flex gap-2">
          <input
            type="text"
            [(ngModel)]="chatInput"
            (keyup.enter)="sendMessage()"
            [disabled]="isChatLoading"
            placeholder="Ask about your next steps, pricing, permits..."
            class="flex-grow p-2.5 rounded-button border border-forest-line/20 bg-ivory text-charcoal text-xs focus:outline-none focus:border-gold"
          />
          <button
            (click)="sendMessage()"
            [disabled]="!chatInput.trim() || isChatLoading"
            class="bg-forest hover:bg-forest-deep disabled:opacity-40 text-gold font-semibold text-xs px-4 py-2.5 rounded-button shadow transition-all flex items-center justify-center flex-shrink-0"
          >
            <span>Ask</span>
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class FloatingAdvisorComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  api = inject(ApiService);
  auth = inject(AuthService);
  lang = inject(LanguageService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);

  isOpen = false;
  showProactiveHint = true;
  proactiveMessage = '';
  isChatLoading = false;
  chatInput = '';
  chatMessages: ChatMessage[] = [];

  userArchetype: string | null = null;
  topRecommendedBusiness: string | null = null;
  activeJourney: Journey | null = null;
  latestResult: AssessmentResult | null = null;
  growProfile: any = null;
  smartPrompts: string[] = [];
  contextSummary = '';

  private routerSub?: Subscription;
  currentUrl = '';

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.routerSub = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.currentUrl = e.urlAfterRedirects;
      this.refreshUserData();
    });

    this.refreshUserData();
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  get shouldShowFloatingBeacon(): boolean {
    // Hide floating beacon during the actual 22-question assessment wizard so it doesn't distract
    if (this.currentUrl.startsWith('/pathfinder') && !this.currentUrl.includes('/results')) {
      return false;
    }
    // Show for logged-in users, or users on dashboard/profile, results, or journey pages
    const hasUser = !!this.auth.currentUser();
    const isRelevantPage = this.currentUrl.startsWith('/profile') ||
      this.currentUrl.startsWith('/results') ||
      this.currentUrl.startsWith('/journey') ||
      this.currentUrl.startsWith('/business') ||
      this.currentUrl.startsWith('/grow-business');

    return hasUser || isRelevantPage;
  }

  refreshUserData() {
    const user = this.auth.currentUser();
    const userId = this.auth.getEffectiveUserId();

    // 1. Fetch user journeys to know progress
    this.api.getUserJourneys(userId).subscribe({
      next: journeys => {
        if (journeys && journeys.length > 0) {
          this.activeJourney = journeys[0];
        }
        this.updatePromptsAndGreeting();
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    // 2. Fetch latest assessment result
    this.api.getUserResults(userId).subscribe({
      next: results => {
        if (results && results.length > 0) {
          this.latestResult = results[0];
          this.userArchetype = results[0].primaryArchetype;
          this.topRecommendedBusiness = results[0].topMatches?.[0]?.name || null;
        } else {
          const cachedResultId = typeof localStorage !== 'undefined' ? localStorage.getItem('compass_last_result_id') : null;
          if (cachedResultId) {
            this.api.getResultById(cachedResultId).subscribe({
              next: cached => {
                if (cached) {
                  this.latestResult = cached;
                  this.userArchetype = cached.primaryArchetype;
                  this.topRecommendedBusiness = cached.topMatches?.[0]?.name || null;
                  this.updatePromptsAndGreeting();
                  this.cdr.detectChanges();
                }
              }
            });
          }
        }
        this.updatePromptsAndGreeting();
        this.cdr.detectChanges();
      },
      error: () => {}
    });
    // 3. Fetch active Grow My Business profile
    const activeGrowId = typeof localStorage !== 'undefined' ? localStorage.getItem('compass_active_grow_id') : null;
    if (activeGrowId) {
      this.api.getGrowIntake(activeGrowId).subscribe({
        next: intake => {
          if (intake) {
            this.growProfile = intake;
            this.updatePromptsAndGreeting();
            this.cdr.detectChanges();
          }
        },
        error: () => {}
      });
    } else {
      this.api.getRecentIntakes(userId).subscribe({
        next: (list: any[]) => {
          if (list && list.length > 0) {
            this.growProfile = list[0];
            this.updatePromptsAndGreeting();
            this.cdr.detectChanges();
          }
        },
        error: () => {}
      });
    }
  }

  updatePromptsAndGreeting() {
    const user = this.auth.currentUser();
    const name = user?.name ? user.name.split(' ')[0] : 'there';

    // Build context summary & proactive message
    if (this.growProfile) {
      const snap = this.growProfile.snapshot;
      const profitVal = snap?.estimatedMonthlyProfit || (snap?.estimatedProfit ? snap.estimatedProfit * 30 : 0);
      const profitDisplay = profitVal ? `KSh ${profitVal.toLocaleString()}/mo profit` : 'Financial Tracking';
      this.contextSummary = `${this.growProfile.businessType || 'Business'} · ${profitDisplay}`;
      this.proactiveMessage = `Tracking ${this.growProfile.businessType || 'your business'}? Ask me about your snapshot, margins or next step!`;
    } else if (this.activeJourney) {
      this.contextSummary = `${this.activeJourney.businessName} (${this.activeJourney.progressPercentage}% done)`;
      this.proactiveMessage = `Ready for your next milestone in ${this.activeJourney.businessName}? Click to chat!`;
    } else if (this.userArchetype) {
      this.contextSummary = `${this.userArchetype} · Recommended: ${this.topRecommendedBusiness || 'Venture'}`;
      this.proactiveMessage = `Have questions about launching as ${this.userArchetype}? Ask Compass AI!`;
    } else {
      this.contextSummary = 'Informed by your entrepreneurial profile';
      this.proactiveMessage = `Need help picking a venture or pricing in Africa? Ask Compass AI!`;
    }

    // Build Smart Context Prompts
    const prompts: string[] = [];
    if (this.growProfile) {
      prompts.push('What is my business snapshot?');
      prompts.push(`How can I improve my profit margin for ${this.growProfile.businessType || 'my business'}?`);
      if (this.growProfile.nextBestStep?.headline) {
        prompts.push('What does my next best step mean?');
      } else {
        prompts.push('How much should I pay myself as owner?');
      }
    } else if (this.activeJourney) {
      prompts.push(`What is my highest priority step in ${this.activeJourney.businessName}?`);
      prompts.push('How can I acquire my first 10 customers quickly?');
      prompts.push('What are common cash flow mistakes to avoid?');
    } else if (this.userArchetype) {
      prompts.push(`What are my biggest blind spots as ${this.userArchetype}?`);
      if (this.topRecommendedBusiness) {
        prompts.push(`What county permits do I need for ${this.topRecommendedBusiness}?`);
      }
      prompts.push('How should I price products in Kenya/East Africa?');
    } else {
      prompts.push('What business can I start with under KES 50,000?');
      prompts.push('How do I validate an idea before quitting my job?');
      prompts.push('What county business licenses do I need in Kenya?');
    }

    this.smartPrompts = prompts;

    // Initialize initial greeting if chat is empty
    if (this.chatMessages.length === 0) {
      let greeting = `Jambo ${name}! I am your **Compass AI Personal Business Advisor**. `;
      if (this.growProfile) {
        const snap = this.growProfile.snapshot;
        greeting += `I am actively tracking your **${this.growProfile.businessType || 'business'}**`;
        if (snap?.averageDailySales) {
          const profitVal = snap.estimatedMonthlyProfit || (snap.estimatedProfit ? snap.estimatedProfit * 30 : 0);
          greeting += ` (averaging **KSh ${snap.averageDailySales.toLocaleString()}** daily sales, with estimated monthly profit of **KSh ${profitVal.toLocaleString()}**)`;
        }
        greeting += `. I have your complete business snapshot and diagnostics in memory. Ask me anything about your numbers, expenses, or next strategic steps!`;
      } else if (this.activeJourney) {
        greeting += `I'm tracking your **${this.activeJourney.businessName}** launch (${this.activeJourney.progressPercentage}% complete). How can I help you clear obstacles or hit your next target today?`;
      } else if (this.userArchetype && this.topRecommendedBusiness) {
        greeting += `I've analyzed your profile as **${this.userArchetype}** with recommended venture **${this.topRecommendedBusiness}**. Ask me anything about local suppliers, county permits, or bootstrapping safely!`;
      } else {
        greeting += `I'm here to give you grounded, practical advice on starting and scaling ventures in African markets. What business question is on your mind?`;
      }

      this.chatMessages.push({ role: 'model', text: greeting });
    }
  }

  openAdvisor() {
    this.isOpen = true;
    this.showProactiveHint = false;
    this.refreshUserData();
    this.scrollToBottom();
  }

  closeAdvisor() {
    this.isOpen = false;
  }

  dismissProactiveHint(event: MouseEvent) {
    event.stopPropagation();
    this.showProactiveHint = false;
  }

  resetConversation() {
    this.chatMessages = [];
    this.updatePromptsAndGreeting();
    this.cdr.detectChanges();
  }

  askQuickPrompt(prompt: string) {
    this.chatInput = prompt;
    this.sendMessage();
  }

  sendMessage() {
    const text = this.chatInput.trim();
    if (!text || this.isChatLoading) return;

    this.chatMessages.push({ role: 'user', text });
    this.chatInput = '';
    this.isChatLoading = true;
    this.scrollToBottom();
    this.cdr.detectChanges();

    // Compile comprehensive context about user data
    const user = this.auth.currentUser();
    const contextParts = [
      `User Name: ${user?.name || 'Entrepreneur'}`,
      `Country: ${user?.country || 'Kenya'}`,
      `Entrepreneur Archetype: ${this.userArchetype || 'Unassessed'}`,
      `Top Recommended Venture: ${this.topRecommendedBusiness || 'None'}`,
    ];

    if (this.activeJourney) {
      contextParts.push(`Active Roadmap: ${this.activeJourney.businessName}`);
      contextParts.push(`Progress: ${this.activeJourney.progressPercentage}%`);
      const uncompletedTask = this.findNextTask(this.activeJourney);
      if (uncompletedTask) {
        contextParts.push(`Next Task on Roadmap: "${uncompletedTask}"`);
      }
    }

    if (this.latestResult) {
      contextParts.push(`Risk Profile: ${this.latestResult.riskProfile || 'Balanced'}`);
      if (this.latestResult.topMatches?.length) {
        const top3 = this.latestResult.topMatches.map(m => m.name).join(', ');
        contextParts.push(`Top 3 Recommendations: ${top3}`);
      }
    }

    // Grow My Business Live Profile & Snapshot
    if (this.growProfile) {
      const snap = this.growProfile.snapshot || {};
      const diag = this.growProfile.diagnostics || {};
      const nextStep = this.growProfile.nextBestStep || {};
      const money = this.growProfile.moneyPlan || {};

      const profitVal = snap.estimatedMonthlyProfit || (snap.estimatedProfit ? snap.estimatedProfit * 30 : 0);

      contextParts.push(`ACTIVE BUSINESS INTAKE:
- Business: ${this.growProfile.businessType || 'Operating Venture'}
- Duration: ${this.growProfile.operatingDuration || 'Operating'}
- Primary Challenge: ${this.growProfile.biggestChallenge || 'Operations'}
- Improvement Priority: ${this.growProfile.mostLikeToImprove || 'Increase sales'}
- Tracking Habit: ${this.growProfile.financialTrackingAbility || 'Regular'}

LIVE BUSINESS SNAPSHOT FIGURES:
- Average Daily Sales: KSh ${(snap.averageDailySales || 0).toLocaleString()}
- Average Monthly Sales: KSh ${(snap.averageMonthlySales || 0).toLocaleString()}
- Average Daily Expenses: KSh ${(snap.averageExpenses || 0).toLocaleString()}
- Estimated Monthly Profit: KSh ${profitVal.toLocaleString()}
- Fixed Monthly Costs: KSh ${(snap.fixedMonthlyCosts || 0).toLocaleString()}
- Recommended Owner Pay: KSh ${(snap.ownerPay || 0).toLocaleString()}
- Total Tracked Days: ${snap.totalTrackedDays || 0}
- Stock Inventory Value: KSh ${(snap.stockInventoryValue || 0).toLocaleString()}

INTELLIGENCE LAYER - CURRENT NEXT BEST STEP:
- Headline: ${nextStep.headline || 'Record daily sales & expenses'}
- Reason: ${nextStep.reason || 'Consistency reveals true profit margins'}

DIAGNOSTIC RECOMMENDATIONS:
- Focus: ${diag.focusArea || 'Business Operations'}
- Recommendations: ${(diag.recommendations || []).join('; ')}

MONEY PLAN:
- Advice: ${money.recommendation || 'Pay yourself a consistent owner wage'}`);
    }

    const fullContext = contextParts.join('\n\n');

    this.api.chatWithAi(this.chatMessages, fullContext).subscribe({
      next: res => {
        this.isChatLoading = false;
        this.chatMessages.push({ role: 'model', text: res.reply });
        this.scrollToBottom();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isChatLoading = false;
        this.chatMessages.push({
          role: 'model',
          text: 'Pole sana! The Compass AI advisor encountered a brief connection issue. Please ask again in a moment.'
        });
        this.scrollToBottom();
        this.cdr.detectChanges();
      }
    });
  }

  private findNextTask(journey: Journey): string | null {
    for (const week of journey.weeks || []) {
      for (const task of week.tasks || []) {
        if (!task.completed) {
          return task.title;
        }
      }
    }
    return null;
  }

  private scrollToBottom() {
    setTimeout(() => {
      try {
        if (this.messagesContainer?.nativeElement) {
          this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        }
      } catch {}
    }, 60);
  }

  formatChatMessage(raw: string, isUser = false): SafeHtml {
    if (!raw) return this.sanitizer.bypassSecurityTrustHtml('');

    if (isUser) {
      const sanitized = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return this.sanitizer.bypassSecurityTrustHtml(
        `<p class="whitespace-pre-line text-ivory text-xs leading-relaxed font-medium">${sanitized}</p>`
      );
    }

    let text = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const lines = text.split('\n');
    const output: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        if (inList) { output.push('</ul>'); inList = false; }
        continue;
      }

      // Check for Markdown headers (### or ## or #)
      const headerMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
      if (headerMatch) {
        if (inList) { output.push('</ul>'); inList = false; }
        const level = headerMatch[1].length;
        const title = this.applyInlineStyles(headerMatch[2]);
        const sizeClass = level === 1 ? 'text-sm font-bold' : 'text-xs font-bold text-forest';
        output.push(`<div class="font-serif ${sizeClass} text-forest mt-2 mb-1">${title}</div>`);
        continue;
      }

      // Numbered header item e.g. "1. **Single Business Permit:**"
      const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
      if (numMatch) {
        if (inList) { output.push('</ul>'); inList = false; }
        const num = numMatch[1];
        const content = this.applyInlineStyles(numMatch[2]);
        output.push(
          `<div class="font-serif font-bold text-xs text-forest mt-2.5 mb-1 flex items-start gap-1.5">` +
          `<span class="w-4 h-4 rounded-full bg-gold/20 text-forest font-sans text-[10px] font-bold flex items-center justify-center flex-shrink-0 border border-gold/40 mt-0.5">${num}</span>` +
          `<span class="flex-1">${content}</span></div>`
        );
        continue;
      }

      // Bullet item e.g. "* Detail"
      const bulletMatch = trimmed.match(/^[\*\-•]\s+(.*)/);
      if (bulletMatch) {
        if (!inList) {
          output.push('<ul class="space-y-1 my-1 pl-1">');
          inList = true;
        }
        const content = this.applyInlineStyles(bulletMatch[1]);
        output.push(
          `<li class="flex items-start gap-1.5 text-xs leading-relaxed text-charcoal/90">` +
          `<span class="text-gold font-bold flex-shrink-0 select-none">•</span>` +
          `<span class="flex-1">${content}</span></li>`
        );
        continue;
      }

      // Standard paragraph
      if (inList) { output.push('</ul>'); inList = false; }
      const content = this.applyInlineStyles(trimmed);
      output.push(`<p class="text-xs leading-relaxed text-charcoal/90 my-1">${content}</p>`);
    }

    if (inList) {
      output.push('</ul>');
    }

    return this.sanitizer.bypassSecurityTrustHtml(output.join(''));
  }

  private applyInlineStyles(str: string): string {
    return str
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-forest"><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-forest">$1</strong>')
      .replace(/\*([^\*]+)\*/g, '<em class="italic text-charcoal/80">$1</em>')
      .replace(/_([^_]+)_/g, '<em class="italic text-charcoal/80">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-forest-line/15 rounded text-[10px] font-mono text-forest">$1</code>');
  }
}
