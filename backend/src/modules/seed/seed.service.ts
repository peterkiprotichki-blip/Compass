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
    const adminEmail = 'admin@compass.africa';
    const existingAdmin = await this.userModel.findOne({ email: adminEmail }).exec();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AdminCompass2026!', salt);

    if (!existingAdmin) {
      const superAdmin = new this.userModel({
        email: adminEmail,
        passwordHash,
        name: 'Compass Super Admin',
        role: 'super_admin',
        phone: '+254700000000',
        country: 'Kenya',
        language: 'en',
        authProvider: 'local',
        twoFactorChannel: 'email',
      });
      await superAdmin.save();
      this.logger.log(`Super Admin created: ${adminEmail} (Role: super_admin)`);
      return { message: 'Super Admin successfully created' };
    } else {
      // Ensure super_admin role and valid password
      existingAdmin.role = 'super_admin';
      existingAdmin.passwordHash = passwordHash;
      if (!existingAdmin.phone) existingAdmin.phone = '+254700000000';
      await existingAdmin.save();
      this.logger.log(`Super Admin verified: ${adminEmail} (Role: super_admin)`);
      return { message: 'Super Admin already exists and verified' };
    }
  }
}
