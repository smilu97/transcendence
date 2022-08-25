import { Body, Controller, Delete, Get, HttpCode, Param, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ChatService } from "./chat.service";
import { ContentDto } from "./dto/content.dto";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
    ) {}

    @Post(':channelId/join')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse()
    async joinChannel(
        @Request() req,
        @Param('channelId') channelId: number,
    ) {
        await this.chatService.joinChannel(req.user.id, channelId);
    }

    @Delete(':channelId/leave')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse()
    async leaveChannel(
        @Request() req,
        @Param('channelId') channelId: number,
    ) {
        await this.chatService.leaveChannel(req.user.id, channelId);
    }

    @Post(':channelId/messages')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse()
    async talk(
        @Request() req,
        @Param('channelId') channelId: number,
        @Body() { content }: ContentDto,
    ) {
        await this.chatService.talk(req.user.id, channelId, content);
    }

    @Get(':channelId/messages')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse()
    async getMessages(
        @Request() req,
        @Param('channelId') channelId: number,
    ) {
        await this.chatService.getMessages(req.user.id, channelId);
    }
}