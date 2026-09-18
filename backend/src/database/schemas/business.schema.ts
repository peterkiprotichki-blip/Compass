import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessDocument = Business & Document;

export interface WeekPlan {
  week: number;
  title: string;
  tasks: string[];
}

export interface CapitalSplit {
  inventory: number; // percentage
  marketing: number;
  operations: number;
  emergencyFund: number;
}

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nameSw: string;

  @Prop({ required: true })
  category: string; // Retail, Food & Beverage, Beauty & Personal Care, Services, Digital, Education, Agriculture, Hospitality, Property & Assets, Technology & Platforms

  @Prop({ required: true })
  categorySw: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  descriptionSw: string;

  @Prop({ required: true })
  capitalRequiredMin: number;

  @Prop({ required: true })
  capitalRequiredMax: number;

  @Prop({ required: true })
  capitalBand: string; // Under 10k, 10k-50k, 50k-100k, 100k-500k, 500k-1M, Above 1M

  @Prop({ default: 'KES' })
  currency: string;

  @Prop({ type: [String], required: true })
  bestArchetypes: string[]; // e.g. ["The Seller", "The Creator"]

  @Prop({ type: [String], required: true })
  idealStrengths: string[]; // 3-5 of the 15 strengths

  @Prop({ type: [String], required: true })
  locationFit: string[]; // Urban, Town, Rural

  @Prop({ required: true })
  timeCommitment: string; // <10h, 10-20h, 20-40h, full-time

  @Prop({ required: true })
  difficulty: string; // Low, Medium, High

  @Prop({ required: true })
  riskLevel: string; // Low, Medium, High

  @Prop({ required: true })
  firstCustomerTimeline: string; // Immediate, Weeks, Months

  @Prop({ required: true })
  growthPotential: string; // Low, Medium, High

  @Prop({ type: [String], required: true })
  skillsNeeded: string[];

  // Editorial fields
  @Prop({ required: true })
  whoIsThisBestFor: string;

  @Prop({ required: true })
  whoShouldAvoid: string;

  @Prop({ required: true })
  biggestAdvantage: string;

  @Prop({ required: true })
  biggestRisk: string;

  @Prop({ required: true })
  firstStep: string;

  @Prop({ type: Object, required: true })
  capitalSplit: CapitalSplit;

  @Prop({ type: Array, required: true })
  thirtyDayPlan: WeekPlan[];

  @Prop({ default: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80' })
  imageUrl: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
