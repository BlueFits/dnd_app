import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { ChatMessage, LLMService } from '../llm/llm.interface';
import { PromptManagerService } from '../llm/prompts/prompt-manager.service';

@Injectable()
export class OpenaiService implements LLMService {
  private openai: OpenAI;

  constructor(private readonly promptManager: PromptManagerService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async stream(
    messages: ChatMessage[],
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const messagesWithPrompts = this.promptManager.applyPrompts(messages);

    const stream = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesWithPrompts,
      stream: true,
    });
    return stream;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const messagesWithPrompts = this.promptManager.applyPrompts(messages);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: messagesWithPrompts,
    });
    return response.choices[0]?.message?.content || '';
  }
}
