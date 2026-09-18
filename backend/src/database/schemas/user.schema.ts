import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, default: null })
  passwordHash?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ default: 'Kenya' })
  country: string;

  @Prop({ default: 'Urban' })
  locationType: string;

  @Prop({ type: String, default: null })
  googleId?: string;

  @Prop({ type: String, default: null })
  avatarUrl?: string;

  @Prop({ default: 'local' })
  authProvider: string; // 'local' | 'google'

  @Prop({ default: 'user' })
  role: string; // 'user' | 'super_admin'

  @Prop({ type: String, default: null })
  phone?: string;

  @Prop({ type: String, default: null })
  twoFactorOtp?: string;

  @Prop({ type: Date, default: null })
  twoFactorExpires?: Date;

  @Prop({ type: String, default: 'email' })
  twoFactorChannel?: string; // 'email' | 'sms'

  @Prop({ type: [String], default: [] })
  savedPaths: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
