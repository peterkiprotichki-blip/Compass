import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Assessment, AssessmentSchema } from '../../database/schemas/assessment.schema';
import { Result, ResultSchema } from '../../database/schemas/result.schema';
import { Business, BusinessSchema } from '../../database/schemas/business.schema';
import { ScoringService } from '../engine/scoring.service';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: Result.name, schema: ResultSchema },
      { name: Business.name, schema: BusinessSchema },
    ]),
    AiModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, ScoringService],
  exports: [AssessmentService, ScoringService],
})
export class AssessmentModule {}
