import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ResponseInput } from 'openai/resources/responses/responses';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat')
  async postOpenai(@Body('prompt') prompt: ResponseInput) {
    const response = await this.openaiService.chat(prompt);
    return { response };
  }
}
