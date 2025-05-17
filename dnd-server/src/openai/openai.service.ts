import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { ChatMessage, LLMService } from '../llm/llm.interface';

@Injectable()
export class OpenaiService implements LLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async stream(
    messages: ChatMessage[],
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        /* These will eventually be the safeguards */
        // {
        //   role: 'system',
        //   content: `You are the Dungeon Master of a grounded dark fantasy DnD campaign. Respond as if narrating the world in real-time.
        //   Any other requests that does not relate to Dnd will not be allowed.`,
        // },
        ...messages,
      ],
      stream: true,
    });
    return stream;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });
    return response.choices[0]?.message?.content || '';
  }
}
