import { Module, forwardRef } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [forwardRef(() => LLMModule)],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
