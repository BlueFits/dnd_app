import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PlayerData } from '../llm/llm.interface';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async systemUpdate(player: PlayerData): Promise<void> {
    // Empty systemUpdate method as requested
  }
} 