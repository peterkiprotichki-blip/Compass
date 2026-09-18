import { Injectable, signal } from '@angular/core';

export type LanguageCode = 'en' | 'sw';

export interface LanguageTranslations {
  // Navigation
  navHome: string;
  navAbout: string;
  navHowItWorks: string;
  navResources: string;
  navPricing: string;
  navGetStarted: string;
  navDashboard: string;
  navSavedPaths: string;

  // Actions
  btnStartMyBusiness: string;
  btnGrowMyBusiness: string;
  btnNext: string;
  btnBack: string;
  btnContinue: string;
  btnSubmit: string;
  btnViewFullResults: string;
  btnStartMyJourney: string;
  btnSaveThisPath: string;
  btnSaved: string;
  btnDownloadPlan: string;
  btnExploreResources: string;
  btnViewDetails: string;

  // Headers
  stepPrefix: string;
  stepOf: string;
  selectOption: string;
  selectUpTo3: string;
  analyzingTitle: string;
  resultsTitle: string;
  archetypeTitle: string;
  readinessTitle: string;
  topStrengthsTitle: string;
  topMatchesTitle: string;
  blindSpotsTitle: string;
  skillsToLearnTitle: string;
  capitalGuideTitle: string;
  actionPlanTitle: string;
}

const EN_TRANSLATIONS: LanguageTranslations = {
  navHome: 'Home',
  navAbout: 'About',
  navHowItWorks: 'How It Works',
  navResources: 'Resources',
  navPricing: 'Pricing',
  navGetStarted: 'Get Started',
  navDashboard: 'Dashboard',
  navSavedPaths: 'Saved Paths',

  btnStartMyBusiness: 'Start My Business',
  btnGrowMyBusiness: 'Grow My Business',
  btnNext: 'Next',
  btnBack: 'Back',
  btnContinue: 'Continue',
  btnSubmit: 'Submit Answers',
  btnViewFullResults: 'View Full Results',
  btnStartMyJourney: 'Start My Journey',
  btnSaveThisPath: 'Save This Path',
  btnSaved: 'Saved to Profile',
  btnDownloadPlan: 'Download My Plan',
  btnExploreResources: 'Explore Resources',
  btnViewDetails: 'View Full Details',

  stepPrefix: 'Step',
  stepOf: 'of',
  selectOption: 'Select one option',
  selectUpTo3: 'Select up to 3 options',
  analyzingTitle: 'Analysing your profile...',
  resultsTitle: 'Your Pathfinder Results',
  archetypeTitle: 'Entrepreneur Archetype',
  readinessTitle: 'Business Readiness Score',
  topStrengthsTitle: 'Your Top Strengths Profile',
  topMatchesTitle: 'Your Top Matched Business Paths',
  blindSpotsTitle: 'Common Blind Spots to Watch',
  skillsToLearnTitle: 'Key Skills to Build for Success',
  capitalGuideTitle: 'Startup Capital Allocation Guide',
  actionPlanTitle: 'Your 30-Day Launch Roadmap',
};

const SW_TRANSLATIONS: LanguageTranslations = {
  navHome: 'Nyumbani',
  navAbout: 'Kuhusu Sisi',
  navHowItWorks: 'Jinsi Inavyofanya Kazi',
  navResources: 'Nyenzo na Mafunzo',
  navPricing: 'Gharama',
  navGetStarted: 'Anza Sasa',
  navDashboard: 'Dashibodi',
  navSavedPaths: 'Fursa Zilizohifadhiwa',

  btnStartMyBusiness: 'Kuanzisha Biashara',
  btnGrowMyBusiness: 'Kukuza Biashara Yangu',
  btnNext: 'Mbele',
  btnBack: 'Nyuma',
  btnContinue: 'Endelea',
  btnSubmit: 'Tuma Majibu',
  btnViewFullResults: 'Tazama Matokeo Kamili',
  btnStartMyJourney: 'Anza Safari Yangu',
  btnSaveThisPath: 'Hifadhi Fursa Hii',
  btnSaved: 'Imehifadhiwa',
  btnDownloadPlan: 'Pakua Mpango Wangu',
  btnExploreResources: 'Gundua Mafunzo',
  btnViewDetails: 'Tazama Maelezo Kamili',

  stepPrefix: 'Hatua',
  stepOf: 'kati ya',
  selectOption: 'Chagua chaguo moja',
  selectUpTo3: 'Chagua hadi chaguzi 3',
  analyzingTitle: 'Tunachambua majibu yako...',
  resultsTitle: 'Matokeo Yako ya Pathfinder',
  archetypeTitle: 'Haiba Yako ya Kiuasiriamali',
  readinessTitle: 'Kiwango cha Utayari wa Kuanza',
  topStrengthsTitle: 'Nguvu Zako Kuu za Asili',
  topMatchesTitle: 'Biashara Zinazokufaa Zaidi',
  blindSpotsTitle: 'Mitego na Changamoto za Kuepuka',
  skillsToLearnTitle: 'Ujuzi Muhimu wa Kujifunza',
  capitalGuideTitle: 'Mwongozo wa Mgawanyo wa Mtaji',
  actionPlanTitle: 'Mpango Kazi wa Siku 30 za Kwanza',
};

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'compass_lang';
  currentLang = signal<LanguageCode>('en');

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as LanguageCode;
    if (saved && (saved === 'en' || saved === 'sw')) {
      this.currentLang.set(saved);
    }
  }

  setLanguage(lang: LanguageCode) {
    this.currentLang.set(lang);
    localStorage.setItem(this.storageKey, lang);
  }

  toggleLanguage() {
    const next = this.currentLang() === 'en' ? 'sw' : 'en';
    this.setLanguage(next);
  }

  get t(): LanguageTranslations {
    return this.currentLang() === 'sw' ? SW_TRANSLATIONS : EN_TRANSLATIONS;
  }

  isSwahili(): boolean {
    return this.currentLang() === 'sw';
  }
}
