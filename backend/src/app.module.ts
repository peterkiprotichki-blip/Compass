import './env';
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

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = (process.env.MONGODB_URI || '').trim();
        if (!uri) {
          throw new Error(
            'MONGODB_URI is not set. Copy backend/.env.example to backend/.env and add your connection string.',
          );
        }
        return {
          uri,
          serverSelectionTimeoutMS: 5000,
        };
      },
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
