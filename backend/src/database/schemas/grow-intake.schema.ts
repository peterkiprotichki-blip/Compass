import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GrowIntakeDocument = GrowIntake & Document;

@Schema({ timestamps: true })
export class GrowIntake {
  @Prop({ type: String, default: null })
  userId?: string;

  @Prop({ required: true })
  businessType: string;

  @Prop({ required: true })
  operatingDuration: string; // <6 months, 6-12 months, 1-3 years, 3+ years

  @Prop({ required: true })
  monthlySalesRange: string; // Under 50k, 50k-200k, 200k-500k, Above 500k

  @Prop({ required: true })
  biggestChallenge: string; // Access to capital, Customer acquisition, Cash flow & debt, Operations & staff, Pricing & margins

  @Prop({ type: Object, default: {} })
  diagnostics: Record<string, any>;
}

export const GrowIntakeSchema = SchemaFactory.createForClass(GrowIntake);
