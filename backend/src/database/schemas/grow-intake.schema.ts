import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GrowIntakeDocument = GrowIntake & Document;

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  department?: string;
}

export interface ItemSold {
  itemName: string;
  quantity: number;
  sellingPrice: number;
  subtotal: number;
  department?: string;
}

export interface DepartmentSale {
  department: string;
  cash: number;
  till: number;
  total: number;
  notes?: string;
}

export interface ExpenseItem {
  category: string;
  amount: number;
  paymentMethod?: string; // 'cash' | 'till'
}

export interface DailyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  sales: number;
  expenses: number;
  estimatedProfit: number;
  cashTotal?: number;
  tillTotal?: number;
  departmentBreakdown?: DepartmentSale[];
  expenseBreakdown?: ExpenseItem[];
  itemsSold?: ItemSold[];
  notes?: string;
  rawText?: string;
  createdAt?: Date;
}

@Schema({ timestamps: true })
export class GrowIntake {
  @Prop({ type: String, default: null })
  userId?: string;

  @Prop({ type: String, default: '' })
  businessName?: string;

  @Prop({ type: String, default: 'Main Branch' })
  branchName?: string;

  @Prop({ type: [String], default: ['CHIPS', 'SHOP', 'BEAUTY', 'SALAD', 'CORN'] })
  departments: string[];

  // 1. Revised Onboarding: Business Basics
  @Prop({ required: true })
  businessType: string;

  @Prop({ required: true })
  operatingDuration: string;

  @Prop({ type: String, default: 'unknown' })
  originalInvestment?: string;

  @Prop({ type: String, default: '1' })
  peopleCount?: string;

  @Prop({ required: true })
  biggestChallenge: string;

  @Prop({ type: String, default: 'Increase daily sales' })
  mostLikeToImprove?: string;

  // Current financial tracking ability
  @Prop({ type: String, default: 'estimate' })
  financialTrackingAbility: string; // yes_regularly, sometimes, estimate, unknown

  // Optional approximate financial information
  @Prop({ type: Object, default: {} })
  optionalFinancials?: {
    monthlySales?: string;
    wages?: string;
    rent?: string;
    utilities?: string;
    loanRepayments?: string;
    recurringExpenses?: string;
    averageStockPurchases?: string;
    cogs?: string;
    knowledgeStatus?: string; // known, approximate, unknown
  };

  // Backward compatibility
  @Prop({ type: String, default: 'Under KES 50,000' })
  monthlySalesRange?: string;

  // 2. Daily Sales & Expense Tracking
  @Prop({ type: Array, default: [] })
  dailyRecords: DailyRecord[];

  // 3. Simple Stock Template
  @Prop({ type: Array, default: [] })
  stockItems: StockItem[];

  // 4. Intelligence, Snapshot & Money Plan
  @Prop({ type: Object, default: {} })
  diagnostics: Record<string, any>;

  @Prop({ type: Object, default: {} })
  snapshot: Record<string, any>;

  @Prop({ type: Object, default: {} })
  moneyPlan: Record<string, any>;

  @Prop({ type: Object, default: {} })
  nextBestStep: Record<string, any>;

  // 5. Free vs KSh 499 Unlock Status
  @Prop({ type: Boolean, default: false })
  isUnlocked: boolean;

  @Prop({ type: Date, default: null })
  unlockedAt?: Date;
}

export const GrowIntakeSchema = SchemaFactory.createForClass(GrowIntake);

