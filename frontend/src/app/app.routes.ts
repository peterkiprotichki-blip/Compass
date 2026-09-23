import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing.component';
import { PathfinderWizardComponent } from './pages/pathfinder/pathfinder.component';
import { BusinessDetailPageComponent } from './pages/business-detail/business-detail.component';
import { JourneyTrackerPageComponent } from './pages/journey-tracker/journey-tracker.component';
import { GrowBusinessComponent } from './pages/grow-business/grow-business.component';
import { LearnComponent } from './pages/learn/learn.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminPortalComponent } from './pages/admin/admin-portal.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'pathfinder', component: PathfinderWizardComponent },
  { path: 'business/:slug', component: BusinessDetailPageComponent },
  { path: 'journey/:id', component: JourneyTrackerPageComponent },
  { path: 'grow-business', component: GrowBusinessComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminPortalComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: '**', redirectTo: '' }
];
