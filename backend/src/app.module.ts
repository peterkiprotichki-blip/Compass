import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://127.0.0.1:27017/compass',
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
