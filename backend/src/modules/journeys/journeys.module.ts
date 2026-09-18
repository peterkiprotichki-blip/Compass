import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Journey, JourneySchema } from '../../database/schemas/journey.schema';
import { Business, BusinessSchema } from '../../database/schemas/business.schema';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Journey.name, schema: JourneySchema },
      { name: Business.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService],
})
export class JourneysModule {}
