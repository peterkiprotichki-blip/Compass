import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Assessment, AssessmentSchema } from '../../database/schemas/assessment.schema';
import { Result, ResultSchema } from '../../database/schemas/result.schema';
import { Journey, JourneySchema } from '../../database/schemas/journey.schema';
import { GrowIntake, GrowIntakeSchema } from '../../database/schemas/grow-intake.schema';
import { Business, BusinessSchema } from '../../database/schemas/business.schema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Assessment.name, schema: AssessmentSchema },
      { name: Result.name, schema: ResultSchema },
      { name: Journey.name, schema: JourneySchema },
      { name: GrowIntake.name, schema: GrowIntakeSchema },
      { name: Business.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
