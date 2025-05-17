import { Stream } from 'openai/streaming';
import OpenAI from 'openai';

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface LLMService {
  stream(messages: ChatMessage[]): Promise<Stream<any>>;
  chat(messages: ChatMessage[]): Promise<string>;
}
