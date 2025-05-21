import { Module } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { PromptManagerService } from './prompts/prompt-manager.service';
import { LLMController } from './llm.controller';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  controllers: [LLMController],
  providers: [
    {
      provide: 'LLM_SERVICE',
      useClass: OpenaiService,
    },
    {
      provide: 'CHARACTER_UPDATE_SERVICE',
      useClass: GeminiService,
    },
    PromptManagerService,
  ],
  exports: ['LLM_SERVICE', 'CHARACTER_UPDATE_SERVICE', PromptManagerService],
})
export class LLMModule {}
