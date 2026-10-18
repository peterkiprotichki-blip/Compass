import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrowIntake, GrowIntakeSchema } from '../../database/schemas/grow-intake.schema';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GrowIntake.name, schema: GrowIntakeSchema }]),
    AiModule,
  ],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}
