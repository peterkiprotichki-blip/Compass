import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Business, BusinessDocument } from '../../database/schemas/business.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { SEED_BUSINESSES } from './seed.data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.VERCEL) {
      return; // Database already seeded in Atlas
    }
    try {
      await this.seedBusinesses();
      await this.seedSuperAdmin();
    } catch (err) {
      this.logger.warn(`Automatic seeding deferred or database offline: ${err.message}`);
    }
  }

  async seedBusinesses(): Promise<{ message: string; count: number }> {
    const existingCount = await this.businessModel.countDocuments();
    if (existingCount < SEED_BUSINESSES.length) {
      this.logger.log(`Seeding African businesses database (${SEED_BUSINESSES.length} items)...`);
      for (const biz of SEED_BUSINESSES) {
        await this.businessModel.updateOne(
          { slug: biz.slug },
          { $set: biz },
          { upsert: true },
        );
      }
      this.logger.log(`Seeding complete. ${SEED_BUSINESSES.length} businesses ready.`);
      return { message: 'Database successfully seeded', count: SEED_BUSINESSES.length };
    }
    return { message: 'Database already contains businesses', count: existingCount };
  }

  async seedSuperAdmin(): Promise<{ message: string }> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AdminCompass2026!', salt);

    const admins = [
      {
        email: 'peterkiprotichki@gmail.com',
        name: 'Peter Kiprotich',
        role: 'super_admin',
        phone: '+254700000000',
        country: 'Kenya',
        language: 'en',
      },
      {
        email: 'admin@compass.africa',
        name: 'Compass Super Admin',
        role: 'super_admin',
        phone: '+254700000000',
        country: 'Kenya',
        language: 'en',
      },
    ];

    for (const adm of admins) {
      const existing = await this.userModel.findOne({ email: adm.email }).exec();
      if (!existing) {
        const superAdmin = new this.userModel({
          email: adm.email,
          passwordHash,
          name: adm.name,
          role: 'super_admin',
          phone: adm.phone,
          country: adm.country,
          language: adm.language,
          authProvider: 'local',
          twoFactorChannel: 'email',
        });
        await superAdmin.save();
        this.logger.log(`Super Admin created: ${adm.email} (Role: super_admin)`);
      } else {
        existing.role = 'super_admin';
        existing.passwordHash = passwordHash;
        if (!existing.phone) existing.phone = adm.phone;
        await existing.save();
        this.logger.log(`Super Admin verified: ${adm.email} (Role: super_admin)`);
      }
    }
    return { message: 'Super Admins successfully verified and seeded' };
  }
}
