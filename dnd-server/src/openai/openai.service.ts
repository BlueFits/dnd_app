import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
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
}
