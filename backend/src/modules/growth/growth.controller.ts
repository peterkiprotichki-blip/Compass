import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GrowthService } from './growth.service';
import { ItemSold, StockItem } from '../../database/schemas/grow-intake.schema';

@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Post('intake')
  async submitIntake(
    @Body()
    body: {
      userId?: string;
      businessType: string;
      operatingDuration: string;
      originalInvestment?: string;
      peopleCount?: string;
      biggestChallenge: string;
      mostLikeToImprove?: string;
      financialTrackingAbility?: string;
      optionalFinancials?: any;
      monthlySalesRange?: string;
    },
  ) {
    return this.growthService.submitIntake(body);
  }

  @Get('intake/:id')
  async getIntake(@Param('id') id: string) {
    return this.growthService.getIntake(id);
  }

  @Get('recent')
  async getRecentIntakes(@Query('userId') userId?: string) {
    return this.growthService.getRecentIntakes(userId);
  }

  @Post('intake/:id/daily')
  async recordDailyTracking(
    @Param('id') id: string,
    @Body()
    body: {
      date: string;
      sales: number;
      expenses: number;
      cashTotal?: number;
      tillTotal?: number;
      departmentBreakdown?: any[];
      expenseBreakdown?: any[];
      itemsSold?: ItemSold[];
      notes?: string;
      rawText?: string;
    },
  ) {
    return this.growthService.recordDailyTracking(id, body);
  }

  @Post('intake/:id/daily/bulk')
  async recordBulkDailyTracking(
    @Param('id') id: string,
    @Body() body: { records: any[] },
  ) {
    return this.growthService.recordBulkDailyTracking(id, body.records || []);
  }

  @Patch('intake/:id/daily/:recordId')
  async updateDailyRecord(
    @Param('id') id: string,
    @Param('recordId') recordId: string,
    @Body()
    body: {
      date: string;
      sales?: number;
      expenses?: number;
      cashTotal?: number;
      tillTotal?: number;
      departmentBreakdown?: any[];
      expenseBreakdown?: any[];
      itemsSold?: ItemSold[];
      notes?: string;
    },
  ) {
    return this.growthService.updateDailyRecord(id, recordId, body);
  }

  @Post('intake/:id/ai-analysis')
  async runAiSalesAnalysis(
    @Param('id') id: string,
    @Body('timeframe') bodyTimeframe?: string,
    @Query('timeframe') queryTimeframe?: string,
  ) {
    const timeframe = bodyTimeframe || queryTimeframe || 'all';
    return this.growthService.runAiSalesAnalysis(id, timeframe);
  }

  @Delete('intake/:id/daily/:recordId')
  async deleteDailyRecord(
    @Param('id') id: string,
    @Param('recordId') recordId: string,
  ) {
    return this.growthService.deleteDailyRecord(id, recordId);
  }

  @Post('intake/:id/departments')
  async addDepartment(
    @Param('id') id: string,
    @Body('department') department: string,
  ) {
    return this.growthService.addDepartment(id, department);
  }

  @Delete('intake/:id/departments/:department')
  async deleteDepartment(
    @Param('id') id: string,
    @Param('department') department: string,
  ) {
    return this.growthService.deleteDepartment(id, department);
  }

  @Post('intake/:id/stock')
  async addStockItem(
    @Param('id') id: string,
    @Body() body: { name: string; quantity: number; buyingPrice: number; sellingPrice: number },
  ) {
    return this.growthService.addStockItem(id, body);
  }

  @Patch('intake/:id/stock/:itemId')
  async updateStockItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: Partial<StockItem>,
  ) {
    return this.growthService.updateStockItem(id, itemId, body);
  }

  @Delete('intake/:id/stock/:itemId')
  async deleteStockItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.growthService.deleteStockItem(id, itemId);
  }

  @Post('intake/:id/unlock')
  async unlockPremium(@Param('id') id: string) {
    return this.growthService.unlockPremium(id);
  }
}

