import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import {
  AdminStatsResponse,
  AdminApplicantItem,
  AdminApplicationItem,
  AdminJourneyItem,
  AdminGrowIntakeItem,
} from '../../models/compass.models';

type AdminTab = 'OVERVIEW' | 'APPLICATIONS' | 'APPLICANTS' | 'JOURNEYS' | 'GROWTH';

@Component({
  selector: 'app-admin-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-ivory text-charcoal flex flex-col font-sans">
      
      <!-- ================= TOP ADMIN NAVBAR ================= -->
      <header class="bg-forest text-ivory border-b border-forest-line px-6 py-4 sticky top-0 z-30 shadow-md">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold">
              🧭
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-serif font-bold text-lg text-ivory tracking-wide">Compass</span>
                <span class="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-pill bg-gold text-charcoal">
                  Super Admin
                </span>
              </div>
              <p class="text-[11px] text-ivory/60">Pan-African Entrepreneur Intelligence & Operations</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <a routerLink="/" class="text-xs text-ivory/70 hover:text-gold transition-colors flex items-center gap-1">
              <span>←</span>
              <span>Back to Portal</span>
            </a>

            <div *ngIf="auth.isSuperAdmin()" class="flex items-center gap-3 pl-4 border-l border-forest-line">
              <div class="text-right hidden sm:block">
                <p class="text-xs font-semibold text-ivory">{{ auth.currentUser()?.name }}</p>
                <p class="text-[10px] text-gold font-mono">{{ auth.currentUser()?.email }}</p>
              </div>
              <button
                (click)="logoutAdmin()"
                class="px-3 py-1.5 rounded-button bg-forest-deep border border-forest-line hover:border-red-500/50 text-xs text-ivory/80 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- ================= 1. TWO-FACTOR AUTHENTICATION LOGIN GATE ================= -->
      <div *ngIf="!auth.isSuperAdmin()" class="flex-grow flex items-center justify-center p-6 bg-ivory animate-fadeIn">
        <div class="w-full max-w-md bg-white p-8 sm:p-10 rounded-sheet border border-forest-line/20 shadow-light-xl space-y-6">
          
          <div class="text-center space-y-2">
            <div class="w-14 h-14 mx-auto rounded-full bg-forest text-gold flex items-center justify-center text-2xl border border-gold/30 shadow-inner">
              🔐
            </div>
            <h2 class="text-2xl font-serif font-bold text-charcoal">
              Super Admin Access
            </h2>
            <p class="text-xs text-charcoal/60">
              Restricted management portal. Mandatory 2-step verification required.
            </p>
          </div>

          <!-- STEP 1: CREDENTIALS FORM -->
          <form *ngIf="!stepTwoRequired" (submit)="onInitiateLogin($event)" class="space-y-4">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                Admin Email
              </label>
              <input
                type="email"
                [(ngModel)]="loginEmail"
                name="email"
                class="w-full p-3 rounded-button border border-forest-line/25 bg-ivory text-sm focus:outline-none focus:border-gold"
                placeholder="admin@compass.africa"
                required
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                Password
              </label>
              <input
                type="password"
                [(ngModel)]="loginPassword"
                name="password"
                class="w-full p-3 rounded-button border border-forest-line/25 bg-ivory text-sm focus:outline-none focus:border-gold"
                placeholder="••••••••••••"
                required
              />
            </div>

            <!-- 2FA Channel Selector -->
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1.5">
                2-Step Verification Channel
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  (click)="selectedChannel = 'email'"
                  [ngClass]="{
                    'border-gold bg-ivory ring-1 ring-gold font-bold': selectedChannel === 'email',
                    'border-forest-line/20 bg-white text-charcoal/70': selectedChannel !== 'email'
                  }"
                  class="p-2.5 rounded-button border text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>✉️</span>
                  <span>Email OTP</span>
                </button>
                <button
                  type="button"
                  (click)="selectedChannel = 'sms'"
                  [ngClass]="{
                    'border-gold bg-ivory ring-1 ring-gold font-bold': selectedChannel === 'sms',
                    'border-forest-line/20 bg-white text-charcoal/70': selectedChannel !== 'sms'
                  }"
                  class="p-2.5 rounded-button border text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>📱</span>
                  <span>SMS OTP</span>
                </button>
              </div>
            </div>

            <div *ngIf="loginError" class="p-3 rounded-card bg-red-50 border border-red-200 text-xs text-red-700">
              {{ loginError }}
            </div>

            <button
              type="submit"
              [disabled]="isSubmitting"
              class="w-full bg-forest hover:bg-forest-deep text-gold font-semibold text-sm py-3.5 rounded-button shadow transition-all flex items-center justify-center gap-2"
            >
              <span>{{ isSubmitting ? 'Authenticating...' : 'Continue to Verification' }}</span>
              <span>→</span>
            </button>
          </form>

          <!-- STEP 2: 2FA OTP VERIFICATION -->
          <div *ngIf="stepTwoRequired" class="space-y-5 animate-fadeIn">
            <div class="p-4 rounded-card bg-forest/5 border border-forest-line/20 text-center space-y-1">
              <span class="text-xs uppercase font-bold text-gold tracking-wider">Step 2 of 2</span>
              <p class="text-xs text-charcoal/80">
                Enter the 6-digit code sent via <strong class="text-forest uppercase">{{ twoFactorInfo.channel }}</strong> to:
              </p>
              <p class="font-mono text-xs font-bold text-forest">
                {{ twoFactorInfo.channel === 'sms' ? twoFactorInfo.phone : twoFactorInfo.email }}
              </p>
            </div>

            <!-- Testing Preview Chip -->
            <div *ngIf="twoFactorInfo.previewOtp" class="p-3 bg-amber-50 border border-amber-200 rounded-card text-xs text-amber-900 flex items-center justify-between">
              <div>
                <span class="font-bold">Test OTP Preview:</span>
                <span class="font-mono font-bold text-forest text-sm ml-1">{{ twoFactorInfo.previewOtp }}</span>
              </div>
              <button
                type="button"
                (click)="otpCode = twoFactorInfo.previewOtp"
                class="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-[10px] font-bold rounded"
              >
                Auto-Fill
              </button>
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                6-Digit Security Code
              </label>
              <input
                type="text"
                [(ngModel)]="otpCode"
                maxlength="6"
                placeholder="123456"
                class="w-full p-3.5 text-center font-mono tracking-widest text-2xl font-bold rounded-button border border-forest-line/30 bg-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div *ngIf="loginError" class="p-3 rounded-card bg-red-50 border border-red-200 text-xs text-red-700">
              {{ loginError }}
            </div>

            <div class="space-y-2">
              <button
                (click)="onVerifyOtp()"
                [disabled]="isSubmitting || otpCode.length < 6"
                class="w-full bg-gold hover:bg-gold-soft disabled:opacity-40 text-charcoal font-semibold text-sm py-3.5 rounded-button shadow transition-all"
              >
                {{ isSubmitting ? 'Verifying...' : 'Verify Code & Access Portal' }}
              </button>

              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  (click)="resendOtp()"
                  class="text-xs text-forest hover:text-forest-deep underline font-medium"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  (click)="stepTwoRequired = false"
                  class="text-xs text-charcoal/60 hover:text-charcoal"
                >
                  Back to login
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- ================= 2. AUTHENTICATED SUPER ADMIN PORTAL ================= -->
      <main *ngIf="auth.isSuperAdmin()" class="flex-grow max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8 animate-fadeIn">
        
        <!-- Welcome & Refresh Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-line/10 pb-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              Executive Intelligence Dashboard
            </h1>
            <p class="text-xs text-charcoal/60 mt-0.5">
              Live tracking of applicants, assessments, business roadmaps, and diagnostics.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              (click)="loadAllData()"
              [disabled]="isLoading"
              class="px-4 py-2 rounded-button bg-white border border-forest-line/20 hover:border-gold text-xs font-semibold text-charcoal shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>{{ isLoading ? 'Refreshing...' : 'Refresh Live Data' }}</span>
            </button>
          </div>
        </div>

        <!-- ================= STATS KPI CARDS ================= -->
        <div *ngIf="stats" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          
          <div class="bg-white p-5 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">Total Applicants</span>
            <p class="text-3xl font-serif font-bold text-charcoal">{{ stats.kpis.totalApplicants }}</p>
            <p class="text-[10px] text-emerald-600 font-semibold">Registered founders</p>
          </div>

          <div class="bg-white p-5 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">Assessments</span>
            <p class="text-3xl font-serif font-bold text-forest">{{ stats.kpis.totalAssessments }}</p>
            <p class="text-[10px] text-forest font-semibold">Completed questionnaires</p>
          </div>

          <div class="bg-white p-5 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">Mean Readiness</span>
            <p class="text-3xl font-serif font-bold text-gold">{{ stats.kpis.avgReadinessScore }}<span class="text-base text-charcoal/40 font-normal">/100</span></p>
            <p class="text-[10px] text-gold font-semibold">5-pillar startup index</p>
          </div>

          <div class="bg-white p-5 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">Active Roadmaps</span>
            <p class="text-3xl font-serif font-bold text-charcoal">{{ stats.kpis.totalJourneys }}</p>
            <p class="text-[10px] text-charcoal/60">30-day tracking launched</p>
          </div>

          <div class="bg-white p-5 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">Avg Journey Progress</span>
            <p class="text-3xl font-serif font-bold text-emerald-600">{{ stats.kpis.avgJourneyProgress }}%</p>
            <p class="text-[10px] text-emerald-600 font-semibold">{{ stats.kpis.completedJourneys }} finished</p>
          </div>

          <div class="bg-white p-5 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">Growth Intakes</span>
            <p class="text-3xl font-serif font-bold text-indigo-600">{{ stats.kpis.totalGrowIntakes }}</p>
            <p class="text-[10px] text-indigo-600 font-semibold">Business Compass</p>
          </div>

        </div>

        <!-- ================= TAB NAVIGATION ================= -->
        <div class="border-b border-forest-line/15 flex items-center gap-2 overflow-x-auto pb-px">
          <button
            (click)="currentTab = 'OVERVIEW'"
            [ngClass]="{
              'border-b-2 border-gold text-forest font-bold bg-forest/5': currentTab === 'OVERVIEW',
              'text-charcoal/60 hover:text-charcoal': currentTab !== 'OVERVIEW'
            }"
            class="px-5 py-3 text-xs uppercase tracking-wider rounded-t transition-all flex items-center gap-2"
          >
            <span>📊</span>
            <span>Analytics Overview</span>
          </button>

          <button
            (click)="currentTab = 'APPLICATIONS'"
            [ngClass]="{
              'border-b-2 border-gold text-forest font-bold bg-forest/5': currentTab === 'APPLICATIONS',
              'text-charcoal/60 hover:text-charcoal': currentTab !== 'APPLICATIONS'
            }"
            class="px-5 py-3 text-xs uppercase tracking-wider rounded-t transition-all flex items-center gap-2"
          >
            <span>📝</span>
            <span>All Applications ({{ applications.length }})</span>
          </button>

          <button
            (click)="currentTab = 'APPLICANTS'"
            [ngClass]="{
              'border-b-2 border-gold text-forest font-bold bg-forest/5': currentTab === 'APPLICANTS',
              'text-charcoal/60 hover:text-charcoal': currentTab !== 'APPLICANTS'
            }"
            class="px-5 py-3 text-xs uppercase tracking-wider rounded-t transition-all flex items-center gap-2"
          >
            <span>👥</span>
            <span>Applicants & Founders ({{ applicants.length }})</span>
          </button>

          <button
            (click)="currentTab = 'JOURNEYS'"
            [ngClass]="{
              'border-b-2 border-gold text-forest font-bold bg-forest/5': currentTab === 'JOURNEYS',
              'text-charcoal/60 hover:text-charcoal': currentTab !== 'JOURNEYS'
            }"
            class="px-5 py-3 text-xs uppercase tracking-wider rounded-t transition-all flex items-center gap-2"
          >
            <span>🚀</span>
            <span>30-Day Roadmaps ({{ journeys.length }})</span>
          </button>

          <button
            (click)="currentTab = 'GROWTH'"
            [ngClass]="{
              'border-b-2 border-gold text-forest font-bold bg-forest/5': currentTab === 'GROWTH',
              'text-charcoal/60 hover:text-charcoal': currentTab !== 'GROWTH'
            }"
            class="px-5 py-3 text-xs uppercase tracking-wider rounded-t transition-all flex items-center gap-2"
          >
            <span>📈</span>
            <span>Growth Diagnostics ({{ growIntakes.length }})</span>
          </button>
        </div>

        <!-- ================= TAB 1: ANALYTICS OVERVIEW ================= -->
        <div *ngIf="currentTab === 'OVERVIEW' && stats" class="space-y-8 animate-fadeIn">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Archetype Breakdown -->
            <div class="bg-white p-6 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-4">
              <h3 class="font-serif font-bold text-base text-charcoal flex items-center justify-between">
                <span>Archetypes Distribution</span>
                <span class="text-xs text-gold">15-Strength Model</span>
              </h3>

              <div class="space-y-3 pt-2">
                <div *ngFor="let item of stats.archetypes" class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-charcoal">{{ item.name }}</span>
                    <span class="text-charcoal/60">{{ item.count }} ({{ item.percentage }}%)</span>
                  </div>
                  <div class="w-full bg-forest/10 rounded-full h-2 overflow-hidden">
                    <div class="bg-gold h-full rounded-full" [style.width.%]="item.percentage"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Risk Profile Distribution -->
            <div class="bg-white p-6 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-4">
              <h3 class="font-serif font-bold text-base text-charcoal flex items-center justify-between">
                <span>Risk Profiles</span>
                <span class="text-xs text-charcoal/40">Capital Appetite</span>
              </h3>

              <div class="space-y-3 pt-2">
                <div *ngFor="let item of stats.riskProfiles" class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-charcoal">{{ item.name }}</span>
                    <span class="text-charcoal/60">{{ item.count }} ({{ item.percentage }}%)</span>
                  </div>
                  <div class="w-full bg-forest/10 rounded-full h-2 overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      [ngClass]="{
                        'bg-emerald-500': item.name === 'Conservative',
                        'bg-gold': item.name === 'Moderate',
                        'bg-amber-600': item.name === 'Aggressive'
                      }"
                      [style.width.%]="item.percentage"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Matched Categories -->
            <div class="bg-white p-6 rounded-sheet border border-forest-line/15 shadow-light-sm space-y-4">
              <h3 class="font-serif font-bold text-base text-charcoal flex items-center justify-between">
                <span>Top Recommended Sectors</span>
                <span class="text-xs text-charcoal/40">African Niches</span>
              </h3>

              <div class="space-y-2.5 pt-2">
                <div *ngFor="let cat of stats.topCategories; let i = index" class="flex items-center justify-between p-2.5 rounded-button bg-ivory border border-forest-line/10 text-xs">
                  <span class="font-bold text-charcoal">{{ i + 1 }}. {{ cat.name }}</span>
                  <span class="font-semibold text-forest">{{ cat.count }} matches</span>
                </div>
                <div *ngIf="stats.topCategories.length === 0" class="text-xs text-charcoal/40 text-center py-4">
                  No matches computed yet
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- ================= TAB 2: APPLICATIONS LIST ================= -->
        <div *ngIf="currentTab === 'APPLICATIONS'" class="space-y-4 animate-fadeIn">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 shadow-light-sm overflow-hidden">
            <div class="p-4 border-b border-forest-line/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                [(ngModel)]="appSearchQuery"
                placeholder="Search by applicant name, email, or archetype..."
                class="p-2.5 rounded-button border border-forest-line/20 bg-ivory text-xs max-w-sm w-full focus:outline-none focus:border-gold"
              />
              <span class="text-xs text-charcoal/60">Showing {{ filteredApplications.length }} of {{ applications.length }} submissions</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-ivory border-b border-forest-line/10 text-charcoal/70 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="p-3.5">Applicant</th>
                    <th class="p-3.5">Archetype</th>
                    <th class="p-3.5">Readiness Score</th>
                    <th class="p-3.5">Top Recommended Business</th>
                    <th class="p-3.5">AI Insights</th>
                    <th class="p-3.5">Date</th>
                    <th class="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let app of filteredApplications" class="hover:bg-ivory/60 transition-colors">
                    <td class="p-3.5">
                      <p class="font-bold text-charcoal">{{ app.applicantName }}</p>
                      <p class="text-[11px] text-charcoal/60 font-mono">{{ app.applicantEmail }}</p>
                    </td>
                    <td class="p-3.5">
                      <span class="px-2.5 py-1 rounded-pill bg-forest-deep text-gold font-semibold text-[11px]">
                        {{ app.primaryArchetype }}
                      </span>
                    </td>
                    <td class="p-3.5">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-sm text-forest">{{ app.readinessScore }}</span>
                        <span class="text-[10px] text-charcoal/50">/100</span>
                      </div>
                      <span class="text-[10px] text-charcoal/60">{{ app.readinessVerdict }}</span>
                    </td>
                    <td class="p-3.5">
                      <p class="font-bold text-charcoal">{{ app.topMatchName }}</p>
                      <span class="text-[10px] text-charcoal/60">{{ app.topMatchCategory }}</span>
                    </td>
                    <td class="p-3.5">
                      <span *ngIf="app.hasAiInsight" class="px-2 py-0.5 rounded-pill bg-gold/15 text-gold-deep text-[10px] font-bold">
                        Gemini 3.6
                      </span>
                      <span *ngIf="!app.hasAiInsight" class="text-charcoal/40 text-[10px]">Standard</span>
                    </td>
                    <td class="p-3.5 text-charcoal/60">
                      {{ app.createdAt | date:'short' }}
                    </td>
                    <td class="p-3.5 text-right">
                      <button
                        (click)="inspectApplication(app.id)"
                        class="px-3 py-1.5 rounded-button bg-forest hover:bg-forest-deep text-gold font-semibold text-[11px] transition-colors"
                      >
                        Inspect Details →
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="filteredApplications.length === 0">
                    <td colspan="7" class="p-8 text-center text-charcoal/50">
                      No applications match the search criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ================= TAB 3: APPLICANTS & USERS ================= -->
        <div *ngIf="currentTab === 'APPLICANTS'" class="space-y-4 animate-fadeIn">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 shadow-light-sm overflow-hidden">
            <div class="p-4 border-b border-forest-line/10 flex justify-between items-center">
              <span class="font-serif font-bold text-base text-charcoal">Registered Entrepreneurs Directory</span>
              <span class="text-xs text-charcoal/60">{{ applicants.length }} Registered Accounts</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-ivory border-b border-forest-line/10 text-charcoal/70 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="p-3.5">Name</th>
                    <th class="p-3.5">Role</th>
                    <th class="p-3.5">Phone / Contact</th>
                    <th class="p-3.5">Country / Lang</th>
                    <th class="p-3.5">Assessments</th>
                    <th class="p-3.5">Active Roadmaps</th>
                    <th class="p-3.5">Member Since</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let user of applicants" class="hover:bg-ivory/60 transition-colors">
                    <td class="p-3.5">
                      <p class="font-bold text-charcoal">{{ user.name }}</p>
                      <p class="text-[11px] text-charcoal/60 font-mono">{{ user.email }}</p>
                    </td>
                    <td class="p-3.5">
                      <span
                        class="px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase"
                        [ngClass]="{
                          'bg-gold text-charcoal': user.role === 'super_admin',
                          'bg-forest/10 text-forest': user.role !== 'super_admin'
                        }"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="p-3.5 text-charcoal/70 font-mono">
                      {{ user.phone || '—' }}
                    </td>
                    <td class="p-3.5 text-charcoal/70">
                      {{ user.country }} ({{ user.language.toUpperCase() }})
                    </td>
                    <td class="p-3.5 font-bold text-forest">
                      {{ user.assessmentsCount }}
                    </td>
                    <td class="p-3.5 font-bold text-charcoal">
                      {{ user.journeysCount }}
                    </td>
                    <td class="p-3.5 text-charcoal/60">
                      {{ user.createdAt | date:'mediumDate' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ================= TAB 4: 30-DAY JOURNEYS & PROGRESS ================= -->
        <div *ngIf="currentTab === 'JOURNEYS'" class="space-y-4 animate-fadeIn">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 shadow-light-sm overflow-hidden">
            <div class="p-4 border-b border-forest-line/10 flex justify-between items-center">
              <span class="font-serif font-bold text-base text-charcoal">Active 30-Day Execution Roadmaps</span>
              <span class="text-xs text-charcoal/60">{{ journeys.length }} Entrepreneurs In Execution</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-ivory border-b border-forest-line/10 text-charcoal/70 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="p-3.5">Entrepreneur</th>
                    <th class="p-3.5">Target Business</th>
                    <th class="p-3.5">Progress</th>
                    <th class="p-3.5">Tasks Completed</th>
                    <th class="p-3.5">Status</th>
                    <th class="p-3.5">Last Active</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let j of journeys" class="hover:bg-ivory/60 transition-colors">
                    <td class="p-3.5">
                      <p class="font-bold text-charcoal">{{ j.applicantName }}</p>
                      <p class="text-[11px] text-charcoal/60 font-mono">{{ j.applicantEmail }}</p>
                    </td>
                    <td class="p-3.5 font-bold text-forest">
                      {{ j.businessName }}
                    </td>
                    <td class="p-3.5 w-48">
                      <div class="space-y-1">
                        <div class="flex items-center justify-between text-[11px]">
                          <span class="font-bold text-charcoal">{{ j.progressPercentage }}%</span>
                        </div>
                        <div class="w-full bg-forest/10 rounded-full h-2 overflow-hidden">
                          <div class="bg-gold h-full rounded-full" [style.width.%]="j.progressPercentage"></div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3.5 font-mono">
                      {{ j.completedTasks }} / {{ j.totalTasks }}
                    </td>
                    <td class="p-3.5">
                      <span *ngIf="j.isCompleted" class="px-2.5 py-1 rounded-pill bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Completed ✓
                      </span>
                      <span *ngIf="!j.isCompleted" class="px-2.5 py-1 rounded-pill bg-amber-100 text-amber-800 font-bold text-[10px]">
                        In Progress
                      </span>
                    </td>
                    <td class="p-3.5 text-charcoal/60">
                      {{ j.updatedAt | date:'short' }}
                    </td>
                  </tr>
                  <tr *ngIf="journeys.length === 0">
                    <td colspan="6" class="p-8 text-center text-charcoal/50">
                      No active roadmaps started yet. Once users click "Start My Journey" in Pathfinder, they will display here.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ================= TAB 5: GROWTH INTAKES ================= -->
        <div *ngIf="currentTab === 'GROWTH'" class="space-y-4 animate-fadeIn">
          
          <div class="bg-white rounded-sheet border border-forest-line/15 shadow-light-sm overflow-hidden">
            <div class="p-4 border-b border-forest-line/10 flex justify-between items-center">
              <span class="font-serif font-bold text-base text-charcoal">Business Compass — Diagnostics Intakes</span>
              <span class="text-xs text-charcoal/60">{{ growIntakes.length }} Operating Businesses</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-ivory border-b border-forest-line/10 text-charcoal/70 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="p-3.5">Owner / Contact</th>
                    <th class="p-3.5">Business Sector</th>
                    <th class="p-3.5">Operating Duration</th>
                    <th class="p-3.5">Monthly Sales Band</th>
                    <th class="p-3.5">Core Challenge</th>
                    <th class="p-3.5">Submitted</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-forest-line/10">
                  <tr *ngFor="let intake of growIntakes" class="hover:bg-ivory/60 transition-colors">
                    <td class="p-3.5">
                      <p class="font-bold text-charcoal">{{ intake.applicantName }}</p>
                      <p class="text-[11px] text-charcoal/60 font-mono">{{ intake.applicantEmail }}</p>
                    </td>
                    <td class="p-3.5 font-bold text-forest">
                      {{ intake.businessType }}
                    </td>
                    <td class="p-3.5 text-charcoal/70">
                      {{ intake.operatingDuration }}
                    </td>
                    <td class="p-3.5 font-mono text-charcoal">
                      {{ intake.monthlySalesRange }}
                    </td>
                    <td class="p-3.5 max-w-xs text-charcoal/80">
                      {{ intake.biggestChallenge }}
                    </td>
                    <td class="p-3.5 text-charcoal/60">
                      {{ intake.createdAt | date:'short' }}
                    </td>
                  </tr>
                  <tr *ngIf="growIntakes.length === 0">
                    <td colspan="6" class="p-8 text-center text-charcoal/50">
                      No growth diagnostic intakes recorded yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

      <!-- ================= DEEP APPLICATION INSPECTOR MODAL ================= -->
      <div *ngIf="inspectingApp" class="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
        <div class="bg-white rounded-sheet max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-forest-line/20 shadow-2xl space-y-6 p-6 sm:p-8">
          
          <div class="flex items-start justify-between border-b border-forest-line/10 pb-4">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-widest text-gold">Deep Application Inspection</span>
              <h2 class="text-2xl font-serif font-bold text-charcoal">
                {{ inspectingApp.user?.name || 'Applicant' }} ({{ inspectingApp.result.primaryArchetype }})
              </h2>
              <p class="text-xs text-charcoal/60">
                Email: {{ inspectingApp.user?.email || inspectingApp.result.userId }} · Submitted: {{ inspectingApp.result.createdAt | date:'medium' }}
              </p>
            </div>
            <button
              (click)="inspectingApp = null"
              class="w-8 h-8 rounded-full bg-ivory border border-forest-line/20 flex items-center justify-center text-charcoal/60 hover:text-charcoal font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Readiness & Archetype Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-ivory p-4 rounded-card border border-forest-line/10">
            <div>
              <span class="text-[10px] uppercase text-charcoal/50 font-bold">Readiness Score</span>
              <p class="text-2xl font-serif font-bold text-forest">{{ inspectingApp.result.readinessScore }} / 100</p>
              <p class="text-[11px] text-charcoal/60">{{ inspectingApp.result.readinessVerdict }}</p>
            </div>
            <div>
              <span class="text-[10px] uppercase text-charcoal/50 font-bold">Secondary Archetype</span>
              <p class="text-lg font-bold text-charcoal">{{ inspectingApp.result.secondaryArchetype }}</p>
              <p class="text-[11px] text-charcoal/60">Risk: {{ inspectingApp.result.riskProfile }}</p>
            </div>
            <div>
              <span class="text-[10px] uppercase text-charcoal/50 font-bold">Top Match</span>
              <p class="text-lg font-bold text-gold-deep">{{ inspectingApp.result.topMatches?.[0]?.name }}</p>
              <p class="text-[11px] text-charcoal/60">{{ inspectingApp.result.topMatches?.[0]?.category }}</p>
            </div>
          </div>

          <!-- Gemini AI Strategic Advisory (if present) -->
          <div *ngIf="inspectingApp.result.aiInsight" class="bg-forest-deep p-6 rounded-card border border-forest-line text-ivory space-y-4">
            <div class="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
              <span>✨ Gemini 3.6 Flash Strategic Briefing</span>
            </div>
            <p class="text-xs text-ivory/90 leading-relaxed font-normal">
              {{ inspectingApp.result.aiInsight.executiveBrief }}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ivory/80 pt-1">
              <div class="bg-forest p-3 rounded border border-forest-line/30">
                <span class="text-gold font-bold block mb-1">Local African Advantage:</span>
                {{ inspectingApp.result.aiInsight.localCompetitiveEdge }}
              </div>
              <div class="bg-forest p-3 rounded border border-forest-line/30">
                <span class="text-gold font-bold block mb-1">Risk Shield:</span>
                {{ inspectingApp.result.aiInsight.riskShield }}
              </div>
            </div>
          </div>

          <!-- Top Strengths Breakdown -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-sm text-charcoal">Top Strengths Profile (0 - 100)</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div *ngFor="let s of inspectingApp.result.topStrengths" class="p-3 bg-ivory rounded border border-forest-line/10 text-xs">
                <div class="flex justify-between font-bold">
                  <span>{{ s.name }}</span>
                  <span class="text-forest">{{ s.score }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Raw Questionnaire Answers -->
          <div *ngIf="inspectingApp.assessment" class="space-y-3 pt-2 border-t border-forest-line/10">
            <h4 class="font-serif font-bold text-sm text-charcoal">Canonical Answers Submitted (22 Questions)</h4>
            <div class="bg-ivory p-4 rounded-card border border-forest-line/10 max-h-56 overflow-y-auto font-mono text-[11px] text-charcoal/80 space-y-1">
              <div *ngFor="let entry of inspectingApp.assessment.answers | keyvalue" class="flex justify-between border-b border-forest-line/5 py-1">
                <span class="text-forest font-bold">{{ entry.key }}:</span>
                <span class="text-charcoal">{{ formatAnswerVal(entry.value) }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button
              (click)="inspectingApp = null"
              class="px-5 py-2 rounded-button bg-forest text-gold text-xs font-semibold"
            >
              Close Inspection
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class AdminPortalComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  router = inject(Router);

  // Authentication & 2FA State
  loginEmail = '';
  loginPassword = '';
  selectedChannel: 'email' | 'sms' = 'email';
  isSubmitting = false;
  loginError = '';

  stepTwoRequired = false;
  twoFactorInfo: { userId: string; email: string; phone: string; channel: string; previewOtp?: string } = {
    userId: '',
    email: '',
    phone: '',
    channel: 'email',
  };
  otpCode = '';

  // Portal Data State
  currentTab: AdminTab = 'OVERVIEW';
  isLoading = false;
  stats: AdminStatsResponse | null = null;
  applicants: AdminApplicantItem[] = [];
  applications: AdminApplicationItem[] = [];
  journeys: AdminJourneyItem[] = [];
  growIntakes: AdminGrowIntakeItem[] = [];

  appSearchQuery = '';
  inspectingApp: any = null;

  ngOnInit() {
    if (this.auth.isSuperAdmin()) {
      this.loadAllData();
    }
  }

  onInitiateLogin(event: Event) {
    event.preventDefault();
    this.loginError = '';
    this.isSubmitting = true;

    this.auth.login(this.loginEmail, this.loginPassword, this.selectedChannel).subscribe({
      next: res => {
        this.isSubmitting = false;
        if (res.requires2FA) {
          this.stepTwoRequired = true;
          this.twoFactorInfo = {
            userId: res.userId,
            email: res.email,
            phone: res.phone,
            channel: res.channel,
            previewOtp: res.previewOtp,
          };
          this.otpCode = '';
        } else if (res.user?.role === 'super_admin') {
          this.loadAllData();
        } else {
          this.loginError = 'Access denied. Account does not have super_admin privileges.';
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.loginError = err.error?.message || 'Invalid admin credentials.';
      }
    });
  }

  onVerifyOtp() {
    if (this.otpCode.length < 6) return;
    this.loginError = '';
    this.isSubmitting = true;

    this.auth.verify2FA(this.twoFactorInfo.userId, this.otpCode).subscribe({
      next: res => {
        this.isSubmitting = false;
        if (res.user?.role === 'super_admin') {
          this.loadAllData();
        } else {
          this.loginError = 'Verification succeeded but user is not super_admin.';
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.loginError = err.error?.message || 'Invalid or expired 6-digit OTP code.';
      }
    });
  }

  resendOtp() {
    this.auth.resend2FA(this.twoFactorInfo.userId, this.twoFactorInfo.channel as any).subscribe({
      next: res => {
        this.twoFactorInfo.previewOtp = res.previewOtp;
        alert(`New OTP code generated via ${this.twoFactorInfo.channel.toUpperCase()}!`);
      }
    });
  }

  logoutAdmin() {
    this.auth.logout();
    this.stepTwoRequired = false;
    this.router.navigate(['/']);
  }

  loadAllData() {
    this.isLoading = true;

    this.api.getAdminStats().subscribe({
      next: stats => { this.stats = stats; },
      error: err => console.error('Error fetching admin stats', err)
    });

    this.api.getAdminApplicants().subscribe({
      next: applicants => { this.applicants = applicants; },
      error: err => console.error('Error fetching applicants', err)
    });

    this.api.getAdminApplications().subscribe({
      next: apps => {
        this.applications = apps;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching applications', err);
        this.isLoading = false;
      }
    });

    this.api.getAdminJourneys().subscribe({
      next: journeys => { this.journeys = journeys; },
      error: err => console.error('Error fetching journeys', err)
    });

    this.api.getAdminGrowIntakes().subscribe({
      next: intakes => { this.growIntakes = intakes; },
      error: err => console.error('Error fetching growth intakes', err)
    });
  }

  get filteredApplications(): AdminApplicationItem[] {
    if (!this.appSearchQuery.trim()) return this.applications;
    const q = this.appSearchQuery.toLowerCase();
    return this.applications.filter(a =>
      a.applicantName.toLowerCase().includes(q) ||
      a.applicantEmail.toLowerCase().includes(q) ||
      a.primaryArchetype.toLowerCase().includes(q) ||
      a.topMatchName.toLowerCase().includes(q)
    );
  }

  inspectApplication(id: string) {
    this.api.getAdminApplicationDetail(id).subscribe({
      next: res => {
        this.inspectingApp = res;
      },
      error: err => {
        console.error('Error fetching application detail', err);
      }
    });
  }

  formatAnswerVal(val: any): string {
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }
}
