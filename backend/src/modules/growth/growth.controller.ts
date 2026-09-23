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
      itemsSold?: ItemSold[];
      notes?: string;
    },
  ) {
    return this.growthService.recordDailyTracking(id, body);
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

