import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrowIntake, GrowIntakeDocument } from '../../database/schemas/grow-intake.schema';

@Injectable()
export class GrowthService {
  constructor(
    @InjectModel(GrowIntake.name) private growModel: Model<GrowIntakeDocument>,
  ) {}

  async submitIntake(data: {
    userId?: string;
    businessType: string;
    operatingDuration: string;
    monthlySalesRange: string;
    biggestChallenge: string;
  }) {
    // Generate tailored diagnostic advice based on biggest hurdle
    const diagnostics = this.generateDiagnostics(data);

    const intake = new this.growModel({
      ...data,
      diagnostics,
    });

    return intake.save();
  }

  private generateDiagnostics(data: {
    businessType: string;
    operatingDuration: string;
    monthlySalesRange: string;
    biggestChallenge: string;
  }) {
    let focusArea = 'Cash Flow & Pricing';
    let recommendations = [
      'Separate business funds from personal mobile money immediately.',
      'Stop extending unchecked credit (deni) to friends and family.',
      'Recalculate your true product unit cost including transport and packaging.',
    ];
    let nextStep = 'Audit your last 30 days of sales receipts and calculate your exact gross profit margin.';

    if (data.biggestChallenge.toLowerCase().includes('customer') || data.biggestChallenge.toLowerCase().includes('sales')) {
      focusArea = 'Customer Acquisition & Repeat Retention';
      recommendations = [
        'Collect phone numbers for a weekly VIP WhatsApp broadcast list.',
        'Offer an irresistible bundle offer to reignite dormant past customers.',
        'Ask every satisfied customer for a direct referral before they leave.',
      ];
      nextStep = 'Send a personal check-in message to 10 past clients offering a limited 48-hour return perk.';
    } else if (data.biggestChallenge.toLowerCase().includes('capital') || data.biggestChallenge.toLowerCase().includes('cash flow')) {
      focusArea = 'Working Capital & Inventory Turn';
      recommendations = [
        'Liquidate slow-moving dust-gathering stock at cost to free up immediate liquidity.',
        'Negotiate 14-day supplier settlement terms instead of immediate upfront cash purchases.',
        'Build a dedicated emergency fund account with 10% of daily gross profits.',
      ];
      nextStep = 'Identify your 3 slowest-moving stock items and run a clearance flash sale this Saturday.';
    } else if (data.biggestChallenge.toLowerCase().includes('staff') || data.biggestChallenge.toLowerCase().includes('operations')) {
      focusArea = 'Systems, Delegation & Operational Discipline';
      recommendations = [
        'Document a 1-page daily opening and closing checklist for your team.',
        'Switch employee compensation from flat salaries to performance-based commission bonuses.',
        'Institute a mandatory daily end-of-day stock count reconciliation.',
      ];
      nextStep = 'Write down the 5 daily tasks you should delegate to staff by Monday morning.';
    }

    return {
      focusArea,
      verdict: `Diagnostic for ${data.businessType} (${data.operatingDuration})`,
      recommendations,
      concreteFirstStep: nextStep,
    };
  }

  async getRecentIntakes(userId?: string) {
    const filter = userId ? { userId } : {};
    return this.growModel.find(filter).sort({ createdAt: -1 }).limit(10).exec();
  }
}
