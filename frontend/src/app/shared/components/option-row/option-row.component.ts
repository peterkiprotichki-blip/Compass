import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OptionIconType =
  | 'globe'
  | 'map-pin'
  | 'city'
  | 'town'
  | 'leaf'
  | 'coins'
  | 'banknote'
  | 'wallet'
  | 'vault'
  | 'rocket'
  | 'clock'
  | 'timer'
  | 'calendar'
  | 'bolt'
  | 'users'
  | 'puzzle'
  | 'sparkles'
  | 'clipboard'
  | 'briefcase'
  | 'tool'
  | 'code'
  | 'utensils'
  | 'store'
  | 'user'
  | 'handshake'
  | 'shield'
  | 'flame'
  | 'scale'
  | 'trending-up'
  | 'compass'
  | 'academic'
  | 'laptop'
  | 'heart'
  | 'crown'
  | 'truck'
  | 'drop'
  | 'wifi'
  | 'chat'
  | 'cube'
  | 'home'
  | 'plus-circle'
  | 'refresh'
  | 'search'
  | 'camera'
  | 'scissors'
  | 'sun'
  | 'chart';

@Component({
  selector: 'app-option-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (click)="selectedChange.emit(!isSelected)"
      class="group w-full rounded-card p-3.5 sm:p-4 cursor-pointer transition-all duration-200 border flex items-center justify-between text-left select-none relative overflow-hidden"
      [ngClass]="{
        'bg-gradient-to-r from-gold/15 via-ivory to-gold/5 border-2 border-gold shadow-md shadow-gold/10 ring-1 ring-gold/40 transform scale-[1.01]': isSelected,
        'bg-white border-forest-line/15 hover:border-gold/60 hover:bg-ivory/60 hover:shadow-light-sm': !isSelected
      }"
    >
      <!-- Left indicator / accent bar on selected -->
      <div
        *ngIf="isSelected"
        class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-soft via-gold to-gold-dark"
      ></div>

      <div class="flex items-center gap-3 sm:gap-4 pr-3 flex-grow min-w-0">
        
        <!-- Letter / Key Badge (A, B, C...) -->
        <span
          class="w-7 h-7 rounded-pill text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors"
          [ngClass]="{
            'bg-gold text-charcoal shadow-sm': isSelected,
            'bg-ivory-sunk text-charcoal/60 border border-forest-line/15 group-hover:border-gold/40 group-hover:text-charcoal': !isSelected
          }"
        >
          {{ letterBadge }}
        </span>

        <!-- Luxury SVG Vector Icon Container (NO EMOJIS) -->
        <div
          class="w-9 h-9 rounded-card flex items-center justify-center flex-shrink-0 transition-all duration-200"
          [ngClass]="{
            'bg-gold text-charcoal shadow-sm shadow-gold/25': isSelected,
            'bg-forest/5 text-forest group-hover:bg-gold/15 group-hover:text-gold-dark border border-forest-line/10': !isSelected
          }"
        >
          <!-- SVG Icon Definitions -->
          <ng-container [ngSwitch]="resolvedIcon">
            <!-- Globe -->
            <svg *ngSwitchCase="'globe'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>

            <!-- Map Pin -->
            <svg *ngSwitchCase="'map-pin'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            <!-- City -->
            <svg *ngSwitchCase="'city'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>

            <!-- Town -->
            <svg *ngSwitchCase="'town'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>

            <!-- Leaf -->
            <svg *ngSwitchCase="'leaf'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 01-9-9c0-4.97 4.03-9 9-9 0 4.97 4.03 9 9 9a9 9 0 01-9 9z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
            </svg>

            <!-- Coins -->
            <svg *ngSwitchCase="'coins'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <!-- Banknote -->
            <svg *ngSwitchCase="'banknote'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h.01M18 12h.01" />
            </svg>

            <!-- Wallet -->
            <svg *ngSwitchCase="'wallet'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>

            <!-- Vault -->
            <svg *ngSwitchCase="'vault'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>

            <!-- Rocket -->
            <svg *ngSwitchCase="'rocket'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>

            <!-- Clock -->
            <svg *ngSwitchCase="'clock'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
            </svg>

            <!-- Timer -->
            <svg *ngSwitchCase="'timer'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="14" r="8" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2M12 10v4l3 3M7.05 4.05l1.41 1.41M16.95 4.05l-1.41 1.41" />
            </svg>

            <!-- Calendar -->
            <svg *ngSwitchCase="'calendar'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18" />
            </svg>

            <!-- Bolt -->
            <svg *ngSwitchCase="'bolt'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>

            <!-- Users -->
            <svg *ngSwitchCase="'users'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>

            <!-- Puzzle -->
            <svg *ngSwitchCase="'puzzle'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>

            <!-- Sparkles -->
            <svg *ngSwitchCase="'sparkles'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>

            <!-- Clipboard -->
            <svg *ngSwitchCase="'clipboard'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>

            <!-- Briefcase -->
            <svg *ngSwitchCase="'briefcase'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>

            <!-- Tool -->
            <svg *ngSwitchCase="'tool'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>

            <!-- Code -->
            <svg *ngSwitchCase="'code'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>

            <!-- Store -->
            <svg *ngSwitchCase="'store'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            <!-- User -->
            <svg *ngSwitchCase="'user'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>

            <!-- Handshake -->
            <svg *ngSwitchCase="'handshake'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>

            <!-- Shield -->
            <svg *ngSwitchCase="'shield'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>

            <!-- Flame -->
            <svg *ngSwitchCase="'flame'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.975 7.975 0 012.344 5.657 7.975 7.975 0 01-2.343 5.657z" />
            </svg>

            <!-- Scale -->
            <svg *ngSwitchCase="'scale'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>

            <!-- Trending Up -->
            <svg *ngSwitchCase="'trending-up'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>

            <!-- Academic / Graduation Cap -->
            <svg *ngSwitchCase="'academic'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7" />
            </svg>

            <!-- Laptop / Remote / Digital -->
            <svg *ngSwitchCase="'laptop'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2 20h20" />
            </svg>

            <!-- Heart / Impact / Care -->
            <svg *ngSwitchCase="'heart'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>

            <!-- Crown / Legacy / Wealth -->
            <svg *ngSwitchCase="'crown'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 18h18M3 8l4.5 4L12 5l4.5 7L21 8v10H3V8z" />
            </svg>

            <!-- Truck / Logistics / Transport -->
            <svg *ngSwitchCase="'truck'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="1" y="5" width="15" height="11" rx="1" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 8h4l3 4v4h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>

            <!-- Drop / Clean Water -->
            <svg *ngSwitchCase="'drop'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            </svg>

            <!-- Wifi / Internet -->
            <svg *ngSwitchCase="'wifi'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>

            <!-- Chat / Speech Bubbles / Advice -->
            <svg *ngSwitchCase="'chat'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>

            <!-- Cube / Building Materials -->
            <svg *ngSwitchCase="'cube'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>

            <!-- Home / Housing -->
            <svg *ngSwitchCase="'home'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>

            <!-- Plus Circle / Healthcare -->
            <svg *ngSwitchCase="'plus-circle'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8" />
            </svg>

            <!-- Refresh / Adaptable / Pivot -->
            <svg *ngSwitchCase="'refresh'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>

            <!-- Search / Research -->
            <svg *ngSwitchCase="'search'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
            </svg>

            <!-- Camera / Video / Public -->
            <svg *ngSwitchCase="'camera'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>

            <!-- Scissors / Beauty / Barbershop -->
            <svg *ngSwitchCase="'scissors'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
            </svg>

            <!-- Sun / Freedom / Retired -->
            <svg *ngSwitchCase="'sun'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>

            <!-- Chart / Analytical -->
            <svg *ngSwitchCase="'chart'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>

            <!-- Utensils / Food -->
            <svg *ngSwitchCase="'utensils'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              <circle cx="12" cy="12" r="9" />
            </svg>

            <!-- Default: Compass -->
            <svg *ngSwitchDefault class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 7 16 16 8 16" fill="currentColor" opacity="0.7" />
            </svg>
          </ng-container>
        </div>

        <!-- Label & Subtitle -->
        <div class="flex-grow min-w-0">
          <p
            class="text-[14px] sm:text-base font-medium text-charcoal leading-snug transition-colors"
            [class.font-bold]="isSelected"
            [class.text-forest]="isSelected"
          >
            {{ label }}
          </p>
          <p *ngIf="subtitle" class="text-xs text-charcoal/65 mt-0.5 leading-normal">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Selector Icon (Circle for single, Square for multi) -->
      <div class="flex-shrink-0 flex items-center justify-center pl-2">
        <!-- Single select circle -->
        <div
          *ngIf="!isMulti"
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          [ngClass]="{
            'border-gold bg-gold shadow-sm shadow-gold/30': isSelected,
            'border-forest-line/30 bg-transparent group-hover:border-gold/50': !isSelected
          }"
        >
          <div *ngIf="isSelected" class="w-2.5 h-2.5 rounded-full bg-charcoal"></div>
        </div>

        <!-- Multi select square -->
        <div
          *ngIf="isMulti"
          class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200"
          [ngClass]="{
            'border-gold bg-gold shadow-sm shadow-gold/30': isSelected,
            'border-forest-line/30 bg-transparent group-hover:border-gold/50': !isSelected
          }"
        >
          <svg *ngIf="isSelected" class="w-4 h-4 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  @Input() index: number = 0;
  @Input() optionId: string = '';
  @Input() iconOverride?: OptionIconType;
  @Output() selectedChange = new EventEmitter<boolean>();

  get letterBadge(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[this.index % letters.length] || `${this.index + 1}`;
  }

  get resolvedIcon(): OptionIconType {
    if (this.iconOverride) return this.iconOverride;

    const text = (this.label + ' ' + (this.optionId || '')).toLowerCase();

    // Countries & Regions
    if (text.includes('kenya') || text.includes('uganda') || text.includes('tanzania') || text.includes('rwanda') || text.includes('nigeria') || text.includes('ghana') || text.includes('south africa')) {
      return 'map-pin';
    }
    if (text.includes('other african') || text.includes('nchi nyingine')) return 'globe';

    // Settings
    if (text.includes('major city') || text.includes('jiji')) return 'city';
    if (text.includes('town') || text.includes('mji') || text.includes('manispaa')) return 'town';
    if (text.includes('rural') || text.includes('vijijini') || text.includes('shamba') || text.includes('farming') || text.includes('kilimo')) return 'leaf';

    // Capital bands & income
    if (text.includes('under kes 10') || text.includes('chini ya kes 10') || text.includes('under_10k') || text.includes('under kes 20') || text.includes('under_20k')) return 'coins';
    if (text.includes('10,000 – 50,000') || text.includes('10k_50k') || text.includes('20,000 – 50,000') || text.includes('20k_50k')) return 'banknote';
    if (text.includes('50,000 – 100,000') || text.includes('50k_100k')) return 'wallet';
    if (text.includes('100,000 – 500,000') || text.includes('100k_500k') || text.includes('100k_300k') || text.includes('100,000 – 300,000')) return 'vault';
    if (text.includes('500,000 – 1') || text.includes('500k_1m')) return 'vault';
    if (text.includes('above kes 1') || text.includes('above_1m') || text.includes('above_300k') || text.includes('zaidi ya')) return 'rocket';

    // Time availability
    if (text.includes('less than 10 hours') || text.includes('chini ya masaa 10') || text.includes('lt_10h')) return 'clock';
    if (text.includes('10 – 20 hours') || text.includes('10_20h')) return 'timer';
    if (text.includes('20 – 40 hours') || text.includes('20_40h')) return 'calendar';
    if (text.includes('full-time') || text.includes('muda kamili')) return 'bolt';

    // Work Situations
    if (text.includes('student') || text.includes('mwanafunzi') || text.includes('teaching') || text.includes('mentor') || text.includes('kufundisha') || text.includes('education') || text.includes('training')) return 'academic';
    if (text.includes('employed') || text.includes('nimeajiriwa') || text.includes('replace_job') || text.includes('job_regroup')) return 'briefcase';
    if (text.includes('self_employed') || text.includes('freelancer') || text.includes('kujiajiri') || text.includes('laptop') || text.includes('remote') || text.includes('online')) return 'laptop';
    if (text.includes('retired') || text.includes('nimestaafu') || text.includes('financial_freedom') || text.includes('uhuru wa kifedha')) return 'sun';

    // Specific local opportunities / gaps
    if (text.includes('clean_water') || text.includes('maji safi') || text.includes('drinking water')) return 'drop';
    if (text.includes('food') || text.includes('chakula') || text.includes('nutrition') || text.includes('restaurant') || text.includes('baking') || text.includes('meals')) return 'utensils';
    if (text.includes('transport') || text.includes('delivery') || text.includes('usafiri') || text.includes('logistics') || text.includes('bodaboda') || text.includes('commuter')) return 'truck';
    if (text.includes('childcare') || text.includes('watoto') || text.includes('community') || text.includes('impact') || text.includes('purpose') || text.includes('manufaa')) return 'heart';
    if (text.includes('beauty') || text.includes('barber') || text.includes('saluni') || text.includes('styling') || text.includes('urembo')) return 'scissors';
    if (text.includes('farming_inputs') || text.includes('pembejeo') || text.includes('vet')) return 'leaf';
    if (text.includes('internet') || text.includes('wi-fi') || text.includes('mtandao') || text.includes('cyber')) return 'wifi';
    if (text.includes('building_materials') || text.includes('hardware') || text.includes('ujenzi')) return 'cube';
    if (text.includes('housing') || text.includes('nyumba') || text.includes('rental')) return 'home';
    if (text.includes('healthcare') || text.includes('chemist') || text.includes('clinic') || text.includes('afya') || text.includes('dawa')) return 'plus-circle';
    if (text.includes('complaint') || text.includes('customer_service') || text.includes('wateja') || text.includes('advice') || text.includes('ushauri')) return 'chat';
    if (text.includes('wealth') || text.includes('legacy') || text.includes('utajiri') || text.includes('urithi')) return 'crown';

    // Strengths, skills, styles
    if (text.includes('people') || text.includes('watu') || text.includes('social') || text.includes('unemployment') || text.includes('team') || text.includes('timu') || text.includes('manage') || text.includes('staff') || text.includes('lead')) return 'users';
    if (text.includes('problem') || text.includes('tatua') || text.includes('logic') || text.includes('puzzle')) return 'puzzle';
    if (text.includes('creative') || text.includes('ubunifu') || text.includes('design') || text.includes('art') || text.includes('brand')) return 'sparkles';
    if (text.includes('organis') || text.includes('mpangilio') || text.includes('plan') || text.includes('ratiba') || text.includes('system') || text.includes('process')) return 'clipboard';
    if (text.includes('sell') || text.includes('mauzo') || text.includes('negotiat') || text.includes('deal') || text.includes('profit')) return 'briefcase';
    if (text.includes('hands') || text.includes('mikono') || text.includes('fundi') || text.includes('repair') || text.includes('service') || text.includes('technical')) return 'tool';
    if (text.includes('video') || text.includes('content') || text.includes('public') || text.includes('speaking') || text.includes('hadharani')) return 'camera';
    if (text.includes('tech') || text.includes('computer') || text.includes('digital') || text.includes('code')) return 'code';
    if (text.includes('shop') || text.includes('duka') || text.includes('store') || text.includes('retail') || text.includes('shopping')) return 'store';
    if (text.includes('alone') || text.includes('peke') || text.includes('solo') || text.includes('independent') || text.includes('reserved') || text.includes('behind')) return 'user';
    if (text.includes('partner') || text.includes('pamoja') || text.includes('connect')) return 'handshake';
    if (text.includes('low risk') || text.includes('conservative') || text.includes('safe') || text.includes('secure') || text.includes('stability') || text.includes('hatari ndogo') || text.includes('shield')) return 'shield';
    if (text.includes('high risk') || text.includes('aggressive') || text.includes('bold') || text.includes('hatari kubwa') || text.includes('try_again')) return 'flame';
    if (text.includes('moderate') || text.includes('balance') || text.includes('wastani') || text.includes('sometimes')) return 'scale';
    if (text.includes('growth') || text.includes('fast') || text.includes('haraka') || text.includes('kuza') || text.includes('scale') || text.includes('prices')) return 'trending-up';
    if (text.includes('analyt') || text.includes('data') || text.includes('numbers') || text.includes('namba')) return 'chart';
    if (text.includes('pivot') || text.includes('adapt') || text.includes('mix') || text.includes('kubadilika')) return 'refresh';
    if (text.includes('research') || text.includes('tafiti') || text.includes('study')) return 'search';

    return 'compass';
  }
}

