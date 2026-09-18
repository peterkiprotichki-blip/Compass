import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JourneyDocument = Journey & Document;

export interface JourneyWeekProgress {
  week: number;
  title: string;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

@Schema({ timestamps: true })
export class Journey {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  businessName: string;

  @Prop({ default: 0 })
  progressPercentage: number;

  @Prop({ type: Array, required: true })
  weeks: JourneyWeekProgress[];

  @Prop({ default: false })
  isCompleted: boolean;
}

export const JourneySchema = SchemaFactory.createForClass(Journey);
