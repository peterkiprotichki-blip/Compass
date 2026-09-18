import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssessmentDocument = Assessment & Document;

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ type: String, default: null })
  userId?: string;

  @Prop({ type: Object, required: true })
  answers: Record<string, any>; // maps question ID (q1, q2... q22) to answers

  @Prop({ default: '1.0' })
  version: string;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
