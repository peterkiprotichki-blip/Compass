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
                  Business Pathfinder (v1)
                </a>
              </li>
              <li>
                <a routerLink="/grow-business" class="hover:text-gold transition-colors">
                  Business Compass (Grow)
                </a>
              </li>
              <li>
                <a routerLink="/learn" class="hover:text-gold transition-colors">
                  Resources & Skills Library
                </a>
              </li>
              <li>
                <a routerLink="/pricing" class="hover:text-gold transition-colors">
                  Launch Pricing (KES 499)
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 4: Platform Vision -->
          <div>
            <h4 class="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              {{ lang.isSwahili() ? 'Maono ya Baadaye' : 'Platform Roadmap' }}
            </h4>
            <p class="text-xs text-ivory/60 leading-relaxed mb-3">
              Compass is part of a 3-product arc (The Jewel Method): Manifestopia → Business Pathfinder → Business Compass.
            </p>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-forest-deep border border-forest-line text-xs text-gold">
              <span>● Live v1.0 Launch</span>
            </div>
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
