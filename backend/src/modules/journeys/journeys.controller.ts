import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { JourneysService } from './journeys.service';

@Controller('journeys')
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Post('start')
  async startJourney(@Body() body: { userId: string; businessSlug: string }) {
    return this.journeysService.startJourney(body.userId, body.businessSlug);
  }

  @Get('user/:userId')
  async getJourneysByUser(@Param('userId') userId: string) {
    return this.journeysService.getJourneysByUser(userId);
  }

  @Get(':id')
  async getJourneyById(@Param('id') id: string) {
    return this.journeysService.getJourneyById(id);
  }

  @Patch(':id/toggle-task')
  async toggleTask(
    @Param('id') id: string,
    @Body() body: { taskId: string },
  ) {
    return this.journeysService.toggleTask(id, body.taskId);
  }
}
