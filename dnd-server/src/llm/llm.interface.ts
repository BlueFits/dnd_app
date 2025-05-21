import { Stream } from 'openai/streaming';
import OpenAI from 'openai';

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface PlayerData {
  name: string;
  level: number;
  reputation: string;
  traits: string[];
  inventory: string[];
}

export interface ChatRequest {
  messages: ChatMessage[];
  player: PlayerData;
}

export interface LLMService {
  stream(messages: ChatMessage[], player: PlayerData): Promise<Stream<any>>;
  chat(messages: ChatMessage[], player: PlayerData): Promise<string>;
}
