import { Controller, Post, Body, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  CharacterUpdateRequest,
  ChatRequest,
  LLMService,
  GameLogicService,
  ChatMessage,
} from './llm.interface';
import OpenAI from 'openai';

interface TagRequest {
  message: ChatMessage;
}

interface ContentSafetyRequest {
  message: string;
}

@Controller('llm')
export class LLMController {
  constructor(
    @Inject('LLM_SERVICE')
    private readonly llmService: LLMService,
    @Inject('VENICE_SERVICE')
    private readonly veniceService: LLMService,
    @Inject('GAME_LOGIC_SERVICE')
    private readonly gameLogicService: GameLogicService,
  ) {}

  @Post('stream')
  async stream(@Body() request: ChatRequest, @Res() res: Response) {
    // If content requires censorship, use Venice service
    let stream = null;

    if (request.requiresCensorship) {
      stream = await this.veniceService.stream(
        request.messages,
        request.player,
        request.modifications,
      );
    } else {
      stream = await this.llmService.stream(
        request.messages,
        request.player,
        request.modifications,
      );
    }

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
    return this.llmService.chat(
      request.messages,
      request.player,
      request.modifications,
    );
  }

  @Post('player-update')
  async playerUpdate(@Body() request: CharacterUpdateRequest) {
    return await this.gameLogicService.updateCharacter(
      request.messages,
      request.player,
    );
  }

  @Post('tags')
  async generateTags(@Body() request: TagRequest): Promise<string> {
    return await this.gameLogicService.generateTags(
      typeof request.message.content === 'string'
        ? request.message.content
        : '',
    );
  }

  @Post('content-safety')
  async checkContentSafety(
    @Body() request: ContentSafetyRequest,
  ): Promise<boolean> {
    return await this.gameLogicService.checkContentSafety(request.message);
  }
}
