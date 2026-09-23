export interface QuestionOption {
  id: string;
  label: string;
  labelSw: string;
  subtitle?: string;
  subtitleSw?: string;
}

export interface QuestionDefinition {
  id: string;
  number: number;
  sectionId: number;
  sectionTitle: string;
  sectionTitleSw: string;
  text: string;
  textSw: string;
  type: 'single' | 'multi' | 'text';
  maxSelect?: number;
  options?: QuestionOption[];
  optional?: boolean;
}

export interface SectionDefinition {
  id: number;
  title: string;
  titleSw: string;
}

export interface QuestionnaireResponse {
  sections: SectionDefinition[];
  questions: QuestionDefinition[];
  totalQuestions: number;
}

export interface WeekPlan {
  week: number;
  title: string;
  tasks: string[];
}

export interface CapitalSplit {
  inventory: number;
  marketing: number;
  operations: number;
  emergencyFund: number;
}

export interface Business {
  _id?: string;
  slug: string;
  name: string;
  nameSw: string;
  category: string;
  categorySw: string;
  description: string;
  descriptionSw: string;
  capitalRequiredMin: number;
  capitalRequiredMax: number;
  capitalBand: string;
  currency: string;
  bestArchetypes: string[];
  idealStrengths: string[];
  locationFit: string[];
  timeCommitment: string;
  difficulty: string;
  riskLevel: string;
  firstCustomerTimeline: string;
  growthPotential: string;
  skillsNeeded: string[];
  whoIsThisBestFor: string;
  whoShouldAvoid: string;
  biggestAdvantage: string;
  biggestRisk: string;
  firstStep: string;
  capitalSplit: CapitalSplit;
  thirtyDayPlan: WeekPlan[];
  imageUrl: string;
}

export interface StrengthProfileItem {
  name: string;
  nameSw: string;
  score: number;
  description: string;
}

export interface ReadinessPillar {
  pillar: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface BusinessMatchItem {
  businessId: string;
  name: string;
  nameSw: string;
  category: string;
  categorySw: string;
  matchScore: number;
  capitalBand: string;
  capitalRequiredMin: number;
  capitalRequiredMax: number;
  riskLevel: string;
  firstCustomerTimeline: string;
  whyItFits: string[];
  biggestAdvantage: string;
  biggestRisk: string;
  firstStep: string;
  imageUrl: string;
}

export interface AiRecommendationInsight {
  executiveBrief: string;
  localCompetitiveEdge: string;
  dayOneActionChecklist: string[];
  riskShield: string;
}

export interface AssessmentResult {
  _id: string;
  assessmentId: string;
  userId?: string;
  primaryArchetype: string;
  primaryArchetypeSw: string;
  secondaryArchetype: string;
  secondaryArchetypeSw: string;
  archetypeSummary: string;
  traitPills: string[];
  topStrengths: StrengthProfileItem[];
  riskProfile: string;
  readinessScore: number;
  readinessVerdict: string;
  readinessPillars: ReadinessPillar[];
  topMatches: BusinessMatchItem[];
  commonBlindSpots: string[];
  skillsToLearn: string[];
  capitalAllocationGuide: CapitalSplit;
  aiInsight?: AiRecommendationInsight;
  createdAt?: string;
}

export interface JourneyTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface JourneyWeek {
  week: number;
  title: string;
  tasks: JourneyTask[];
}

export interface Journey {
  _id: string;
  userId: string;
  businessId: string;
  businessName: string;
  progressPercentage: number;
  weeks: JourneyWeek[];
  isCompleted: boolean;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string; // 'user' | 'super_admin'
  phone?: string;
  language: string;
  country: string;
  savedPaths: string[];
  avatarUrl?: string;
  authProvider?: string;
}

export interface AdminKpiStats {
  totalApplicants: number;
  totalAssessments: number;
  totalJourneys: number;
  completedJourneys: number;
  avgJourneyProgress: number;
  totalGrowIntakes: number;
  avgReadinessScore: number;
}

export interface AdminStatsResponse {
  kpis: AdminKpiStats;
  archetypes: { name: string; count: number; percentage: number }[];
  riskProfiles: { name: string; count: number; percentage: number }[];
  topCategories: { name: string; count: number }[];
}

export interface AdminApplicantItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  country: string;
  language: string;
  authProvider: string;
  assessmentsCount: number;
  journeysCount: number;
  savedPathsCount: number;
  createdAt: string;
}

export interface AdminApplicationItem {
  id: string;
  assessmentId: string;
  userId?: string;
  applicantName: string;
  applicantEmail: string;
  primaryArchetype: string;
  secondaryArchetype: string;
  readinessScore: number;
  readinessVerdict: string;
  riskProfile: string;
  topMatchName: string;
  topMatchCategory: string;
  createdAt: string;
  hasAiInsight: boolean;
}

export interface AdminJourneyItem {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  businessId: string;
  businessName: string;
  progressPercentage: number;
  isCompleted: boolean;
  totalTasks: number;
  completedTasks: number;
  weeks: any[];
  updatedAt: string;
  createdAt: string;
}

export interface AdminGrowIntakeItem {
  id: string;
  applicantName: string;
  applicantEmail: string;
  businessType: string;
  operatingDuration: string;
  monthlySalesRange: string;
  biggestChallenge: string;
  status: string;
  notes?: string;
  createdAt: string;
}
