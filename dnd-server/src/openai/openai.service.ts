import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(prompt: string) {
    // const response = await this.openai.responses.create({
    //     model: 'gpt-4.1',
    //     input: prompt,
    // });
    return prompt;
  }
}
