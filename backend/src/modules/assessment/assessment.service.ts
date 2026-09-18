import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment, AssessmentDocument } from '../../database/schemas/assessment.schema';
import { Result, ResultDocument } from '../../database/schemas/result.schema';
import { Business, BusinessDocument } from '../../database/schemas/business.schema';
import { ScoringService } from '../engine/scoring.service';
import { CANONICAL_QUESTIONS, CANONICAL_SECTIONS } from '../engine/questions.data';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    private readonly scoringService: ScoringService,
    private readonly geminiService: GeminiService,
  ) {}

  getQuestionnaire() {
    return {
      sections: CANONICAL_SECTIONS,
      questions: CANONICAL_QUESTIONS,
      totalQuestions: 22,
    };
  }

  async submitAssessment(answers: Record<string, any>, userId?: string) {
    // 1. Save raw assessment
    const assessment = new this.assessmentModel({
      userId: userId || null,
      answers,
      version: '1.0',
    });
    const savedAssessment = await assessment.save();

    // 2. Fetch all businesses for matching
    const businesses = await this.businessModel.find().exec();

    // 3. Compute score and recommendations
    const calculatedResult = this.scoringService.computeFullResult(
      savedAssessment._id.toString(),
      answers,
      businesses,
      userId,
    );

    // 4. Generate Gemini AI Strategic Brief & Recommendations with fail-safe timeout
    const topBiz = calculatedResult.topMatches?.[0];
    let aiInsight: any = null;
    try {
      aiInsight = await Promise.race([
        this.geminiService.generatePersonalizedAdvisory(
          answers,
          calculatedResult.primaryArchetype || 'The Seller',
          calculatedResult.readinessScore || 80,
          topBiz?.name || 'Retail Business',
          topBiz?.category || 'Retail',
          answers['q3'] || '50k_100k',
        ),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('AI advisory timeout')), 8000),
        ),
      ]);
    } catch (err) {
      console.warn(`[AssessmentService] AI advisory fallback used: ${err.message}`);
      aiInsight = {
        executiveBrief: `Based on your natural profile as ${calculatedResult.primaryArchetype}, you have strong execution abilities suited for ${topBiz?.name || 'an African retail venture'}. With disciplined cash flow control, you have a solid runway to reach profitability.`,
        localCompetitiveEdge: `Your chosen location provides an immediate advantage because neighborhood consumers are looking for reliable quality and courteous service that competitors often neglect.`,
        dayOneActionChecklist: [
          'Visit 3 local wholesale suppliers to compare unit costs and credit terms.',
          'Set up a separate dedicated mobile money till number for all sales receipts.',
          'Reach out to your first 10 prospective customers personally on WhatsApp.',
        ],
        riskShield: `Maintain at least 15% of your startup capital in an emergency reserve to cushion unexpected inventory delays or slow initial weeks.`,
      };
    }

    calculatedResult.aiInsight = aiInsight;

    // 5. Save and return full result
    const result = new this.resultModel(calculatedResult);
    const savedResult = await result.save();

    return savedResult;
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
