import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sticky top-0 z-50 bg-forest/95 backdrop-blur-md border-b border-forest-line text-ivory">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Brand Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <img src="brand/compass-mark.png" alt="Compass" class="h-10 w-10 transition-transform duration-300 group-hover:rotate-12">
            <span class="text-2xl font-serif font-bold tracking-tight text-ivory">
              Compass<span class="text-gold">.</span>
            </span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8 text-[15px] font-medium">
            <a routerLink="/" routerLinkActive="text-gold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-gold transition-colors">
              {{ lang.t.navHome }}
            </a>
            <a routerLink="/how-it-works" routerLinkActive="text-gold" class="hover:text-gold transition-colors">
              {{ lang.t.navHowItWorks }}
            </a>
            <a routerLink="/learn" routerLinkActive="text-gold" class="hover:text-gold transition-colors">
              {{ lang.t.navResources }}
            </a>
            <a routerLink="/pricing" routerLinkActive="text-gold" class="hover:text-gold transition-colors">
              {{ lang.t.navPricing }}
            </a>
            <a routerLink="/profile" routerLinkActive="text-gold" class="hover:text-gold transition-colors flex items-center gap-1.5">
              <span>{{ lang.t.navDashboard }}</span>
              <span *ngIf="auth.currentUser()?.savedPaths?.length" class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gold text-charcoal rounded-full">
                {{ auth.currentUser()?.savedPaths?.length }}
              </span>
            </a>
            <a *ngIf="auth.isSuperAdmin()" routerLink="/admin" routerLinkActive="text-gold" class="hover:text-gold transition-colors flex items-center gap-1.5 text-gold font-semibold">
              <span>Admin</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-gold/20 border border-gold/40">Portal</span>
            </a>
          </div>

          <!-- Right actions: Language Switcher & CTA -->
          <div class="flex items-center space-x-4">
            
            <!-- Language Toggle (EN | SW) -->
            <button
              (click)="lang.toggleLanguage()"
              class="flex items-center bg-forest-deep border border-forest-line px-3 py-1.5 rounded-button text-xs font-semibold uppercase tracking-wider hover:border-gold transition-colors"
              title="Toggle Language"
            >
              <span [class.text-gold]="lang.currentLang() === 'en'" [class.text-ivory/60]="lang.currentLang() !== 'en'">EN</span>
              <span class="mx-1.5 text-forest-line">|</span>
              <span [class.text-gold]="lang.currentLang() === 'sw'" [class.text-ivory/60]="lang.currentLang() !== 'sw'">SW</span>
            </button>

            <!-- Primary Action Button -->
            <a
              routerLink="/pathfinder"
              class="hidden sm:inline-flex items-center justify-center bg-gold hover:bg-gold-soft text-charcoal font-semibold text-[15px] px-6 py-2.5 rounded-button shadow-md transition-all duration-200 hover:shadow-gold-glow"
            >
              <span>{{ lang.t.navGetStarted }}</span>
              <svg class="w-4 h-4 ml-1.5 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>

            <!-- Mobile menu button toggle -->
            <button
              (click)="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-ivory hover:text-gold focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg *ngIf="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div *ngIf="mobileMenuOpen" class="md:hidden bg-forest-deep border-b border-forest-line px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
        <a (click)="mobileMenuOpen = false" routerLink="/" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navHome }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/how-it-works" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navHowItWorks }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/learn" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navResources }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/pricing" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navPricing }}
        </a>
        <a (click)="mobileMenuOpen = false" routerLink="/profile" class="block text-ivory hover:text-gold py-2 font-medium">
          {{ lang.t.navDashboard }}
        </a>
        <a *ngIf="auth.isSuperAdmin()" (click)="mobileMenuOpen = false" routerLink="/admin" class="block text-gold hover:underline py-2 font-medium">
          Admin Portal
        </a>
        <div class="pt-2">
          <a
            (click)="mobileMenuOpen = false"
            routerLink="/pathfinder"
            class="w-full flex items-center justify-center bg-gold text-charcoal font-semibold py-3 rounded-button shadow"
          >
            {{ lang.t.navGetStarted }}
          </a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  mobileMenuOpen = false;
}
