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
    let focusAreaSw = 'Mtiririko wa Fedha na Bei ya Bidhaa';
    let recommendations = [
      'Separate business funds from personal mobile money immediately.',
      'Stop extending unchecked credit (deni) to friends and family.',
      'Recalculate your true product unit cost including transport and packaging.',
    ];
    let recommendationsSw = [
      'Tenga fedha za biashara na fedha binafsi za M-Pesa mara moja.',
      'Acha kutoa madeni holela bila makubaliano rasmi kwa jamaa na marafiki.',
      'Piga hesabu upya ya gharama halisi ya kila bidhaa ikijumuisha nauli na vifungashio.',
    ];
    let nextStep = 'Audit your last 30 days of sales receipts and calculate your exact gross profit margin.';
    let nextStepSw = 'Kagua risiti na rekodi zako za mauzo ya siku 30 zilizopita na upige hesabu ya faida halisi.';

    const challenge = data.biggestChallenge.toLowerCase();
    if (challenge.includes('customer') || challenge.includes('sales') || challenge.includes('wateja') || challenge.includes('mauzo')) {
      focusArea = 'Customer Acquisition & Repeat Retention';
      focusAreaSw = 'Kuvutia Wateja Wapya na Kudumisha Wateja wa Zamani';
      recommendations = [
        'Collect phone numbers for a weekly VIP WhatsApp broadcast list.',
        'Offer an irresistible bundle offer to reignite dormant past customers.',
        'Ask every satisfied customer for a direct referral before they leave.',
      ];
      recommendationsSw = [
        'Kusanya nambari za simu za wateja kwa ajili ya orodha ya matangazo ya WhatsApp kila wiki.',
        'Toa ofa maalum ya kifurushi ili kuwarejesha wateja ambao hawajanunua kwa muda mrefu.',
        'Muombe kila mteja aliyeridhika akuletee mteja mwingine kabla ya kuondoka.',
      ];
      nextStep = 'Send a personal check-in message to 10 past clients offering a limited 48-hour return perk.';
      nextStepSw = 'Tuma ujumbe wa kibinafsi kwa wateja 10 wa zamani ukiwapa punguzo maalum la saa 48.';
    } else if (challenge.includes('capital') || challenge.includes('cash flow') || challenge.includes('mtaji') || challenge.includes('fedha')) {
      focusArea = 'Working Capital & Inventory Turn';
      focusAreaSw = 'Mtaji wa Uendeshaji na Mzunguko wa Bidhaa';
      recommendations = [
        'Liquidate slow-moving dust-gathering stock at cost to free up immediate liquidity.',
        'Negotiate 14-day supplier settlement terms instead of immediate upfront cash purchases.',
        'Build a dedicated emergency fund account with 10% of daily gross profits.',
      ];
      recommendationsSw = [
        'Uza bidhaa zilizokaa muda mrefu dukani kwa bei ya kununua ili kupata fedha taslimu mara moja.',
        'Zungumza na wasambazaji wakupe muda wa siku 14 kulipia badala ya kulipa fedha taslimu papo hapo.',
        'Weka akiba ya asilimia 10 ya faida ya kila siku kwenye akaunti maalum ya dharura.',
      ];
      nextStep = 'Identify your 3 slowest-moving stock items and run a clearance flash sale this Saturday.';
      nextStepSw = 'Tambua bidhaa 3 zinazotembea polepole zaidi dukani na ufanye mnada maalum Jumamosi hii.';
    } else if (challenge.includes('staff') || challenge.includes('operations') || challenge.includes('wafanyakazi') || challenge.includes('uendeshaji')) {
      focusArea = 'Systems, Delegation & Operational Discipline';
      focusAreaSw = 'Mifumo ya Biashara, Usimamizi na Nidhamu ya Kazi';
      recommendations = [
        'Document a 1-page daily opening and closing checklist for your team.',
        'Switch employee compensation from flat salaries to performance-based commission bonuses.',
        'Institute a mandatory daily end-of-day stock count reconciliation.',
      ];
      recommendationsSw = [
        'Andika orodha ya ukurasa 1 ya majukumu ya asubuhi na jioni kwa timu yako.',
        'Wape wafanyakazi motisha ya kamisheni kulingana na mauzo badala ya mshahara uliodumu bila malengo.',
        'Weka utaratibu wa lazima wa kuhesabu mzigo na kufunga hesabu kila siku kabla ya kufunga duka.',
      ];
      nextStep = 'Write down the 5 daily tasks you should delegate to staff by Monday morning.';
      nextStepSw = 'Andika kazi 5 za kila siku unazopaswa kuwakabidhi wafanyakazi kufikia Jumatatu asubuhi.';
    }

    return {
      focusArea,
      focusAreaSw,
      verdict: `Diagnostic for ${data.businessType} (${data.operatingDuration})`,
      verdictSw: `Tathmini ya ${data.businessType} (${data.operatingDuration})`,
      recommendations,
      recommendationsSw,
      concreteFirstStep: nextStep,
      concreteFirstStepSw: nextStepSw,
    };
  }

  async getRecentIntakes(userId?: string) {
    const filter = userId ? { userId } : {};
    return this.growModel.find(filter).sort({ createdAt: -1 }).limit(10).exec();
  }
}
