import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('ai')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(
    @Body() body: {
      messages: { role: 'user' | 'model'; text: string }[];
      context?: string;
    },
  ) {
    const reply = await this.geminiService.chatWithAdvisor(body.messages, body.context);
    return { reply };
  }

  @Post('advisory')
  async getAdvisory(
    @Body() body: {
      answers: Record<string, any>;
      archetype: string;
      readinessScore: number;
      topBusinessName: string;
      topBusinessCategory: string;
      capitalBand: string;
    },
  ) {
    return this.geminiService.generatePersonalizedAdvisory(
      body.answers,
      body.archetype,
      body.readinessScore,
      body.topBusinessName,
      body.topBusinessCategory,
      body.capitalBand,
    );
  }
}
