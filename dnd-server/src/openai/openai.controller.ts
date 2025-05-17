import { Body, Controller, Post, Res } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Response } from 'express';
import OpenAI from 'openai';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat')
  async postOpenai(
    @Body('messages')
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    @Res() res: Response,
  ) {
    const stream = await this.openaiService.chat(messages);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.end();
  }
}
