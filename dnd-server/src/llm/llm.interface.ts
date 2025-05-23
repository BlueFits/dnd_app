import { Stream } from 'openai/streaming';
import OpenAI from 'openai';

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface PlayerData {
  name: string;
  level: number;
  experience: number;
  reputation: string;
  traits: string[];
  inventory: string[];
}

export interface ChatRequest {
  messages: ChatMessage[];
  player: PlayerData;
  modifications?: { role: 'system'; content: string }[];
}

export interface CharacterUpdateRequest {
  messages: ChatMessage;
  player: PlayerData;
}

export interface LLMService {
  stream(
    messages: ChatMessage[],
    player: PlayerData,
    modifications?: { role: 'system'; content: string }[],
  ): Promise<Stream<any>>;
  chat(
    messages: ChatMessage[],
    player: PlayerData,
    modifications?: { role: 'system'; content: string }[],
  ): Promise<string>;
}

export interface CharacterUpdateService {
  updateCharacter(
    messages: ChatMessage,
    player: PlayerData,
  ): Promise<PlayerData>;
  generateTags(narration: string): Promise<string>;
}
