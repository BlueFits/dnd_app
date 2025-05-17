import { Module } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { LLMController } from './llm.controller';
// import { LLMService } from './llm.interface';

@Module({
  controllers: [LLMController],
  providers: [
    {
      provide: 'LLM_SERVICE',
      useClass: OpenaiService,
    },
  ],
  exports: ['LLM_SERVICE'],
})
export class LLMModule {}
