import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ChatMessage,
  PlayerData,
  GameLogicService,
} from 'src/llm/llm.interface';
import { PromptManagerService } from '../llm/prompts/prompt-manager.service';

@Injectable()
export class GeminiService implements GameLogicService {
  private genAI: GoogleGenerativeAI;

  constructor(private readonly promptManager: PromptManagerService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  /* Will be used to update the character sheet based on the narration */
  async updateCharacter(
    messages: ChatMessage,
    player: PlayerData,
  ): Promise<PlayerData> {
    const playerContext = this.promptManager.createPlayerContext(player);

    // Old implementation using @google/genai
    /*
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Current player state: ${playerContext.content} Narration: ${typeof messages.content === 'string' ? messages.content : ''}`,
      config: {
        systemInstruction: ``,
      },
    });
    const content = response.text;
    */

    // New implementation using @google/generative-ai
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
    });
    const result = await model.generateContent({
      systemInstruction: `
          You are a DnD character manager AI.
          The user will provide the current character object and a narrated event. Based on that, return the fully updated player object.
          Rules:
          - Player object properties are in lowercase
          - Do not say anything but the JSON itself and do not add any new properties aside from the ones given
          - do not change the spelling of any of the property
          - For all other response keep it in the notes property
          - Add items and experience when appropriate
          - Level up if experience passes threshold (100 XP × current level)
          - If a level changes reset the experience to 0
          - Only change fields that logically should be updated
          - Always return a complete JSON object representing the new character
      `,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Current player state: ${playerContext.content} Narration: ${typeof messages.content === 'string' ? messages.content : ''}`,
            },
          ],
        },
      ],
    });
    const response = result.response;
    const content = response.candidates[0].content.parts[0].text;

    const clean = content
      .replace(/```json\n?/, '')
      .replace(/```\n?/, '')
      .trim();

    return JSON.parse(clean) as PlayerData;
  }

  async generateTags(narration: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
    });

    const result = await model.generateContent({
      systemInstruction: `
      You are a tag generator for a DnD game.
      CRITICAL INSTRUCTION - TAGS ARE MANDATORY:
      You MUST respond with [AMBIENCE] and [MUSIC] tags, no exceptions.
      These tags control the game'system and are required for proper functionality.

      Audio Management Rules:
      1. **Ambience** – represents the physical environment. Only change when the character moves to a new area.
      2. **Music** – represents the emotional tone. Only change when there's a clear shift in story tone.

      REQUIRED FORMAT:
      [AMBIENCE: category_name][MUSIC: category_name]

      Valid ambience categories (ONLY use these exact categories):
      - nature
      - civilized
      - ruin
      - indoor
      - danger
      - wild
      - mystic
      - water
      - sky
      - silence
      - rain

      Valid music categories (ONLY use these exact categories):
      - calm
      - suspense
      - fear
      - action
      - heroic
      - sorrow
      - hope
      - dark
      - wonder
      - silence

      IMPORTANT RULES:
      1. You MUST only answer in tags
      2. Never modify the tag format
      3. Never create new categories
      `,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Narration: ${narration}`,
            },
          ],
        },
      ],
    });

    const response = result.response;
    const content = response.candidates[0].content.parts[0].text;
    return content;
  }

  async checkContentSafety(message: string): Promise<boolean> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
    });

    const result = await model.generateContent({
      systemInstruction: `
      You are a content safety checker for a DnD game.
      Your task is to determine if the given message contains inappropriate content that requires censorship.

      Content that requires censorship includes:
      1. Explicit sexual content or references
      2. Graphic violence or gore
      3. Hate speech or discriminatory content
      4. Excessive profanity
      5. Content that promotes self-harm
      6. Content that could be triggering for players

      You must respond with ONLY "true" if the content requires censorship, or "false" if it's safe.
      Do not include any explanation or additional text in your response.
      `,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Message to check: ${message}`,
            },
          ],
        },
      ],
    });

    const response = result.response;
    const content = response.candidates[0].content.parts[0].text
      .trim()
      .toLowerCase();
    return content === 'true';
  }
}
