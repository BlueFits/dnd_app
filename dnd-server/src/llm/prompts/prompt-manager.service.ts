import { Injectable } from '@nestjs/common';
import { ChatMessage } from '../llm.interface';
import { DND_PROMPTS, PromptConfig } from './dnd.prompts';

@Injectable()
export class PromptManagerService {
  private activePrompts: PromptConfig[] = DND_PROMPTS;

  /**
   * Applies configured prompts to the message array
   * @param messages Original messages array
   * @returns New messages array with prompts prepended
   */
  applyPrompts(messages: ChatMessage[]): ChatMessage[] {
    // Sort prompts by priority (highest first)
    const sortedPrompts = [...this.activePrompts].sort(
      (a, b) => b.priority - a.priority,
    );

    // Convert prompts to ChatMessage format
    const systemMessages = sortedPrompts.map((prompt) => ({
      role: prompt.role,
      content: prompt.content,
    }));

    // Return combined messages with prompts first
    return [...systemMessages, ...messages];
  }

  /**
   * Updates the active prompts
   * @param prompts New prompts to use
   */
  updatePrompts(prompts: PromptConfig[]): void {
    this.activePrompts = prompts;
  }
}
