import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export interface AiRecommendationInsight {
  executiveBrief: string;
  localCompetitiveEdge: string;
  dayOneActionChecklist: string[];
  riskShield: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private aiClient: GoogleGenAI | null = null;
  private readonly modelName = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (apiKey) {
      try {
        this.aiClient = new GoogleGenAI({ apiKey });
        this.logger.log('Gemini AI Client initialized successfully with model ' + this.modelName);
      } catch (err) {
        this.logger.error('Failed to initialize GoogleGenAI client', err);
      }
    } else {
      this.logger.warn('GEMINI_API_KEY is not set in environment.');
    }
  }

  async generatePersonalizedAdvisory(
    answers: Record<string, any>,
    archetype: string,
    readinessScore: number,
    topBusinessName: string,
    topBusinessCategory: string,
    capitalBand: string,
  ): Promise<AiRecommendationInsight> {
    const fallback: AiRecommendationInsight = {
      executiveBrief: `Based on your natural profile as ${archetype}, you have strong execution abilities suited for ${topBusinessName}. With an initial investment in ${capitalBand}, your best path is launching with strict cash flow control and high-touch customer service.`,
      localCompetitiveEdge: `Your chosen location provides an immediate advantage because neighborhood consumers are looking for reliable quality and courteous service that competitors often neglect.`,
      dayOneActionChecklist: [
        'Visit 3 local wholesale suppliers to compare unit costs and credit terms.',
        'Set up a separate dedicated mobile money till number for all sales receipts.',
        'Reach out to your first 10 prospective customers personally on WhatsApp.',
      ],
      riskShield: `Maintain at least 15% of your startup capital in an emergency reserve to cushion unexpected inventory delays or slow initial weeks.`,
    };

    if (!this.aiClient) {
      return fallback;
    }

    try {
      const prompt = `
You are the Lead African Business Strategist at Compass ("Guidance today. Brighter tomorrows. / Ideas to Impact").
Your voice: Direct, practical, encouraging, never flattering. Short sentences. No MBA jargon. Address the user directly as "you". Currency is always in KES (Kenya Shillings).

Entrepreneur Profile:
- Primary Archetype: ${archetype}
- Business Readiness Score: ${readinessScore} / 100
- Location: ${answers['q2'] || 'Urban / Town'} (${answers['q1'] || 'Kenya'})
- Available Capital: ${capitalBand}
- Recommended Business: ${topBusinessName} (${topBusinessCategory})
- What gives energy: ${answers['q6'] || 'Talking to people / Creating'}
- Unmet local products/services in their area: ${JSON.stringify(answers['q21'] || [])}
- Biggest neighborhood complaints: ${JSON.stringify(answers['q22'] || [])}
- Passion vision: ${answers['q23_passion'] || 'None stated'}

Provide a JSON response strictly matching this structure without Markdown formatting:
{
  "executiveBrief": "Two short, powerful paragraphs on why this business fits them and how to succeed in their local market.",
  "localCompetitiveEdge": "One crisp paragraph on how to exploit the specific neighborhood gaps and complaints they reported.",
  "dayOneActionChecklist": ["Action 1 for week 1", "Action 2 for week 1", "Action 3 for week 1"],
  "riskShield": "A concrete defensive strategy to prevent running out of cash or losing focus."
}
`;

      const response = await this.aiClient.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        executiveBrief: parsed.executiveBrief || fallback.executiveBrief,
        localCompetitiveEdge: parsed.localCompetitiveEdge || fallback.localCompetitiveEdge,
        dayOneActionChecklist: parsed.dayOneActionChecklist || fallback.dayOneActionChecklist,
        riskShield: parsed.riskShield || fallback.riskShield,
      };
    } catch (err) {
      this.logger.warn(`Gemini AI advisory fallback triggered: ${err.message}`);
      return fallback;
    }
  }

  async chatWithAdvisor(
    messages: { role: 'user' | 'model'; text: string }[],
    context?: string,
  ): Promise<string> {
    if (!this.aiClient) {
      return 'I am your Compass AI Business Advisor. Please configure the GEMINI_API_KEY in backend/.env to activate live intelligent chat.';
    }

    try {
      const systemInstruction = `
You are the Compass AI Business Advisor for African Entrepreneurs.
Voice: Grounded in African business realities (Kenya, East Africa, West Africa).
Clear, actionable, direct. Use KES currency where relevant. No theoretical fluff.
Always give real steps (e.g. suppliers in Gikomba/Dubois/CBD, M-Pesa till setup, county permits).
Context: ${context || 'Guiding an entrepreneur to launch and scale their venture.'}
`;

      const formattedContents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await this.aiClient.models.generateContent({
        model: this.modelName,
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
        ],
      });

      return response.text || 'I am ready to help you plan your next business step.';
    } catch (err) {
      this.logger.error('Error in chatWithAdvisor', err);
      return 'I encountered an issue generating your advisory response. Please try asking again in a moment.';
    }
  }

  async generateAiGrowthDiagnostic(growData: {
    businessType: string;
    operatingDuration: string;
    monthlySalesRange: string;
    biggestChallenge: string;
  }) {
    if (!this.aiClient) {
      return null;
    }

    try {
      const prompt = `
You are Compass AI analyzing an active African business for Business Compass.
Business Profile:
- Type: ${growData.businessType}
- Time Operating: ${growData.operatingDuration}
- Monthly Sales: ${growData.monthlySalesRange}
- Primary Bottleneck: ${growData.biggestChallenge}

Provide a JSON response (strictly JSON without markdown code fences):
{
  "strategicDiagnosis": "A direct 2-paragraph diagnosis of their core challenge and hidden cash leaks.",
  "topThreeFixes": ["Tactical Fix 1", "Tactical Fix 2", "Tactical Fix 3"],
  "mondayMorningMove": "One specific, non-negotiable step to take on Monday morning."
}
`;

      const response = await this.aiClient.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      this.logger.warn(`Gemini AI growth diagnostic fallback: ${err.message}`);
      return null;
    }
  }
}
