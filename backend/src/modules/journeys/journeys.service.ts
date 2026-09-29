import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journey, JourneyDocument } from '../../database/schemas/journey.schema';
import { Business, BusinessDocument } from '../../database/schemas/business.schema';

@Injectable()
export class JourneysService {
  constructor(
    @InjectModel(Journey.name) private journeyModel: Model<JourneyDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  async startJourney(userId: string, rawSlug: string) {
    if (!rawSlug) {
      throw new NotFoundException('Business slug is required');
    }

    const decoded = decodeURIComponent(rawSlug).trim();

    // 1. Exact match
    let business = await this.businessModel.findOne({ slug: decoded }).exec();

    // 2. Normalized hyphenated slug
    if (!business) {
      const hyphenated = decoded
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      business = await this.businessModel.findOne({ slug: hyphenated }).exec();
    }

    // 3. Case-insensitive regex match
    if (!business) {
      const hyphenated = decoded
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      business = await this.businessModel.findOne({
        slug: { $regex: new RegExp(`^${hyphenated}$`, 'i') }
      }).exec();
    }

    // 4. Name match
    if (!business) {
      const nameSearch = decoded.replace(/-/g, ' ');
      business = await this.businessModel.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${nameSearch}$`, 'i') } },
          { name: { $regex: new RegExp(decoded, 'i') } },
          { nameSw: { $regex: new RegExp(decoded, 'i') } }
        ]
      }).exec();
    }

    if (!business) {
      throw new NotFoundException(`Business '${rawSlug}' not found`);
    }

    const businessSlug = business.slug;

    // Check if user already has an active journey for this business
    let journey = await this.journeyModel.findOne({ userId, businessId: businessSlug }).exec();
    if (journey) {
      return journey;
    }

    // Transform business thirtyDayPlan into trackable tasks
    const weeks = (business.thirtyDayPlan || []).map(w => ({
      week: w.week,
      title: w.title,
      tasks: (w.tasks || []).map((t, idx) => ({
        id: `w${w.week}_t${idx + 1}`,
        title: t,
        completed: false,
      })),
    }));

    journey = new this.journeyModel({
      userId,
      businessId: businessSlug,
      businessName: business.name,
      progressPercentage: 0,
      weeks,
      isCompleted: false,
    });

    return journey.save();
  }

  async getJourneysByUser(userId: string) {
    return this.journeyModel.find({ userId }).sort({ updatedAt: -1 }).exec();
  }

  async getJourneyById(id: string) {
    const journey = await this.journeyModel.findById(id).exec();
    if (!journey) {
      throw new NotFoundException(`Journey '${id}' not found`);
    }
    return journey;
  }

  async toggleTask(journeyId: string, taskId: string) {
    const journey = await this.journeyModel.findById(journeyId).exec();
    if (!journey) {
      throw new NotFoundException(`Journey '${journeyId}' not found`);
    }

    let totalTasks = 0;
    let completedTasks = 0;

    journey.weeks.forEach(w => {
      w.tasks.forEach(t => {
        if (t.id === taskId) {
          t.completed = !t.completed;
        }
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    journey.progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    journey.isCompleted = journey.progressPercentage === 100;

    journey.markModified('weeks');
    return journey.save();
  }
}
