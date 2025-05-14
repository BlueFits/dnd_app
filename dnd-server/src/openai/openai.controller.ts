import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) { }

    // @Get()
    // async getOpenai() {
    //     return this.openaiService.chat("Tell me a joke");
    // }

    @Post('chat')
    async postOpenai(@Body('prompt') prompt: string) {
        console.log("!!!", prompt);
        const response = await this.openaiService.chat(prompt)
        return { response };
    }
}
