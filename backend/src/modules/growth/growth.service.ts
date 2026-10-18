import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GrowIntake,
  GrowIntakeDocument,
  DailyRecord,
  StockItem,
  ItemSold,
  DepartmentSale,
  ExpenseItem,
} from '../../database/schemas/grow-intake.schema';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class GrowthService {
  constructor(
    @InjectModel(GrowIntake.name) private growModel: Model<GrowIntakeDocument>,
    private readonly geminiService: GeminiService,
  ) {}

  async submitIntake(data: {
    userId?: string;
    businessName?: string;
    branchName?: string;
    departments?: string[];
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

    const defaultDepts = data.departments && data.departments.length > 0
      ? data.departments
      : ['SHOP', 'SALES'];

    const initialSnapshot = this.computeInitialSnapshot();
    const initialMoneyPlan = this.computeMoneyPlan(data, []);
    const initialNextStep = this.computeNextBestStep(data, [], []);

    const intake = new this.growModel({
      ...data,
      businessName: data.businessName || data.businessType,
      branchName: data.branchName || 'Main Branch',
      departments: defaultDepts,
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

    intake.markModified('dailyRecords');
    intake.markModified('stockItems');
    intake.markModified('departments');
    intake.markModified('snapshot');
    intake.markModified('moneyPlan');
    intake.markModified('nextBestStep');

    return intake.save();
  }

  async getIntake(id: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }
    if (!intake.departments || intake.departments.length === 0) {
      intake.departments = ['SHOP', 'SALES'];
      intake.markModified('departments');
    }
    // Refresh snapshot, money plan and next best step
    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);
    intake.markModified('snapshot');
    intake.markModified('moneyPlan');
    intake.markModified('nextBestStep');
    await intake.save();
    return intake;
  }

  async getRecentIntakes(userId?: string) {
    if (userId) {
      return this.growModel.find({ userId }).sort({ createdAt: -1 }).limit(20).exec();
    }
    return [];
  }

  async recordDailyTracking(
    id: string,
    recordData: {
      date: string; // YYYY-MM-DD
      sales: number;
      expenses: number;
      cashTotal?: number;
      tillTotal?: number;
      departmentBreakdown?: DepartmentSale[];
      expenseBreakdown?: ExpenseItem[];
      itemsSold?: ItemSold[];
      notes?: string;
      rawText?: string;
    },
  ) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    if (!intake.dailyRecords) {
      intake.dailyRecords = [];
    }

    let salesNum = Number(recordData.sales) || 0;
    let expensesNum = Number(recordData.expenses) || 0;

    // Auto-calculate from Cash + Till if salesNum was 0
    if (salesNum === 0 && (recordData.cashTotal || recordData.tillTotal)) {
      salesNum = (Number(recordData.cashTotal) || 0) + (Number(recordData.tillTotal) || 0);
    }

    // Auto-calculate from department breakdown if salesNum is still 0
    if (salesNum === 0 && recordData.departmentBreakdown && recordData.departmentBreakdown.length > 0) {
      salesNum = recordData.departmentBreakdown.reduce((sum, d) => sum + (Number(d.total) || (Number(d.cash) || 0) + (Number(d.till) || 0)), 0);
    }

    // Auto-calculate from expenses breakdown if expensesNum was 0
    if (expensesNum === 0 && recordData.expenseBreakdown && recordData.expenseBreakdown.length > 0) {
      expensesNum = recordData.expenseBreakdown.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    }

    const estimatedProfit = salesNum - expensesNum;

    const recordDate = recordData.date || new Date().toISOString().split('T')[0];

    const newRecord: DailyRecord = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date: recordDate,
      sales: salesNum,
      expenses: expensesNum,
      estimatedProfit,
      cashTotal: Number(recordData.cashTotal) || 0,
      tillTotal: Number(recordData.tillTotal) || 0,
      departmentBreakdown: recordData.departmentBreakdown || [],
      expenseBreakdown: recordData.expenseBreakdown || [],
      itemsSold: recordData.itemsSold || [],
      notes: recordData.notes || '',
      rawText: recordData.rawText || '',
      createdAt: new Date(),
    };

    // Auto-register new departments found in this record
    if (recordData.departmentBreakdown && Array.isArray(recordData.departmentBreakdown)) {
      if (!intake.departments) intake.departments = [];
      for (const d of recordData.departmentBreakdown) {
        const deptUpper = (d.department || '').trim().toUpperCase();
        if (deptUpper && !intake.departments.includes(deptUpper)) {
          intake.departments.push(deptUpper);
        }
      }
    }

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

    // Replace if record for this date already exists, otherwise unshift
    const existingIndex = intake.dailyRecords.findIndex(r => r.date === recordDate);
    if (existingIndex >= 0) {
      intake.dailyRecords[existingIndex] = { ...intake.dailyRecords[existingIndex], ...newRecord };
    } else {
      intake.dailyRecords.unshift(newRecord);
    }

    // Keep records sorted newest to oldest
    intake.dailyRecords.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    // Update snapshot, money plan and intelligence layer
    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);

    intake.markModified('dailyRecords');
    intake.markModified('stockItems');
    intake.markModified('departments');
    intake.markModified('snapshot');
    intake.markModified('moneyPlan');
    intake.markModified('nextBestStep');

    await intake.save();

    return {
      intake,
      record: newRecord,
      newItemsNotInStock: newItemsPrompt,
    };
  }

  async recordBulkDailyTracking(
    id: string,
    records: Array<{
      date: string;
      sales: number;
      expenses: number;
      cashTotal?: number;
      tillTotal?: number;
      departmentBreakdown?: DepartmentSale[];
      expenseBreakdown?: ExpenseItem[];
      itemsSold?: ItemSold[];
      notes?: string;
      rawText?: string;
    }>,
  ) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    if (!intake.dailyRecords) {
      intake.dailyRecords = [];
    }
    if (!intake.departments) {
      intake.departments = ['CHIPS', 'SHOP', 'BEAUTY', 'SALAD', 'CORN'];
    }

    for (const recordData of records) {
      let salesNum = Number(recordData.sales) || 0;
      let expensesNum = Number(recordData.expenses) || 0;

      if (salesNum === 0 && (recordData.cashTotal || recordData.tillTotal)) {
        salesNum = (Number(recordData.cashTotal) || 0) + (Number(recordData.tillTotal) || 0);
      }
      if (salesNum === 0 && recordData.departmentBreakdown && recordData.departmentBreakdown.length > 0) {
        salesNum = recordData.departmentBreakdown.reduce((sum, d) => sum + (Number(d.total) || (Number(d.cash) || 0) + (Number(d.till) || 0)), 0);
      }
      if (expensesNum === 0 && recordData.expenseBreakdown && recordData.expenseBreakdown.length > 0) {
        expensesNum = recordData.expenseBreakdown.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      }

      const recordDate = recordData.date || new Date().toISOString().split('T')[0];
      const estimatedProfit = salesNum - expensesNum;

      const newRecord: DailyRecord = {
        id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: recordDate,
        sales: salesNum,
        expenses: expensesNum,
        estimatedProfit,
        cashTotal: Number(recordData.cashTotal) || 0,
        tillTotal: Number(recordData.tillTotal) || 0,
        departmentBreakdown: recordData.departmentBreakdown || [],
        expenseBreakdown: recordData.expenseBreakdown || [],
        itemsSold: recordData.itemsSold || [],
        notes: recordData.notes || '',
        rawText: recordData.rawText || '',
        createdAt: new Date(),
      };

      if (recordData.departmentBreakdown) {
        for (const d of recordData.departmentBreakdown) {
          const deptUpper = (d.department || '').trim().toUpperCase();
          if (deptUpper && !intake.departments.includes(deptUpper)) {
            intake.departments.push(deptUpper);
          }
        }
      }

      const existingIndex = intake.dailyRecords.findIndex(r => r.date === recordDate);
      if (existingIndex >= 0) {
        intake.dailyRecords[existingIndex] = { ...intake.dailyRecords[existingIndex], ...newRecord };
      } else {
        intake.dailyRecords.push(newRecord);
      }
    }

    intake.dailyRecords.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);

    intake.markModified('dailyRecords');
    intake.markModified('departments');
    intake.markModified('snapshot');
    intake.markModified('moneyPlan');
    intake.markModified('nextBestStep');

    await intake.save();
    return intake;
  }

  async deleteDailyRecord(id: string, recordId: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) {
      throw new NotFoundException(`Grow intake with ID ${id} not found`);
    }

    intake.dailyRecords = (intake.dailyRecords || []).filter(r => r.id !== recordId);
    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);

    intake.markModified('dailyRecords');
    intake.markModified('snapshot');
    intake.markModified('moneyPlan');
    intake.markModified('nextBestStep');

    await intake.save();
    return intake;
  }

  async addDepartment(id: string, departmentName: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) throw new NotFoundException(`Grow intake with ID ${id} not found`);
    const formatted = departmentName.trim().toUpperCase();
    if (!intake.departments) intake.departments = [];
    if (!intake.departments.includes(formatted)) {
      intake.departments.push(formatted);
      intake.markModified('departments');
      await intake.save();
    }
    return intake;
  }

  async deleteDepartment(id: string, departmentName: string) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) throw new NotFoundException(`Grow intake with ID ${id} not found`);
    const formatted = departmentName.trim().toUpperCase();
    intake.departments = (intake.departments || []).filter(d => d !== formatted);
    intake.markModified('departments');
    await intake.save();
    return intake;
  }

  async updateDailyRecord(
    id: string,
    recordId: string,
    recordData: {
      date: string;
      sales?: number;
      expenses?: number;
      cashTotal?: number;
      tillTotal?: number;
      departmentBreakdown?: DepartmentSale[];
      expenseBreakdown?: ExpenseItem[];
      itemsSold?: ItemSold[];
      notes?: string;
    },
  ) {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) throw new NotFoundException(`Grow intake with ID ${id} not found`);

    if (!intake.dailyRecords) intake.dailyRecords = [];
    const index = intake.dailyRecords.findIndex(r => r.id === recordId);
    if (index === -1) throw new NotFoundException(`Daily record with ID ${recordId} not found`);

    let salesNum = Number(recordData.sales) || 0;
    let expensesNum = Number(recordData.expenses) || 0;

    if (salesNum === 0 && (recordData.cashTotal || recordData.tillTotal)) {
      salesNum = (Number(recordData.cashTotal) || 0) + (Number(recordData.tillTotal) || 0);
    }
    if (salesNum === 0 && recordData.departmentBreakdown && recordData.departmentBreakdown.length > 0) {
      salesNum = recordData.departmentBreakdown.reduce((sum, d) => sum + (Number(d.total) || (Number(d.cash) || 0) + (Number(d.till) || 0)), 0);
    }
    if (expensesNum === 0 && recordData.expenseBreakdown && recordData.expenseBreakdown.length > 0) {
      expensesNum = recordData.expenseBreakdown.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    }

    const estimatedProfit = salesNum - expensesNum;

    intake.dailyRecords[index] = {
      ...intake.dailyRecords[index],
      date: recordData.date || intake.dailyRecords[index].date,
      sales: salesNum,
      expenses: expensesNum,
      estimatedProfit,
      cashTotal: Number(recordData.cashTotal) || 0,
      tillTotal: Number(recordData.tillTotal) || 0,
      departmentBreakdown: recordData.departmentBreakdown || intake.dailyRecords[index].departmentBreakdown || [],
      expenseBreakdown: recordData.expenseBreakdown || intake.dailyRecords[index].expenseBreakdown || [],
      notes: recordData.notes !== undefined ? recordData.notes : intake.dailyRecords[index].notes,
    };

    // Auto-register any new department entered during edit
    if (recordData.departmentBreakdown) {
      if (!intake.departments) intake.departments = [];
      for (const d of recordData.departmentBreakdown) {
        const dUpper = (d.department || '').trim().toUpperCase();
        if (dUpper && !intake.departments.includes(dUpper)) {
          intake.departments.push(dUpper);
        }
      }
    }

    intake.dailyRecords.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    intake.snapshot = this.computeSnapshot(intake);
    intake.moneyPlan = this.computeMoneyPlan(intake, intake.dailyRecords);
    intake.nextBestStep = this.computeNextBestStep(intake, intake.dailyRecords, intake.stockItems);

    intake.markModified('dailyRecords');
    intake.markModified('departments');
    intake.markModified('snapshot');
    intake.markModified('moneyPlan');
    intake.markModified('nextBestStep');

    await intake.save();
    return intake;
  }

  async runAiSalesAnalysis(id: string, timeframe: string = 'all') {
    const intake = await this.growModel.findById(id).exec();
    if (!intake) throw new NotFoundException(`Grow intake with ID ${id} not found`);

    let records = (intake.dailyRecords || []).slice();
    records.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (timeframe === 'week') {
      records = records.slice(0, 7);
    } else if (timeframe === 'month') {
      records = records.slice(0, 30);
    }

    if (records.length === 0) {
      return {
        headline: 'No records found for this timeframe',
        executiveSummary: 'Please record at least 1 day of sales to run AI analysis.',
        departmentInsights: [],
        cashFlowAdvice: 'Start recording Till and Cash sales to receive liquidity recommendations.',
        expenseAudit: 'Log your daily operational expenses to track profit margins.',
        actionableRecommendations: ['Record today’s sales and expenses to begin.'],
      };
    }

    const totalSales = records.reduce((s, r) => s + (Number(r.sales) || 0), 0);
    const totalExpenses = records.reduce((s, r) => s + (Number(r.expenses) || 0), 0);
    const netProfit = totalSales - totalExpenses;
    const totalTill = records.reduce((s, r) => s + (Number(r.tillTotal) || 0), 0);
    const totalCash = records.reduce((s, r) => s + (Number(r.cashTotal) || 0), 0);

    const deptMap: Record<string, { sales: number; cash: number; till: number }> = {};
    const expMap: Record<string, number> = {};

    for (const r of records) {
      if (r.departmentBreakdown) {
        for (const d of r.departmentBreakdown) {
          const dept = (d.department || 'GENERAL').toUpperCase();
          if (!deptMap[dept]) deptMap[dept] = { sales: 0, cash: 0, till: 0 };
          deptMap[dept].sales += Number(d.total) || ((Number(d.cash) || 0) + (Number(d.till) || 0));
          deptMap[dept].cash += Number(d.cash) || 0;
          deptMap[dept].till += Number(d.till) || 0;
        }
      }
      if (r.expenseBreakdown) {
        for (const e of r.expenseBreakdown) {
          const cat = e.category || 'General Expense';
          expMap[cat] = (expMap[cat] || 0) + (Number(e.amount) || 0);
        }
      }
    }

    const payload = {
      businessName: intake.businessName || intake.businessType,
      businessType: intake.businessType,
      branchName: intake.branchName || 'Main',
      timeframe,
      recordsCount: records.length,
      dateRange: `${records[records.length - 1]?.date} to ${records[0]?.date}`,
      totalSales,
      totalExpenses,
      netProfit,
      totalTill,
      totalCash,
      departmentBreakdown: deptMap,
      expenseBreakdown: expMap,
      dailyTrend: records.map(r => ({ date: r.date, sales: r.sales, expenses: r.expenses, profit: r.estimatedProfit })),
    };

    const analysis = await this.geminiService.generateSalesAnalysis(payload);

    if (!intake.diagnostics) intake.diagnostics = {};
    intake.diagnostics.latestAiAnalysis = {
      ...analysis,
      timeframe,
      analyzedAt: new Date(),
      recordsCount: records.length,
      dateRange: payload.dateRange,
      totalSales,
      totalExpenses,
      netProfit,
    };
    intake.markModified('diagnostics');
    await intake.save();

    return intake.diagnostics.latestAiAnalysis;
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
    let totalCash = 0;
    let totalTill = 0;

    const deptMap: Record<string, { sales: number; cash: number; till: number }> = {};
    const expenseCategoryMap: Record<string, number> = {};
    let peakDay = { date: '', sales: 0 };

    for (const r of records) {
      const s = Number(r.sales) || 0;
      const e = Number(r.expenses) || 0;
      totalSales += s;
      totalExpenses += e;

      if (s > peakDay.sales) {
        peakDay = { date: r.date, sales: s };
      }

      totalCash += Number(r.cashTotal) || 0;
      totalTill += Number(r.tillTotal) || 0;

      if (r.departmentBreakdown && Array.isArray(r.departmentBreakdown)) {
        for (const d of r.departmentBreakdown) {
          const name = (d.department || 'GENERAL').trim().toUpperCase();
          if (!deptMap[name]) {
            deptMap[name] = { sales: 0, cash: 0, till: 0 };
          }
          const itemTotal = Number(d.total) || ((Number(d.cash) || 0) + (Number(d.till) || 0));
          deptMap[name].sales += itemTotal;
          deptMap[name].cash += Number(d.cash) || 0;
          deptMap[name].till += Number(d.till) || 0;
        }
      }

      if (r.expenseBreakdown && Array.isArray(r.expenseBreakdown)) {
        for (const exp of r.expenseBreakdown) {
          const cat = (exp.category || 'General Expense').trim();
          expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + (Number(exp.amount) || 0);
        }
      }
    }

    const departmentBreakdown = Object.entries(deptMap).map(([name, data]) => ({
      name,
      sales: data.sales,
      cash: data.cash,
      till: data.till,
      percent: totalSales > 0 ? Math.round((data.sales / totalSales) * 100) : 0,
    })).sort((a, b) => b.sales - a.sales);

    const topDepartment = departmentBreakdown[0]?.name || null;

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
      totalSales,
      totalExpenses,
      totalCash,
      totalTill,
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
      departmentBreakdown,
      topDepartment,
      expenseCategories: Object.entries(expenseCategoryMap).map(([category, amount]) => ({
        category,
        amount,
        percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      })).sort((a, b) => b.amount - a.amount),
      peakDay,
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
      operatingPercent = 40;
      ownerPayPercent = 20;
      employeePercent = 10;
      reservePercent = 15;
      reinvestmentPercent = 10;
      personalSavingsPercent = 5;
    } else if (operatingAge.includes('More than 3')) {
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

  // --- THE INTELLIGENCE LAYER: "YOUR NEXT BEST STEP" & COMPASS RECOMMENDATIONS ---
  private computeNextBestStep(intake: any, records: DailyRecord[], stockItems: StockItem[]) {
    const totalDays = (records || []).length;
    const stockCount = (stockItems || []).length;

    // Rule 1: No tracking data yet
    if (totalDays === 0) {
      return {
        headline: 'Your next best step: Record today’s total sales and expenses.',
        headlineSw: 'Hatua yako bora inayofuata: Rekodi mauzo na matumizi ya leo.',
        reason: 'Compass needs at least 3 days of real numbers to begin diagnosing profit leaks and department margins.',
        reasonSw: 'Compass inahitaji angalau siku 3 za nambari halisi kuanza kugundua mianya ya kupoteza faida.',
        actionType: 'record_sales',
        actionableSteps: [
          'Record daily collections split into Till and Cash.',
          'Note down specific unit sales (Chips, Shop, Beauty, etc.).',
          'Log staff wages and restocking runs.'
        ],
      };
    }

    // Rule 2: Multi-day data available (3+ days)
    const recentExpenses = records.slice(0, 10).reduce((sum, r) => sum + r.expenses, 0);
    const recentSales = records.slice(0, 10).reduce((sum, r) => sum + r.sales, 0);
    const totalTill = records.reduce((sum, r) => sum + (r.tillTotal || 0), 0);
    const totalCash = records.reduce((sum, r) => sum + (r.cashTotal || 0), 0);

    // Analyze department performance if breakdown exists
    const deptTotals: Record<string, number> = {};
    for (const r of records) {
      if (r.departmentBreakdown) {
        for (const d of r.departmentBreakdown) {
          const dept = (d.department || 'GENERAL').toUpperCase();
          deptTotals[dept] = (deptTotals[dept] || 0) + (d.total || (d.cash + d.till));
        }
      }
    }

    const sortedDepts = Object.entries(deptTotals).sort((a, b) => b[1] - a[1]);
    const topDeptName = sortedDepts[0]?.[0] || 'CHIPS';

    const actionableSteps = [
      `1. Double-down on ${topDeptName}: It generates the bulk of customer cashflow. Ensure zero stockouts during Friday-Saturday peaks.`,
      `2. Protect Beauty & High-Margin Units: Services like Braids and Lashes require no perishables—promote bundle deals (e.g., hair service includes snack discount).`,
      `3. Monday & Tuesday Strategy: Midweek traffic dips. Run special lunch combos or use slow hours for potato peeling/prep to reduce peak weekend strain.`,
      `4. Till Float Discipline: Over 60% of collections flow through M-Pesa Till. Sweep daily till amounts into a dedicated business account every evening to prevent personal spending leakages.`,
      `5. Bulk Inventory Margin Check: Ensure major batch expenses (e.g., Sacks of Potatoes & Cooking Oil) yield at least 2.2x revenue in chips sales.`
    ];

    const actionableStepsSw = [
      `1. Imarisha ${topDeptName}: Inaleta sehemu kubwa ya fedha. Hakikisha mzigo haukati hasa Ijumaa na Jumamosi.`,
      `2. Linda Faida ya Saluni/Urembo (Beauty): Huduma za Kusuka na Lashes zina faida ya juu bila kuharibika—washawishi wateja wa saluni kununua vitafunio.`,
      `3. Mbinu ya Jumatatu na Jumanne: Mauzo hushuka mwanzo wa wiki. Tumia muda huu kutayarisha mzigo wa viazi ili kupunguza mzigo wa wikendi.`,
      `4. Utaratibu wa Till (M-Pesa): Zaidi ya 60% ya malipo huingia kwa Till. Hamisha pesa za Till kila jioni kwenye akaunti maalum ya biashara badala ya kuitumia kwa mahitaji binafsi.`,
      `5. Udhibiti wa Bei ya Mzigo Mkubwa: Hakikisha ununuzi wa magunia ya viazi na mafuta unaleta angalau faida ya mara 2 ya mauzo ya chips.`
    ];

    return {
      headline: `Compass Growth Recommendation: Scale ${topDeptName} and Optimize Early-Week Staffing.`,
      headlineSw: `Ushauri wa Ukuaji wa Compass: Panua ${topDeptName} na Udhibiti Matumizi Mwanzo wa Wiki.`,
      reason: `Across ${totalDays} logged days, your business generated KSh ${recentSales.toLocaleString()} in sales with clear weekend volume surges. Here are your high-impact next steps:`,
      reasonSw: `Kupitia siku ${totalDays} zilizorekodiwa, biashara imetengeneza KSh ${recentSales.toLocaleString()} kwa mauzo makubwa zaidi wikendi. Hizi hapa hatua zako muhimu:`,
      actionType: 'grow_business',
      actionableSteps,
      actionableStepsSw,
      keyMetrics: {
        topDepartment: topDeptName,
        tillPercentage: (totalTill + totalCash) > 0 ? Math.round((totalTill / (totalTill + totalCash)) * 100) : 0,
        averageDailySales: totalDays > 0 ? Math.round(recentSales / totalDays) : 0,
      }
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

