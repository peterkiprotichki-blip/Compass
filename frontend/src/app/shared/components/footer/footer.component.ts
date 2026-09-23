import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-forest border-t border-forest-line text-ivory/80 pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <!-- Col 1: Brand & Tagline -->
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center gap-3">
              <img src="brand/compass-mark.png" alt="Compass" class="h-9 w-9">
              <span class="text-2xl font-serif font-bold tracking-tight text-ivory">
                Compass<span class="text-gold">.</span>
              </span>
            </div>
            <p class="text-sm text-ivory/70 leading-relaxed">
              {{ lang.isSwahili() ? 'Mwongozo leo. Kesho yenye mwangaza zaidi.' : 'Guidance today. Brighter tomorrows.' }}
            </p>
            <div class="pt-2">
              <span class="font-serif italic text-gold text-lg font-medium">Ideas to Impact.</span>
            </div>
          </div>

          <!-- Col 2: Brand Pillars -->
          <div>
            <h4 class="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              {{ lang.isSwahili() ? 'Misingi Yetu' : 'Brand Pillars' }}
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Guidance</strong>: Clear, reliable insights</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Practical</strong>: 30-day plans & tasks</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Inclusive</strong>: Kiswahili & English</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>African</strong>: Grounded in local reality</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Impact</strong>: Stronger communities</span>
              </li>
            </ul>
          </div>

          <!-- Col 3: Journeys -->
          <div>
            <h4 class="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              {{ lang.isSwahili() ? 'Njia za Kuanza' : 'User Journeys' }}
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <a routerLink="/pathfinder" class="hover:text-gold transition-colors">
                  {{ lang.isSwahili() ? 'Anza Biashara (Pathfinder)' : 'Explore Business Pathfinder' }}
                </a>
              </li>
              <li>
                <a routerLink="/grow-business" class="hover:text-gold transition-colors">
                  {{ lang.isSwahili() ? 'Kuza Biashara Yangu' : 'Grow My Business' }}
                </a>
              </li>
              <li>
                <a routerLink="/how-it-works" class="hover:text-gold transition-colors">
                  {{ lang.t.navHowItWorks }}
                </a>
              </li>
              <li>
                <a routerLink="/learn" class="hover:text-gold transition-colors">
                  {{ lang.t.navResources }}
                </a>
              </li>
              <li>
                <a routerLink="/pricing" class="hover:text-gold transition-colors">
                  {{ lang.t.navPricing }} (KES 499)
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 4: Contact & Community -->
          <div>
            <h4 class="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              {{ lang.isSwahili() ? 'Wasiliana Nasi' : 'Contact & Support' }}
            </h4>
            <ul class="space-y-2.5 text-xs text-ivory/70">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support&#64;compass.africa</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Nairobi, Kenya</span>
              </li>
              <li class="pt-2 text-ivory/60 leading-relaxed">
                {{ lang.isSwahili() ? 'Imejengwa mahsusi kuwawezesha wajasiriamali wa Kenya na Afrika kufanikiwa.' : 'Built purposefully for Kenyan and African entrepreneurs to launch and grow with confidence.' }}
              </li>
            </ul>
          </div>

        </div>

        <div class="border-t border-forest-line pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>© 2026 Compass Africa Inc. For every entrepreneur. A brighter Africa.</p>
          <div class="flex items-center space-x-6">
            <span class="hover:text-ivory cursor-pointer">Privacy Policy</span>
            <span class="hover:text-ivory cursor-pointer">Terms of Service</span>
            <span class="hover:text-ivory cursor-pointer">Contact Support</span>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  lang = inject(LanguageService);
}
