import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GrowIntake,
  GrowIntakeDocument,
  DailyRecord,
  StockItem,
  ItemSold,
} from '../../database/schemas/grow-intake.schema';

@Injectable()
export class GrowthService {
  constructor(
    @InjectModel(GrowIntake.name) private growModel: Model<GrowIntakeDocument>,
  ) {}

  async submitIntake(data: {
    userId?: string;
    businessType: string;
    operatingDuration: string;
    originalInvestment?: string;
    peopleCount?: string;
    biggestChallenge: string;
    mostLikeToImprove?: string;
    financialTrackingAbility?: string; // 'yes_regularly' | 'sometimes' | 'estimate' | 'unknown'
    optionalFinancials?: {
      monthlySales?: string;
      wages?: string;
      rent?: string;
      utilities?: string;
      loanRepayments?: string;
      recurringExpenses?: string;
      averageStockPurchases?: string;
      cogs?: string;
      knowledgeStatus?: string;
    };
    monthlySalesRange?: string;
  }) {
    const trackingAbility = data.financialTrackingAbility || 'estimate';
    const reassurance = this.getReassuranceMessage(trackingAbility);
    const diagnostics = this.generateDiagnostics({
      businessType: data.businessType,
      operatingDuration: data.operatingDuration,
      biggestChallenge: data.biggestChallenge,
      monthlySalesRange: data.monthlySalesRange || data.optionalFinancials?.monthlySales || 'Under KES 50,000',
    });

    const initialSnapshot = this.computeInitialSnapshot();
    const initialMoneyPlan = this.computeMoneyPlan(data, []);
    const initialNextStep = this.computeNextBestStep(data, [], []);

    const intake = new this.growModel({
      ...data,
      financialTrackingAbility: trackingAbility,
      diagnostics: {
        ...diagnostics,
        reassurance,
      },
      snapshot: initialSnapshot,
      moneyPlan: initialMoneyPlan,
      nextBestStep: initialNextStep,
      dailyRecords: [],
      stockItems: [],
      isUnlocked: false,
    });

    return intake.save();
  }

