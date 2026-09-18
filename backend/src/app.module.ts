import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { JourneysModule } from './modules/journeys/journeys.module';
import { GrowthModule } from './modules/growth/growth.module';
import { SeedModule } from './modules/seed/seed.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const DEFAULT_MONGODB_URI =
  'mongodb+srv://peterkiprotichki_db_user:FyONfVf7VlHKuPuK@cluster0.hbo4kvh.mongodb.net/compass?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || DEFAULT_MONGODB_URI,
        serverSelectionTimeoutMS: 5000,
      }),
    }),
    AuthModule,
    BusinessesModule,
    AssessmentModule,
    JourneysModule,
    GrowthModule,
    SeedModule,
    AiModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
