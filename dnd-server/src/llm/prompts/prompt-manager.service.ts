import { Injectable } from '@nestjs/common';
import { ChatMessage, PlayerData } from '../llm.interface';
import { DND_PROMPTS, PromptConfig } from './dnd.prompts';

@Injectable()
export class PromptManagerService {
  private activePrompts: PromptConfig[] = DND_PROMPTS;

  private createPlayerContext(player: PlayerData): PromptConfig {
    return {
      role: 'system',
      content: `
      Current player state:
      Name: ${player.name}
      Level: ${player.level}
      Reputation: ${player.reputation}
      Traits: ${player.traits.join(', ')}
      Inventory: ${player.inventory.join(', ')}
      Use this information to provide context-aware responses and maintain consistency in the narrative.`,
      priority: 3, // Higher priority than other prompts to ensure it's always first
    };
  }

  /**
   * Applies configured prompts to the message array
   * @param messages Original messages array
   * @param player Current player data
   * @returns New messages array with prompts prepended
   */
  applyPrompts(messages: ChatMessage[], player?: PlayerData): ChatMessage[] {
    // Sort prompts by priority (highest first)
    const sortedPrompts = [...this.activePrompts].sort(
      (a, b) => b.priority - a.priority,
    );

    // Convert prompts to ChatMessage format
    const systemMessages = sortedPrompts.map((prompt) => ({
      role: prompt.role,
      content: prompt.content,
    }));

    // Add player context if available
    const messagesWithPrompts = player
      ? [this.createPlayerContext(player), ...systemMessages, ...messages]
      : [...systemMessages, ...messages];

    return messagesWithPrompts;
  }

  /**
   * Updates the active prompts
   * @param prompts New prompts to use
   */
  updatePrompts(prompts: PromptConfig[]): void {
    this.activePrompts = prompts;
  }
}