  async getIntake(id: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }
    // Refresh snapshot, money plan and next best step
    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);
    await intake.save();
    return intake;
  }

  async getRecentIntakes(userId?: string) {
    const filter = userId ? { userId } : {};
    return this.growModel.find(filter).sort({ createdAt: -1 }).limit(10).exec();
  }

  async recordDailyTracking(
    id: string,
    recordData: {
      date: string; // YYYY-MM-DD
      sales: number;
      expenses: number;
      itemsSold?: ItemSold[];
      notes?: string;
    },
  ) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    const salesNum = Number(recordData.sales) || 0;
    const expensesNum = Number(recordData.expenses) || 0;
    // Estimated Profit = Sales - Recorded Expenses (Spec: clearly labeled as estimated profit)
    const estimatedProfit = salesNum - expensesNum;

    const newRecord: DailyRecord = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: recordData.date || new Date().toISOString().split('T')[0],
      sales: salesNum,
      expenses: expensesNum,
      estimatedProfit,
      itemsSold: recordData.itemsSold || [],
      notes: recordData.notes || '',
      createdAt: new Date(),
    };

    // Connection to sales: auto-decrement stock if item matches
    const newItemsPrompt: string[] = [];
    if (recordData.itemsSold && recordData.itemsSold.length > 0 && intake.stockItems) {
      for (const itemSold of recordData.itemsSold) {
        const matchingIndex = intake.stockItems.findIndex(
          s => s.name.trim().toLowerCase() === itemSold.itemName.trim().toLowerCase(),
        );
        if (matchingIndex >= 0) {
          intake.stockItems[matchingIndex].quantity = Math.max(
            0,
            intake.stockItems[matchingIndex].quantity - itemSold.quantity,
          );
        } else {
          newItemsPrompt.push(itemSold.itemName);
        }
      }
    }

    intake.dailyRecords.unshift(newRecord);

    // Update snapshot, money plan and intelligence layer
    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);

    await intake.save();

    return {
      intake,
      record: newRecord,
      newItemsNotInStock: newItemsPrompt,
    };
  }

  async addStockItem(
    id: string,
    item: { name: string; quantity: number; buyingPrice: number; sellingPrice: number },
  ) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    const newItem: StockItem = {
      id: 'stock_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: item.name.trim(),
      quantity: Math.max(0, Number(item.quantity) || 0),
      buyingPrice: Math.max(0, Number(item.buyingPrice) || 0),
      sellingPrice: Math.max(0, Number(item.sellingPrice) || 0),
    };

    if (!intake.stockItems) intake.stockItems = [];
    intake.stockItems.push(newItem);

    intake.snapshot = this.computeSnapshot(intake);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);
    await intake.save();

    return intake;
  }

  async updateStockItem(
    id: string,
    itemId: string,
    update: Partial<StockItem>,
  ) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    const item = intake.stockItems.find(s => s.id === itemId);
    if (!item) {
      throw new NotFoundException(`Stock item with ID ${itemId} not found`);
    }

    if (update.name !== undefined) item.name = update.name.trim();
    if (update.quantity !== undefined) item.quantity = Math.max(0, Number(update.quantity) || 0);
    if (update.buyingPrice !== undefined) item.buyingPrice = Math.max(0, Number(update.buyingPrice) || 0);
    if (update.sellingPrice !== undefined) item.sellingPrice = Math.max(0, Number(update.sellingPrice) || 0);

    intake.snapshot = this.computeSnapshot(intake);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);
    await intake.save();

    return intake;
  }

  async deleteStockItem(id: string, itemId: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    intake.stockItems = (intake.stockItems || []).filter(s => s.id !== itemId);
    intake.snapshot = this.computeSnapshot(intake);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);
    await intake.save();

    return intake;
  }

  async unlockPremium(id: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    intake.isUnlocked = true;
    intake.unlockedAt = new Date();

    // Generate comprehensive KSh 499 unlock deliverables
    intake.diagnostics.premiumDeliverables = this.generatePremiumDeliverables(intake);

    await intake.save();
    return intake;
  }

  // --- REASSURANCE MESSAGE ---
  private getReassuranceMessage(trackingAbility: string) {
    if (trackingAbility === 'yes_regularly') {
      return {
        title: 'Strong Financial Foundation',
        titleSw: 'Msingi Imara wa Kifedha',
        message: 'Excellent! Tracking sales and expenses regularly gives you immediate clarity. Compass will help turn your daily numbers into growth levers.',
        messageSw: 'Safi sana! Kufuatilia mauzo na matumizi mara kwa mara kunakupa mwanga. Compass itakusaidia kugeuza nambari zako kuwa fursa za kukuza biashara.',
      };
    }

    return {
      title: "You're in the Right Place",
      titleSw: 'Upo Mahali Sahihi',
      message: "Don't worry if you don't have accurate records or exact past numbers. Most successful informal businesses start by estimating. Compass meets you where you are and helps you start tracking simply from today.",
      messageSw: 'Usijali iwapo huna rekodi sahihi za zamani. Biashara nyingi zilizofanikiwa zilianza kwa makadirio. Compass inakusaidia kuanzia hapa ulipo na kuanza kuweka kumbukumbu kwa urahisi kuanzia leo.',
    };
  }

  // --- SNAPSHOT CALCULATION ---
  private computeInitialSnapshot() {
    return {
      averageDailySales: 0,
      averageMonthlySales: 0,
      averageExpenses: 0,
      estimatedProfit: 0,
      fixedMonthlyCosts: 0,
      stockSpending: 0,
      ownerPay: 0,
      totalTrackedDays: 0,
      stockInventoryValue: 0,
    };
  }

  private computeSnapshot(intake: GrowIntakeDocument) {
    const records = intake.dailyRecords || [];
    const stockItems = intake.stockItems || [];

    const totalDays = records.length;
    let totalSales = 0;
    let totalExpenses = 0;

    for (const r of records) {
      totalSales += Number(r.sales) || 0;
      totalExpenses += Number(r.expenses) || 0;
    }

    const averageDailySales = totalDays > 0 ? Math.round(totalSales / totalDays) : 0;
    const averageDailyExpenses = totalDays > 0 ? Math.round(totalExpenses / totalDays) : 0;
    const averageMonthlySales = averageDailySales * 30;
    const estimatedMonthlyProfit = (averageDailySales - averageDailyExpenses) * 30;

    // Fixed monthly costs from optional financials (rent, wages, utilities, loan repayments)
    const opt = intake.optionalFinancials || {};
    const rent = parseFloat(String(opt.rent || '0').replace(/[^0-9.]/g, '')) || 0;
    const wages = parseFloat(String(opt.wages || '0').replace(/[^0-9.]/g, '')) || 0;
    const utilities = parseFloat(String(opt.utilities || '0').replace(/[^0-9.]/g, '')) || 0;
    const loanRepayments = parseFloat(String(opt.loanRepayments || '0').replace(/[^0-9.]/g, '')) || 0;
    const fixedMonthlyCosts = rent + wages + utilities + loanRepayments;

    // Stock spending and inventory valuation
    let stockInventoryValue = 0;
    for (const s of stockItems) {
      stockInventoryValue += (s.quantity || 0) * (s.buyingPrice || 0);
    }

    const stockPurchases = parseFloat(String(opt.averageStockPurchases || '0').replace(/[^0-9.]/g, '')) || 0;

    return {
      averageDailySales,
      averageMonthlySales,
      averageExpenses: averageDailyExpenses,
      estimatedProfit: averageDailySales - averageDailyExpenses,
      estimatedMonthlyProfit,
      fixedMonthlyCosts,
      stockSpending: stockPurchases,
      ownerPay: Math.round(Math.max(0, estimatedMonthlyProfit * 0.35)),
      totalTrackedDays: totalDays,
      stockInventoryValue,
    };
  }

  // --- BUSINESS MONEY PLAN ---
  // Recommendations informed by user's actual numbers and stage
  private computeMoneyPlan(intake: any, records: DailyRecord[]) {
    const hasEnoughData = (records || []).length >= 3;
    const operatingAge = intake.operatingDuration || '';

    // Adjust allocations based on operating stage and numbers
    let operatingPercent = 45;
    let ownerPayPercent = 25;
    let employeePercent = 10;
    let reservePercent = 10;
    let reinvestmentPercent = 5;
    let personalSavingsPercent = 5;

    if (operatingAge.includes('Less than 6')) {
      // Early stage: higher reinvestment & reserve buffer
      operatingPercent = 40;
      ownerPayPercent = 20;
      employeePercent = 10;
      reservePercent = 15;
      reinvestmentPercent = 10;
      personalSavingsPercent = 5;
    } else if (operatingAge.includes('More than 3')) {
      // Mature stage: steady owner pay and growth reserve
      operatingPercent = 40;
      ownerPayPercent = 30;
      employeePercent = 12;
      reservePercent = 8;
      reinvestmentPercent = 5;
      personalSavingsPercent = 5;
    }

    return {
      hasEnoughData,
      allocations: [
        {
          category: 'Business Operating Costs',
          categorySw: 'Gharama za Uendeshaji wa Biashara',
          percentage: operatingPercent,
          purpose: 'Restocking, utilities, transport, and daily overhead.',
          purposeSw: 'Kununua mzigo, bili, nauli na matumizi ya kila siku.',
        },
        {
          category: "Owner's Pay",
          categorySw: 'Mshahara wa Mwenye Biashara',
          percentage: ownerPayPercent,
          purpose: 'Consistent, disciplined monthly salary to avoid dipping into cash register.',
          purposeSw: 'Mshahara thabiti wa kila mwezi ili kuzuia kuchukua fedha za mauzo holela.',
        },
        {
          category: 'Employee Payments',
          categorySw: 'Malipo ya Wafanyakazi',
          percentage: employeePercent,
          purpose: 'Wages, casual labor, commissions, and staff meals.',
          purposeSw: 'Mishahara, vibarua, kamisheni na chakula cha wafanyakazi.',
        },
        {
          category: 'Business Reserve / Emergency Buffer',
          categorySw: 'Mfuko wa Dharura wa Biashara',
          percentage: reservePercent,
          purpose: 'Safety cushion for slow seasons, unexpected price hikes, or equipment repairs.',
          purposeSw: 'Akiba ya dharura wakati wa msimu mbaya au uharibifu wa vifaa.',
        },
        {
          category: 'Reinvestment into Business',
          categorySw: 'Kuwekeza Tena Kwenye Biashara',
          percentage: reinvestmentPercent,
          purpose: 'Adding new product varieties, marketing, or buying in bulk for discount.',
          purposeSw: 'Kuongeza bidhaa mpya, matangazo au kununua mzigo mkubwa kwa bei ya jumla.',
        },
        {
          category: 'Personal Savings',
          categorySw: 'Akiba Binafsi',
          percentage: personalSavingsPercent,
          purpose: 'Building personal wealth separate from the business books.',
          purposeSw: 'Kujenga mali na akiba binafsi nje ya mfumo wa biashara.',
        },
      ],
      recommendation:
        'Pay yourself a fixed weekly or monthly owner wage. Never treat the daily cash drawer as your personal ATM.',
      recommendationSw:
        'Jilipe mshahara maalum wa wiki au mwezi. Kamwe usichukulie droo ya fedha za mauzo kama benki yako binafsi.',
    };
  }

  // --- THE INTELLIGENCE LAYER: "YOUR NEXT BEST STEP" ---
  private computeNextBestStep(intake: any, records: DailyRecord[], stockItems: StockItem[]) {
    const totalDays = (records || []).length;
    const stockCount = (stockItems || []).length;

    // Rule 1: No tracking data yet
    if (totalDays === 0) {
      return {
        headline: 'Your next best step: Record today’s total sales and expenses.',
        headlineSw: 'Hatua yako bora inayofuata: Rekodi mauzo na matumizi ya leo.',
        reason: 'Compass needs at least 3 days of real numbers to begin diagnosing profit leaks.',
        reasonSw: 'Compass inahitaji angalau siku 3 za nambari halisi kuanza kugundua mianya ya kupoteza faida.',
        actionType: 'record_sales',
      };
    }

    // Rule 2: Less than 3 days of tracking
    if (totalDays < 3) {
      return {
        headline: `Your next best step: Keep tracking for ${3 - totalDays} more consecutive days.`,
        headlineSw: `Hatua yako bora inayofuata: Endelea kurekodi kwa siku ${3 - totalDays} zilizobaki mfululizo.`,
        reason: 'Consistency reveals whether your daily margins are predictable or fluctuating wildly.',
        reasonSw: 'Uthabiti unaonyesha iwapo faida yako ya kila siku ni ya uhakika au inabadilika kwa kiasi kikubwa.',
        actionType: 'continue_tracking',
      };
    }

    // Rule 3: Has tracking data but no stock entered
    if (stockCount === 0) {
      return {
        headline: 'Your next best step: Track your stock for the next 7 days.',
        headlineSw: 'Hatua yako bora inayofuata: Fuatilia hesabu ya mzigo wako kwa siku 7 zijazo.',
        reason: 'Tracking product inventory connects daily sales directly to unit profit margins.',
        reasonSw: 'Kufuatilia mzigo kunasaidia kuunganisha mauzo ya kila siku na faida halisi ya kila bidhaa.',
        actionType: 'add_stock',
      };
    }

    // Rule 4: High expense ratio check
    const recentExpenses = records.slice(0, 5).reduce((sum, r) => sum + r.expenses, 0);
    const recentSales = records.slice(0, 5).reduce((sum, r) => sum + r.sales, 0);
    if (recentSales > 0 && recentExpenses / recentSales > 0.65) {
      return {
        headline: 'Your expenses are taking a large portion of your sales. Your next step is to identify your three biggest expenses.',
        headlineSw: 'Matumizi yako yanachukua sehemu kubwa ya mauzo. Hatua yako inayofuata ni kubainisha matumizi 3 makubwa zaidi.',
        reason: 'Operating expenses above 65% of sales indicate either under-pricing or unnecessary overhead.',
        reasonSw: 'Gharama za uendeshaji zaidi ya 65% ya mauzo huashiria bei ya chini au matumizi yasiyo ya lazima.',
        actionType: 'audit_expenses',
      };
    }

    // Rule 5: Default consistent owner pay recommendation
    return {
      headline: 'You’ve been generating steady sales. Your next step is to establish a consistent owner-pay amount.',
      headlineSw: 'Umekuwa ukitengeneza mauzo ya kuridhisha. Hatua yako inayofuata ni kuweka mshahara thabiti wa kujilipa mwenyewe.',
      reason: 'Separating business profit from household expenses protects your working capital from gradual depletion.',
      reasonSw: 'Kutenga faida ya biashara na matumizi ya nyumbani kunalinda mtaji wako usipungue polepole.',
      actionType: 'owner_pay',
    };
  }

  // --- KSH 499 UNLOCK DELIVERABLES ---
  private generatePremiumDeliverables(intake: GrowIntakeDocument) {
    const businessName = intake.businessType;
    return {
      unlocked: true,
      title: `Compass Pro Health Blueprint · ${businessName}`,
      titleSw: `Mwongozo Maalum wa Afya ya Biashara · ${businessName}`,
      executiveSummary:
        'A comprehensive diagnostic evaluation of your current margins, cash velocity, owner compensation safeguards, and 30-day tactical roadmap.',
      executiveSummarySw:
        'Tathmini kamili ya kina kuhusu faida yako, mtiririko wa fedha, mshahara wako na mpango wa siku 30.',
      actionPlan30Days: [
        {
          week: 'Week 1: Cash Ring-Fencing & Margin Audit',
          weekSw: 'Wiki ya 1: Kulinda Fedha Taslimu na Kukagua Faida',
          tasks: [
            'Separate your personal M-Pesa from your business Till/Paybill number.',
            'Perform a complete physical stock count and calculate actual buying vs selling price on every item.',
            'Record every single expense, including packaging bags, airtime, and lunch.',
          ],
          tasksSw: [
            'Tenga M-Pesa yako binafsi na nambari ya biashara ya Till/Paybill.',
            'Hesabu mzigo mzima uliopo dukani na upige hesabu ya bei ya kununua dhidi ya bei ya kuuza kwa kila bidhaa.',
            'Andika kila matumizi madogo madogo, ikiwemo mifuko ya kufungashia, vocha na chakula cha mchana.',
          ],
        },
        {
          week: 'Week 2: Elimination of Dead Stock & Credit Leaks',
          weekSw: 'Wiki ya 2: Kuondoa Mzigo Uliolala na Kudhibiti Madeni',
          tasks: [
            'Identify items that have not sold in 21 days and discount them by 10-15% to recover cash.',
            'Enforce a strict "No Credit" policy for anyone without a formal signed agreement.',
            'Negotiate 7-day supplier payment terms for your fastest-moving goods.',
          ],
          tasksSw: [
            'Tambua bidhaa ambazo hazijauzika kwa siku 21 na uzipunguze bei kwa 10-15% ili kurejesha mtaji.',
            'Weka sheria thabiti ya kutokopesha bila makubaliano rasmi.',
            'Zungumza na wasambazaji wakupe muda wa siku 7 kulipia mzigo unaotembea kwa kasi.',
          ],
        },
        {
          week: 'Week 3: Owner Pay & Reserve Account Setup',
          weekSw: 'Wiki ya 3: Mfumo wa Kujilipa na Kufungua Akaunti ya Akiba',
          tasks: [
            'Calculate a sustainable fixed weekly owner salary based on last 2 weeks of estimated profit.',
            'Open a lock-savings account (e.g., M-Shwari Lock or bank fixed deposit) for business emergency buffer.',
            'Deposit 10% of daily gross profits directly into the emergency reserve every evening.',
          ],
          tasksSw: [
            'Piga hesabu ya mshahara wa kudumu wa kujilipa kila wiki kulingana na faida ya wiki 2 zilizopita.',
            'Fungua akaunti ya kuweka akiba (kama M-Shwari Lock au benki) kwa ajili ya dharura.',
            'Weka 10% ya faida ya kila siku moja kwa moja kwenye akiba ya dharura kila jioni.',
          ],
        },
        {
          week: 'Week 4: Repeat Customer Engine & Revenue Expansion',
          weekSw: 'Wiki ya 4: Mbinu za Kurudisha Wateja na Kuongeza Mauzo',
          tasks: [
            'Launch a VIP WhatsApp broadcast list with weekly arrivals and weekend deals.',
            'Introduce product bundles (combining a high-margin item with a high-velocity item).',
            'Review monthly figures to calibrate the next 30 days of growth.',
          ],
          tasksSw: [
            'Anzisha orodha ya matangazo ya WhatsApp kwa wateja wako waaminifu kuwapa ofa za wikendi.',
            'Unganisha bidhaa mbili pamoja (bidhaa yenye faida kubwa na inayotembea haraka).',
            'Kagua hesabu za mwezi mzima ili kupanga mikakati ya mwezi unaofuata.',
          ],
        },
      ],
      ownerPayGuidance: {
        recommendedRule: 'Pay yourself 25% to 30% of verified net profit as a recurring salary.',
        recommendedRuleSw: 'Jilipe asilimia 25% hadi 30% ya faida halisi kama mshahara wa kudumu.',
        warning:
          'Dipping into gross sales to pay personal living expenses leads to sudden inventory starvation and business collapse.',
        warningSw:
          'Kuchukua fedha za mauzo kulipia matumizi binafsi ya nyumbani husababisha kukosa mtaji wa kununua mzigo mpya na hatimaye biashara kufungwa.',
      },
      stockInsights: {
        tip: 'Focus 70% of your working capital on the top 20% of goods that sell out within 5 days.',
        tipSw: 'Wekeza asilimia 70% ya mtaji wako kwenye bidhaa 20% zinazoisha haraka ndani ya siku 5.',
      },
    };
  }

  // --- STANDARD DIAGNOSTICS ---
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

    const challenge = (data.biggestChallenge || '').toLowerCase();
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
}

