import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GrowthService } from './growth.service';

@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Post('intake')
  async submitIntake(
    @Body() body: {
      userId?: string;
      businessType: string;
      operatingDuration: string;
      monthlySalesRange: string;
      biggestChallenge: string;
    },
  ) {
    return this.growthService.submitIntake(body);
  }

  @Get('recent')
  async getRecentIntakes(@Query('userId') userId?: string) {
    return this.growthService.getRecentIntakes(userId);
  }
}
