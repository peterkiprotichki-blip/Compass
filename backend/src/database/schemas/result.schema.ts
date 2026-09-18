import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

export interface StrengthProfileItem {
  name: string;
  nameSw: string;
  score: number;
  description: string;
}

export interface ReadinessPillar {
  pillar: string;
  score: number; // out of 20
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

@Schema({ timestamps: true })
export class Result {
  @Prop({ required: true })
  assessmentId: string;

  @Prop({ type: String, default: null })
  userId?: string;

  @Prop({ required: true })
  primaryArchetype: string;

  @Prop({ required: true })
  primaryArchetypeSw: string;

  @Prop({ required: true })
  secondaryArchetype: string;

  @Prop({ required: true })
  secondaryArchetypeSw: string;

  @Prop({ required: true })
  archetypeSummary: string;

  @Prop({ type: [String], required: true })
  traitPills: string[];

  @Prop({ type: Array, required: true })
  topStrengths: StrengthProfileItem[];

  @Prop({ required: true })
  riskProfile: string; // Conservative, Moderate, Aggressive

  @Prop({ required: true })
  readinessScore: number; // 0 - 100

  @Prop({ required: true })
  readinessVerdict: string; // Ready to start, Almost ready, Needs preparation, Focus on skills first

  @Prop({ type: Array, required: true })
  readinessPillars: ReadinessPillar[];

  @Prop({ type: Array, required: true })
  topMatches: BusinessMatchItem[];

  @Prop({ type: [String], required: true })
  commonBlindSpots: string[];

  @Prop({ type: [String], required: true })
  skillsToLearn: string[];

  @Prop({ type: Object, required: true })
  capitalAllocationGuide: {
    inventory: number;
    marketing: number;
    emergencyFund: number;
    operations: number;
  };

  @Prop({ type: Object, default: null })
  aiInsight?: {
    executiveBrief: string;
    localCompetitiveEdge: string;
    dayOneActionChecklist: string[];
    riskShield: string;
  };
}

export const ResultSchema = SchemaFactory.createForClass(Result);
