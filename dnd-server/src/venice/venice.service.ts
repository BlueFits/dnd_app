import { Injectable } from '@nestjs/common';
import { Stream } from 'openai/streaming';
import { ChatMessage, LLMService, PlayerData } from '../llm/llm.interface';
import { PromptManagerService } from '../llm/prompts/prompt-manager.service';
import * as http from 'node:http';
import * as https from 'node:https';

interface VeniceResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content: string;
    };
    logprobs: null;
    finish_reason: string | null;
    stop_reason: null;
  }>;
}

@Injectable()
export class VeniceService implements LLMService {
  constructor(private readonly promptManager: PromptManagerService) {}

  private makeStreamRequest(
    options: http.RequestOptions,
    data: any,
  ): Stream<any> {
    const client = options.protocol === 'https:' ? https : http;
    let buffer = '';

    return new ReadableStream({
      start(controller) {
        const req = client.request(options, (res) => {
          res.on('data', (chunk) => {
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim() === '') continue;
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6)) as VeniceResponse;
                  controller.enqueue({
                    choices: [
                      {
                        delta: {
                          content: data.choices[0]?.delta?.content || '',
                        },
                      },
                    ],
                  });
                } catch {
                  console.error('Failed to parse chunk:', line);
                }
              }
            }
          });

          res.on('end', () => {
            if (buffer) {
              try {
                const data = JSON.parse(buffer.slice(6)) as VeniceResponse;
                controller.enqueue({
                  choices: [
                    {
                      delta: {
                        content: data.choices[0]?.delta?.content || '',
                      },
                    },
                  ],
                });
              } catch {
                console.error('Failed to parse final chunk:', buffer);
              }
            }
            controller.close();
          });
        });

        req.on('error', (error) => {
          console.error('Request error:', error);
          controller.error(error);
        });

        if (data) {
          req.write(JSON.stringify(data));
        }
        req.end();
      },
    }) as unknown as Stream<any>;
  }

  private makeRequest(
    options: http.RequestOptions,
    data: any,
  ): Promise<VeniceResponse> {
    return new Promise((resolve, reject) => {
      const client = options.protocol === 'https:' ? https : http;
      const req = client.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(responseData) as VeniceResponse);
            } catch {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`Venice API error: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  stream(
    messages: ChatMessage[],
    player: PlayerData,
    modifications?: ChatMessage[],
  ): Promise<Stream<any>> {
    const messagesWithPrompts = this.promptManager.applyPrompts(
      messages,
      player,
      modifications,
    );

    const options = {
      hostname: 'api.venice.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
      },
      protocol: 'https:',
    };

    const data = {
      model: 'venice-uncensored',
      messages: messagesWithPrompts,
      stream: true,
    };

    return Promise.resolve(this.makeStreamRequest(options, data));
  }

  async chat(
    messages: ChatMessage[],
    player: PlayerData,
    modifications?: ChatMessage[],
  ): Promise<string> {
    const messagesWithPrompts = this.promptManager.applyPrompts(
      messages,
      player,
      modifications,
    );

    const options = {
      hostname: 'api.venice.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
      },
      protocol: 'https:',
    };

    const data = {
      model: 'venice-1',
      messages: messagesWithPrompts,
    };

    const response = await this.makeRequest(options, data);
    return response.choices[0]?.delta?.content || '';
  }
}
