import { Module } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { PromptManagerService } from './prompts/prompt-manager.service';
import { LLMController } from './llm.controller';
import { GeminiModule } from '../gemini/gemini.module';
// import { LLMService } from './llm.interface';

@Module({
  imports: [GeminiModule],
  controllers: [LLMController],
  providers: [
    {
      provide: 'LLM_SERVICE',
      useClass: OpenaiService,
    },
    PromptManagerService,
  ],
  exports: ['LLM_SERVICE', PromptManagerService],
})
export class LLMModule {}
