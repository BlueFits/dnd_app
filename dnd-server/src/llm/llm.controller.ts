import { Controller, Post, Body, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatRequest } from './llm.interface';
import { LLMService } from './llm.interface';
import OpenAI from 'openai';

@Controller('llm')
export class LLMController {
  constructor(
    @Inject('LLM_SERVICE')
    private readonly llmService: LLMService,
  ) {}

  @Post('stream')
  async stream(@Body() request: ChatRequest, @Res() res: Response) {
    const stream = await this.llmService.stream(
      request.messages,
      request.player,
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content =
        (chunk as OpenAI.Chat.Completions.ChatCompletionChunk).choices[0]?.delta
          ?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.end();
  }

  @Post('chat')
  async chat(@Body() request: ChatRequest) {
    return this.llmService.chat(request.messages, request.player);
  }
}
