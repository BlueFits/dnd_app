import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(prompt: ResponseInput) {
    const response = await this.openai.responses.create({
      model: 'gpt-4.1',
      input: prompt,
    });
    return response;
  }
}
