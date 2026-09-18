import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Assessment, AssessmentDocument } from '../../database/schemas/assessment.schema';
import { Result, ResultDocument } from '../../database/schemas/result.schema';
import { Journey, JourneyDocument } from '../../database/schemas/journey.schema';
import { GrowIntake, GrowIntakeDocument } from '../../database/schemas/grow-intake.schema';
import { Business, BusinessDocument } from '../../database/schemas/business.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel(Journey.name) private journeyModel: Model<JourneyDocument>,
    @InjectModel(GrowIntake.name) private growIntakeModel: Model<GrowIntakeDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  async getStats() {
    const [
      totalApplicants,
      totalAssessments,
      totalJourneys,
      totalGrowIntakes,
      results,
      allJourneys,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: { $ne: 'super_admin' } }),
      this.assessmentModel.countDocuments(),
      this.journeyModel.countDocuments(),
      this.growIntakeModel.countDocuments(),
      this.resultModel.find().lean().exec(),
      this.journeyModel.find().lean().exec(),
    ]);

    // Compute average readiness score
    const avgReadinessScore = results.length > 0
      ? Math.round(results.reduce((acc, r) => acc + (r.readinessScore || 0), 0) / results.length)
      : 0;

    // Archetype breakdown
    const archetypeCounts: Record<string, number> = {};
    const riskCounts: Record<string, number> = { Conservative: 0, Moderate: 0, Aggressive: 0 };
    const categoryCounts: Record<string, number> = {};

    for (const r of results) {
      const arch = r.primaryArchetype || 'Unclassified';
      archetypeCounts[arch] = (archetypeCounts[arch] || 0) + 1;

      if (r.riskProfile && riskCounts[r.riskProfile] !== undefined) {
        riskCounts[r.riskProfile]++;
      } else if (r.riskProfile) {
        riskCounts[r.riskProfile] = (riskCounts[r.riskProfile] || 0) + 1;
      }

      if (r.topMatches && r.topMatches.length > 0) {
        const cat = r.topMatches[0].category || 'General';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    }

    // Journey completion rate
    const completedJourneys = allJourneys.filter(j => j.progressPercentage >= 100 || j.isCompleted).length;
    const avgJourneyProgress = allJourneys.length > 0
      ? Math.round(allJourneys.reduce((acc, j) => acc + (j.progressPercentage || 0), 0) / allJourneys.length)
      : 0;

    return {
      kpis: {
        totalApplicants,
        totalAssessments,
        totalJourneys,
        completedJourneys,
        avgJourneyProgress,
        totalGrowIntakes,
        avgReadinessScore,
      },
      archetypes: Object.entries(archetypeCounts).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / (results.length || 1)) * 100),
      })),
      riskProfiles: Object.entries(riskCounts).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / (results.length || 1)) * 100),
      })),
      topCategories: Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
      })).sort((a, b) => b.count - a.count),
    };
  }

  async getAllApplicants() {
    const users = await this.userModel.find().sort({ createdAt: -1 }).lean().exec();

    // Enrich users with counts
    const enriched = await Promise.all(
      users.map(async (u: any) => {
        const [assessmentsCount, journeysCount] = await Promise.all([
          this.assessmentModel.countDocuments({ userId: u._id.toString() }),
          this.journeyModel.countDocuments({ userId: u._id.toString() }),
        ]);

        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || 'user',
          phone: u.phone || null,
          country: u.country || 'Kenya',
          language: u.language || 'en',
          authProvider: u.authProvider || 'local',
          assessmentsCount,
          journeysCount,
          savedPathsCount: (u.savedPaths || []).length,
          createdAt: u.createdAt,
        };
      }),
    );

    return enriched;
  }

  async getAllApplications() {
    const results = await this.resultModel.find().sort({ createdAt: -1 }).lean().exec();

    // Attach user info where available
    const enriched = await Promise.all(
      results.map(async (r: any) => {
        let user: any = null;
        if (r.userId && !r.userId.startsWith('guest_')) {
          try {
            user = await this.userModel.findById(r.userId).lean().exec();
          } catch (e) {}
        }

        return {
          id: r._id,
          assessmentId: r.assessmentId,
          userId: r.userId,
          applicantName: user ? user.name : (r.userId?.startsWith('guest_') ? 'Guest Applicant' : 'Registered Applicant'),
          applicantEmail: user ? user.email : 'N/A',
          primaryArchetype: r.primaryArchetype,
          secondaryArchetype: r.secondaryArchetype,
          readinessScore: r.readinessScore,
          readinessVerdict: r.readinessVerdict,
          riskProfile: r.riskProfile,
          topMatchName: r.topMatches?.[0]?.name || 'N/A',
          topMatchCategory: r.topMatches?.[0]?.category || 'N/A',
          createdAt: r.createdAt,
          hasAiInsight: !!r.aiInsight,
        };
      }),
    );

    return enriched;
  }

  async getApplicationDetails(resultId: string) {
    const result = await this.resultModel.findById(resultId).lean().exec();
    if (!result) {
      throw new NotFoundException('Assessment result not found');
    }

    let assessment: any = null;
    if (result.assessmentId) {
      assessment = await this.assessmentModel.findById(result.assessmentId).lean().exec();
    }

    let user: any = null;
    if (result.userId && !result.userId.startsWith('guest_')) {
      try {
        user = await this.userModel.findById(result.userId).lean().exec();
      } catch (e) {}
    }

    return {
      result,
      assessment,
      user,
    };
  }

  async getAllJourneys() {
    const journeys = await this.journeyModel.find().sort({ updatedAt: -1 }).lean().exec();

    const enriched = await Promise.all(
      journeys.map(async (j: any) => {
        let user: any = null;
        if (j.userId && !j.userId.startsWith('guest_')) {
          try {
            user = await this.userModel.findById(j.userId).lean().exec();
          } catch (e) {}
        }

        const totalTasks = (j.weeks || []).reduce((acc: number, w: any) => acc + (w.tasks?.length || 0), 0);
        const completedTasks = (j.weeks || []).reduce(
          (acc: number, w: any) => acc + (w.tasks?.filter((t: any) => t.completed)?.length || 0),
          0,
        );

        return {
          id: j._id,
          userId: j.userId,
          applicantName: user ? user.name : 'Entrepreneur',
          applicantEmail: user ? user.email : 'N/A',
          businessId: j.businessId,
          businessName: j.businessName,
          progressPercentage: j.progressPercentage,
          isCompleted: j.isCompleted,
          totalTasks,
          completedTasks,
          weeks: j.weeks,
          updatedAt: j.updatedAt,
          createdAt: j.createdAt,
        };
      }),
    );

    return enriched;
  }

  async getGrowIntakes() {
    const intakes = await this.growIntakeModel.find().sort({ createdAt: -1 }).lean().exec();

    const enriched = await Promise.all(
      intakes.map(async (item: any) => {
        let user: any = null;
        if (item.userId && !item.userId.startsWith('guest_')) {
          try {
            user = await this.userModel.findById(item.userId).lean().exec();
          } catch (e) {}
        }

        return {
          id: item._id,
          applicantName: user ? user.name : 'Business Owner',
          applicantEmail: user ? user.email : 'N/A',
          businessType: item.businessType,
          operatingDuration: item.operatingDuration,
          monthlySalesRange: item.monthlySalesRange,
          biggestChallenge: item.biggestChallenge,
          status: item.status,
          notes: item.notes,
          createdAt: item.createdAt,
        };
      }),
    );

    return enriched;
  }
}
