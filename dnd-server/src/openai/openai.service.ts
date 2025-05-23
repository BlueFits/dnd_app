import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { ChatMessage, LLMService, PlayerData } from '../llm/llm.interface';
import { PromptManagerService } from '../llm/prompts/prompt-manager.service';

@Injectable()
export class OpenaiService implements LLMService {
  private openai: OpenAI;
  private readonly model: OpenAI.Chat.ChatCompletionCreateParams['model'];

  constructor(private readonly promptManager: PromptManagerService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model =
      process.env.NODE_ENV === 'production'
        ? ((process.env.OPENAI_MODEL_PROD ||
            'gpt-4o') as OpenAI.Chat.ChatCompletionCreateParams['model'])
        : ((process.env.OPENAI_MODEL_DEV ||
            'gpt-3.5-turbo') as OpenAI.Chat.ChatCompletionCreateParams['model']);
  }

  async stream(
    messages: ChatMessage[],
    player: PlayerData,
    modifications?: ChatMessage[],
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const messagesWithPrompts = this.promptManager.applyPrompts(
      messages,
      player,
      modifications,
    );

    const stream = await this.openai.chat.completions.create({
      model: this.model,
      messages: messagesWithPrompts,
      stream: true,
    });
    return stream;
  }

  async chat(
    messages: ChatMessage[],
    player: PlayerData,
    modifications?: ChatMessage[],
  ): Promise<string> {
    const messagesWithPrompts = this.promptManager.applyPrompts(
      messages,
      player,
      modifications,
    );

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: messagesWithPrompts,
    });
    return response.choices[0]?.message?.content || '';
  }
}
