import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AssessmentService } from './assessment.service';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get('questions')
  getQuestionnaire() {
    return this.assessmentService.getQuestionnaire();
  }

  @Post('submit')
  async submitAssessment(
    @Body() payload: { answers: Record<string, any>; userId?: string },
  ) {
    return this.assessmentService.submitAssessment(payload.answers, payload.userId);
  }

  @Get('results/:id')
  async getResultById(@Param('id') id: string) {
    return this.assessmentService.getResultById(id);
  }

  @Get('user/:userId')
  async getUserResults(@Param('userId') userId: string) {
    return this.assessmentService.getUserResults(userId);
  }
}
