import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import {
  ChannelIdDto,
  ChannelJoinDto,
  ChatChannelDto,
  ChatMessageDto,
  ContentDto,
  CreateChannelDto,
} from './chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('channels')
  @HttpCode(200)
  @ApiOkResponse({ type: [ChatChannelDto] })
  async getChannels(): Promise<ChatChannelDto[]> {
    return (await this.chatService.getChannels()).map(
      (c) => new ChatChannelDto(c),
    );
  }

  @Get('my/channels')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ChatChannelDto] })
  async getJoinedChannels(@Request() req): Promise<ChatChannelDto[]> {
    return (await this.chatService.getJoinedChannels(req.user.id)).map(
      (c) => new ChatChannelDto(c),
    );
  }

  @Post('channels')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ChatChannelDto })
  async createChannel(@Request() req, @Body() body: CreateChannelDto) {
    const { name, type, password } = body;
    const channel = await this.chatService.createChannel(req.user.id, {
      name,
      type,
      password,
    });
    return new ChatChannelDto(channel);
  }

  @Post('join')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async joinChannel(
    @Request() req,
    @Body() { channelId, password }: ChannelJoinDto,
  ) {
    await this.chatService.joinChannel(req.user.id, channelId, password);
  }

  @Post('leave')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async leaveChannel(@Request() req, @Body() { channelId }: ChannelIdDto) {
    await this.chatService.leaveChannel(req.user.id, channelId);
  }

  @Post('channels/:channelId/messages')
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

  @Get('channels/:channelId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ChatMessageDto] })
  async getMessages(@Request() req, @Param('channelId') channelId: number) {
    return (await this.chatService.getMessages(req.user.id, channelId)).map(
      (e) => new ChatMessageDto(e),
    );
  }
}
