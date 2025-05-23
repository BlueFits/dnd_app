import { Module } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { PromptManagerService } from './prompts/prompt-manager.service';
import { LLMController } from './llm.controller';
import { GeminiService } from '../gemini/gemini.service';
import { VeniceService } from '../venice/venice.service';

@Module({
  controllers: [LLMController],
  providers: [
    {
      provide: 'LLM_SERVICE',
      useClass: OpenaiService,
    },
    {
      provide: 'VENICE_SERVICE',
      useClass: VeniceService,
    },
    {
      provide: 'GAME_LOGIC_SERVICE',
      useClass: GeminiService,
    },
    PromptManagerService,
  ],
  exports: [
    'LLM_SERVICE',
    'VENICE_SERVICE',
    'GAME_LOGIC_SERVICE',
    PromptManagerService,
  ],
})
export class LLMModule {}
