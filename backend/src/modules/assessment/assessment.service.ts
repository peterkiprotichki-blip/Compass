import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment, AssessmentDocument } from '../../database/schemas/assessment.schema';
import { Result, ResultDocument } from '../../database/schemas/result.schema';
import { Business, BusinessDocument } from '../../database/schemas/business.schema';
import { ScoringService } from '../engine/scoring.service';
import { CANONICAL_QUESTIONS, CANONICAL_SECTIONS } from '../engine/questions.data';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class AssessmentService implements OnModuleInit {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    private readonly scoringService: ScoringService,
    private readonly geminiService: GeminiService,
  ) {}

  // Warm the scoring cache at boot so the first submission is as fast as the rest.
  onModuleInit() {
    this.getScoringBusinesses().catch(() => undefined);
  }

  getQuestionnaire() {
    return {
      sections: CANONICAL_SECTIONS,
      questions: CANONICAL_QUESTIONS,
      totalQuestions: 22,
    };
  }

  // Only the fields the scoring engine reads: skips descriptions and the
  // large thirtyDayPlan arrays that used to dominate this query.
  private static readonly SCORING_FIELDS =
    'slug name nameSw category categorySw capitalRequiredMin capitalRequiredMax capitalBand currency ' +
    'bestArchetypes idealStrengths locationFit timeCommitment difficulty riskLevel firstCustomerTimeline ' +
    'skillsNeeded capitalSplit biggestAdvantage biggestRisk firstStep imageUrl';

  private static readonly BUSINESS_CACHE_TTL_MS = 30_000;
  private businessCache: { businesses: Business[]; cachedAt: number } | null = null;

  private async getScoringBusinesses(): Promise<Business[]> {
    const hit = this.businessCache;
    if (hit && Date.now() - hit.cachedAt < AssessmentService.BUSINESS_CACHE_TTL_MS) {
      return hit.businesses;
    }

    const businesses = (await this.businessModel
      .find({}, AssessmentService.SCORING_FIELDS)
      .lean()
      .exec()) as unknown as Business[];

    if (businesses.length > 0) {
      this.businessCache = { businesses, cachedAt: Date.now() };
    }
    return businesses;
  }

  async submitAssessment(answers: Record<string, any>, userId?: string) {
    // 1. Save raw assessment + load businesses in parallel
    const [savedAssessment, businesses] = await Promise.all([
      new this.assessmentModel({
        userId: userId || null,
        answers,
        version: '1.0',
      }).save(),
      this.getScoringBusinesses(),
    ]);

    // 2. Compute score and recommendations
    const calculatedResult = this.scoringService.computeFullResult(
      savedAssessment._id.toString(),
      answers,
      businesses,
      userId,
    );

    // 3. Generate Strategic Brief & Recommendations instantly
    const topBiz = calculatedResult.topMatches?.[0];
    const archetype = calculatedResult.primaryArchetype || 'The Seller';
    const capital = answers['q3'] || '50k_100k';

    calculatedResult.aiInsight = {
      executiveBrief: `Based on your natural profile as ${archetype}, you have strong execution abilities suited for ${topBiz?.name || 'an African retail venture'}. With an initial investment in ${capital}, your best path is launching lean with disciplined cash flow control and high-touch customer service.`,
      localCompetitiveEdge: `Your chosen location provides an immediate advantage because neighborhood consumers are looking for reliable quality and courteous service that incumbent competitors frequently neglect.`,
      dayOneActionChecklist: [
        'Visit 3 local wholesale suppliers to compare unit costs and credit terms.',
        'Set up a separate dedicated mobile money till number for all sales receipts.',
        'Reach out to your first 10 prospective customers personally on WhatsApp.',
      ],
      riskShield: `Maintain at least 15% of your startup capital in an emergency reserve to cushion unexpected inventory delays or slow initial weeks.`,
    };

    // 4. Save the result and clear any in-progress draft in parallel
    const result = new this.resultModel(calculatedResult);
    const draftCleanup = userId
      ? this.assessmentModel.deleteMany({ userId, status: 'draft' }).exec()
      : Promise.resolve(null);

    const [savedResult] = await Promise.all([result.save(), draftCleanup]);

    return savedResult;
  }

  async saveProgress(
    userId: string,
    answers: Record<string, any>,
    currentQuestionIndex = 0,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required to save assessment progress');
    }

    return this.assessmentModel
      .findOneAndUpdate(
        { userId, status: 'draft' },
        {
          $set: {
            userId,
            answers: answers || {},
            currentQuestionIndex: currentQuestionIndex || 0,
            status: 'draft',
          },
        },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  async getProgress(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required to fetch assessment progress');
    }

    return this.assessmentModel
      .findOne({ userId, status: 'draft' })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getResultById(resultId: string): Promise<Result> {
    const res = await this.resultModel.findById(resultId).exec();
    if (!res) {
      throw new NotFoundException(`Result with id '${resultId}' not found`);
    }
    return res;
  }

  async getUserResults(userId: string): Promise<Result[]> {
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
